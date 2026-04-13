// Stockfish Engine Wrapper
// Communicates with Stockfish WASM via Web Worker using UCI protocol

export interface AnalysisLine {
  depth: number;
  score: number;       // in centipawns (positive = white advantage)
  mate: number | null;  // mate in N moves (positive = white mates)
  pv: string[];        // principal variation (moves in UCI format)
  pvSan?: string[];    // principal variation in SAN format
  multipv: number;
}

export interface AnalysisResult {
  lines: AnalysisLine[];
  bestMove: string;
  depth: number;
  isReady: boolean;
}

type AnalysisCallback = (result: AnalysisResult) => void;

export class StockfishEngine {
  private worker: Worker | null = null;
  private isAnalyzing = false;
  private callback: AnalysisCallback | null = null;
  private currentLines: Map<number, AnalysisLine> = new Map();
  private depth = 20;
  private multiPV = 3;
  private _isLoaded = false;

  get loaded(): boolean {
    return this._isLoaded;
  }

  async init(): Promise<void> {
    return new Promise((resolve) => {
      try {
        const workerUrl = '/stockfish/stockfish-nnue-16-single.js';
        this.worker = new Worker(workerUrl);
        this.setupWorkerHandlers(resolve);
        this.worker.postMessage('uci');
      } catch (e) {
        console.error('Failed to instantiate local Stockfish worker:', e);
        this._isLoaded = false;
        resolve();
      }
    });
  }

  private setupWorkerHandlers(resolve: () => void): void {
    if (!this.worker) return;

    const timeout = setTimeout(() => {
      console.warn('Stockfish UCI handshake timeout');
      this._isLoaded = false;
      resolve();
    }, 10000);

    // Listen for UCI protocol messages
    this.worker.addEventListener('message', (e) => {
      const line = typeof e.data === 'string' ? e.data : String(e.data);
      this.handleMessage(line);

      if (line === 'uciok') {
        this.worker!.postMessage('setoption name MultiPV value ' + this.multiPV);
        this.worker!.postMessage('setoption name Threads value 1');
        this.worker!.postMessage('isready');
      }

      if (line === 'readyok' && !this._isLoaded) {
        clearTimeout(timeout);
        this._isLoaded = true;

        resolve();
      }
    });
  }

  private handleMessage(line: string): void {
    if (line.startsWith('info depth')) {
      this.parseInfoLine(line);
    } else if (line.startsWith('bestmove')) {
      const parts = line.split(' ');
      const bestMove = parts[1] || '';
      this.isAnalyzing = false;

      const result: AnalysisResult = {
        lines: Array.from(this.currentLines.values()).sort((a, b) => a.multipv - b.multipv),
        bestMove,
        depth: this.depth,
        isReady: true,
      };

      if (this.callback) {
        this.callback(result);
      }

      if (this.pendingFen && this.pendingCallback) {
        const fen = this.pendingFen;
        const cb = this.pendingCallback;
        const d = this.pendingDepth;
        this.pendingFen = null;
        this.pendingCallback = null;
        this.pendingDepth = null;
        this.analyze(fen, cb, d !== null ? d : undefined);
      }
    }
  }

  private lastCallbackTime = 0;

  private parseInfoLine(line: string): void {
    const parts = line.split(' ');
    const getVal = (key: string): string | undefined => {
      const idx = parts.indexOf(key);
      return idx >= 0 ? parts[idx + 1] : undefined;
    };

    const depth = parseInt(getVal('depth') || '0');
    const multipv = parseInt(getVal('multipv') || '1');

    // Parse score
    const scoreIdx = parts.indexOf('score');
    let score = 0;
    let mate: number | null = null;
    if (scoreIdx >= 0) {
      if (parts[scoreIdx + 1] === 'cp') {
        score = parseInt(parts[scoreIdx + 2] || '0');
      } else if (parts[scoreIdx + 1] === 'mate') {
        mate = parseInt(parts[scoreIdx + 2] || '0');
        score = mate > 0 ? 100000 - mate : -100000 - mate;
      }
    }

    // Parse PV
    const pvIdx = parts.indexOf('pv');
    const pv = pvIdx >= 0 ? parts.slice(pvIdx + 1) : [];

    if (depth > 0 && pv.length > 0) {
      this.currentLines.set(multipv, {
        depth,
        score,
        mate,
        pv,
        multipv,
      });

      // Send intermediate results, max ~16 updates per second to fix lag
      const now = Date.now();
      if (this.callback && now - this.lastCallbackTime > 60) {
        this.lastCallbackTime = now;
        const result: AnalysisResult = {
          lines: Array.from(this.currentLines.values()).sort((a, b) => a.multipv - b.multipv),
          bestMove: pv[0] || '',
          depth,
          isReady: false,
        };
        this.callback(result);
      }
    }
  }

  private pendingFen: string | null = null;
  private pendingCallback: AnalysisCallback | null = null;
  private pendingDepth: number | null = null;

  analyze(fen: string, callback: AnalysisCallback, depth?: number): void {
    if (!this.worker || !this._isLoaded) {
      callback({ lines: [], bestMove: '', depth: 0, isReady: true });
      return;
    }

    if (this.isAnalyzing) {
      this.pendingFen = fen;
      this.pendingCallback = callback;
      this.pendingDepth = depth || null;
      this.stop();
      return;
    }

    this.callback = callback;
    this.currentLines.clear();

    const d = depth || this.depth;
    this.worker.postMessage('position fen ' + fen);
    this.worker.postMessage('go depth ' + d);
    this.isAnalyzing = true;
  }

  stop(): void {
    if (this.worker && this.isAnalyzing) {
      this.worker.postMessage('stop');
      // We do NOT set isAnalyzing = false here, we wait for 'bestmove'
    }
  }

  setDepth(depth: number): void {
    this.depth = Math.max(1, Math.min(30, depth));
  }

  setMultiPV(multiPV: number): void {
    this.multiPV = Math.max(1, Math.min(5, multiPV));
    if (this.worker && this._isLoaded) {
      this.worker.postMessage('setoption name MultiPV value ' + this.multiPV);
    }
  }

  getDepth(): number {
    return this.depth;
  }

  destroy(): void {
    this.stop();
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }

  // Convert centipawns to human-readable score
  static formatScore(score: number, mate: number | null): string {
    if (mate !== null) {
      return mate > 0 ? `M${mate}` : `M${mate}`;
    }
    const pawnScore = score / 100;
    const sign = pawnScore >= 0 ? '+' : '';
    return `${sign}${pawnScore.toFixed(1)}`;
  }

  // Convert score to evaluation bar percentage (0-100, 50 = equal)
  static scoreToBarPercent(score: number, mate: number | null): number {
    if (mate !== null) {
      return mate > 0 ? 95 : 5;
    }
    // Use sigmoid function for smooth mapping
    const pawnScore = score / 100;
    const percent = 50 + 50 * (2 / (1 + Math.exp(-0.4 * pawnScore)) - 1);
    return Math.max(2, Math.min(98, percent));
  }
}
