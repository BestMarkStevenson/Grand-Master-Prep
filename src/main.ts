// Main Application — GrandMaster Prep
import './style.css';
import { Chess } from 'chess.js';
import { ChessBoard } from './components/board';
import { StockfishEngine } from './engine/stockfish';
import { SpacedRepetition } from './core/spaced-repetition';
import { RepertoireManager } from './core/repertoire';
import type { OpeningLine } from './data/londonSystem';
import type { Square, PieceSymbol } from 'chess.js';

type Page = 'dashboard' | 'learn' | 'train' | 'analyze' | 'stats';

class App {
  private board!: ChessBoard;
  private engine: StockfishEngine;
  private srs: SpacedRepetition;
  private repertoire: RepertoireManager;
  private game: Chess;
  private currentPage: Page = 'dashboard';
  private engineEnabled = false;
  private selectedOpening: string | null = null;
  private selectedLine: OpeningLine | null = null;
  private trainingQueue: OpeningLine[] = [];
  private trainingIndex = 0;
  private trainMoveIndex = 0;
  private trainState: 'waiting' | 'correct' | 'incorrect' | 'complete' | 'show' = 'waiting';
  private learnMoveIndex = 0;
  private sessionStats = { correct: 0, incorrect: 0, total: 0 };
  private hintTimeout: ReturnType<typeof setTimeout> | null = null;
  private currentLineFailed = false;

  constructor() {
    this.engine = new StockfishEngine();
    this.srs = new SpacedRepetition();
    this.repertoire = new RepertoireManager(this.srs);
    this.game = new Chess();
    this.init();
  }

  private async init(): Promise<void> {
    this.renderShell();
    this.navigateTo('dashboard');
    // Init engine in background
    this.engine.init().then(() => {
      this.updateEngineStatus();
    });
  }

  private renderShell(): void {
    const app = document.getElementById('app')!;
    app.innerHTML = `
      <nav class="sidebar" id="sidebar">
        <div class="sidebar-logo">
          <span class="sidebar-logo-icon">♚</span>
          <span class="sidebar-logo-text">GM Prep</span>
        </div>
        <div class="sidebar-nav">
          <div class="nav-item active" data-page="dashboard" id="nav-dashboard">
            <span class="nav-icon">📊</span>
            <span>Dashboard</span>
            <span class="nav-badge" id="due-badge" style="display:none">0</span>
          </div>
          <div class="nav-item" data-page="learn" id="nav-learn">
            <span class="nav-icon">📖</span>
            <span>Learn</span>
          </div>
          <div class="nav-item" data-page="train" id="nav-train">
            <span class="nav-icon">🎯</span>
            <span>Train</span>
          </div>
          <div class="nav-item" data-page="analyze" id="nav-analyze">
            <span class="nav-icon">🔬</span>
            <span>Analyze</span>
          </div>
          <div class="nav-item" data-page="stats" id="nav-stats">
            <span class="nav-icon">📈</span>
            <span>Statistics</span>
          </div>
        </div>
        <div class="sidebar-footer">
          <div class="engine-status" id="engine-status">
            <span class="engine-dot" id="engine-dot"></span>
            <span id="engine-label">Stockfish loading...</span>
          </div>
        </div>
      </nav>
      <main class="main-content" id="main-content"></main>
    `;

    // Nav click handlers
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const page = (item as HTMLElement).dataset.page as Page;
        if (page) this.navigateTo(page);
      });
    });

    this.updateDueBadge();
  }

  private navigateTo(page: Page): void {
    this.currentPage = page;
    this.engine.stop();
    if (this.hintTimeout) clearTimeout(this.hintTimeout);

    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', (item as HTMLElement).dataset.page === page);
    });

    const main = document.getElementById('main-content')!;
    switch (page) {
      case 'dashboard': this.renderDashboard(main); break;
      case 'learn': this.renderLearn(main); break;
      case 'train': this.renderTrain(main); break;
      case 'analyze': this.renderAnalyze(main); break;
      case 'stats': this.renderStats(main); break;
    }
  }

  // ===== DASHBOARD =====
  private renderDashboard(container: HTMLElement): void {
    const stats = this.srs.getStats();
    const dueLines = this.repertoire.getDueLines();
    const newLines = this.repertoire.getNewLines();

    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">Dashboard</div>
          <div class="page-subtitle">Your path to Grandmaster</div>
        </div>
      </div>
      <div class="page-body" style="flex-direction:column;max-width:900px;">
        <div class="dashboard-grid">
          <div class="stat-card">
            <span class="stat-card-label">Due Today</span>
            <span class="stat-card-value">${stats.dueNow}</span>
            <span class="stat-card-sub">lines to review</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-label">Accuracy</span>
            <span class="stat-card-value">${stats.accuracy}%</span>
            <span class="stat-card-sub">overall</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-label">Streak</span>
            <span class="stat-card-value">${stats.currentStreak}</span>
            <span class="stat-card-sub">days</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-label">Mastered</span>
            <span class="stat-card-value">${stats.masteredCards}</span>
            <span class="stat-card-sub">of ${stats.totalCards} lines</span>
          </div>
        </div>

        ${stats.dueNow > 0 ? `
          <button class="btn btn-primary btn-lg" id="start-review" style="align-self:center;margin:var(--space-md) 0;">
            🎯 Start Review (${stats.dueNow} lines due)
          </button>
        ` : newLines.length > 0 ? `
          <button class="btn btn-primary btn-lg" id="start-learn-new" style="align-self:center;margin:var(--space-md) 0;">
            📖 Learn New Lines (${newLines.length} available)
          </button>
        ` : `
          <div class="annotation-box" style="align-self:center;text-align:center;max-width:400px;margin:var(--space-md) 0;">
            <strong>All caught up! 🎉</strong><br>No reviews due. Come back later or learn new lines.
          </div>
        `}

        <div class="section-title">Your Repertoire</div>
        <div class="opening-grid">
          ${this.repertoire.getOpenings().map(op => {
            const opLines = this.repertoire.getLinesByOpening(op.id);
            const masteredCount = opLines.filter(l => {
              const c = this.srs.getCard(l.id);
              return c && c.level >= 7;
            }).length;
            return `
              <div class="opening-card" data-opening="${op.id}">
                <div class="opening-card-icon">${op.color === 'white' ? '♔' : '♚'}</div>
                <div class="opening-card-title">${op.name}</div>
                <div class="opening-card-desc">${op.description.substring(0, 120)}...</div>
                <div class="progress-bar" style="margin-bottom:var(--space-sm);">
                  <div class="progress-bar-fill" style="width:${(masteredCount / opLines.length * 100).toFixed(0)}%"></div>
                </div>
                <div class="opening-card-meta">
                  <span>📝 ${opLines.length} lines</span>
                  <span>✅ ${masteredCount} mastered</span>
                  <span>${op.color === 'white' ? '⬜ White' : '⬛ Black'}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    document.getElementById('start-review')?.addEventListener('click', () => this.navigateTo('train'));
    document.getElementById('start-learn-new')?.addEventListener('click', () => this.navigateTo('learn'));
    document.querySelectorAll('.opening-card').forEach(card => {
      card.addEventListener('click', () => {
        this.selectedOpening = (card as HTMLElement).dataset.opening || null;
        this.navigateTo('learn');
      });
    });
  }

  // ===== LEARN =====
  private renderLearn(container: HTMLElement): void {
    if (!this.selectedOpening) {
      this.renderOpeningSelector(container, 'learn');
      return;
    }

    const opening = this.repertoire.getOpening(this.selectedOpening)!;
    const lines = this.repertoire.getLinesByOpening(this.selectedOpening);

    if (!this.selectedLine) {
      // Show chapter list
      container.innerHTML = `
        <div class="page-header">
          <div>
            <div class="page-title">${opening.name}</div>
            <div class="page-subtitle">Select a line to learn</div>
          </div>
          <button class="btn btn-secondary" id="back-btn">← Back</button>
        </div>
        <div class="page-body" style="flex-direction:column;max-width:700px;">
          <div class="annotation-box" style="margin-bottom:var(--space-lg);">
            <strong>Key Themes:</strong><br>
            ${opening.themes.map(t => `• ${t}`).join('<br>')}
          </div>
          ${opening.chapters.map(ch => {
            const chLines = lines.filter(l => l.chapter === ch);
            if (chLines.length === 0) return '';
            return `
              <div class="section-title">${ch}</div>
              <div class="line-list" style="margin-bottom:var(--space-lg);">
                ${chLines.map(l => {
                  const card = this.srs.getCard(l.id);
                  const status = card ? SpacedRepetition.getStatusClass(card) : 'new';
                  const level = card ? `Lv${card.level}` : 'New';
                  return `
                    <div class="line-item" data-line="${l.id}">
                      <span class="line-status ${status}"></span>
                      <span class="line-name">${l.name}</span>
                      <span class="line-level">${level}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            `;
          }).join('')}
        </div>
      `;

      document.getElementById('back-btn')?.addEventListener('click', () => {
        this.selectedOpening = null;
        this.navigateTo('learn');
      });
      document.querySelectorAll('.line-item').forEach(item => {
        item.addEventListener('click', () => {
          const lineId = (item as HTMLElement).dataset.line!;
          this.selectedLine = this.repertoire.getLine(lineId) || null;
          this.learnMoveIndex = 0;
          this.navigateTo('learn');
        });
      });
      return;
    }

    // Show line learning view
    this.renderLearnLine(container);
  }

  private renderLearnLine(container: HTMLElement): void {
    const line = this.selectedLine!;
    const opening = this.repertoire.getOpeningForLine(line.id)!;
    const flipped = opening.color === 'black';

    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">${line.name}</div>
          <div class="page-subtitle">${opening.name} — ${line.chapter}</div>
        </div>
        <button class="btn btn-secondary" id="back-btn">← Back</button>
      </div>
      <div class="page-body">
        <div class="board-container">
          <div class="board-wrapper" id="learn-board"></div>
          <div class="board-controls">
            <button class="board-btn" id="learn-start">⏮ Start</button>
            <button class="board-btn" id="learn-prev">◀ Back</button>
            <button class="board-btn" id="learn-next">Next ▶</button>
            <button class="board-btn" id="learn-end">End ⏭</button>
            <button class="board-btn" id="learn-flip">🔄 Flip</button>
          </div>
          <div class="progress-bar" style="width:100%;margin-top:var(--space-sm);">
            <div class="progress-bar-fill" id="learn-progress" style="width:0%"></div>
          </div>
          <div class="progress-stats">
            <span id="learn-move-label">Move 0 / ${line.moves.length}</span>
            <span id="learn-ply-label"></span>
          </div>
        </div>
        <div class="side-panel">
          <div class="panel" id="eval-panel">
            <div class="panel-header">
              <span class="panel-title">Stockfish 16.1</span>
              <span class="analysis-depth" id="analysis-depth">Depth: 0</span>
            </div>
            <div class="panel-body">
              <div class="eval-bar-container" style="margin-bottom:var(--space-sm);">
                <div class="eval-bar" style="height:14px;">
                  <div class="eval-bar-fill" id="eval-bar-fill" style="width:50%"></div>
                </div>
                <div class="eval-score equal" id="eval-score" style="font-size:13px;padding:2px 6px;">0.0</div>
              </div>
              <div class="analysis-lines" id="analysis-lines" style="max-height:80px;overflow:hidden;"></div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">Moves</span>
            </div>
            <div class="panel-body">
              <div class="move-list" id="learn-moves"></div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">Annotation</span>
            </div>
            <div class="panel-body">
              <div class="annotation-box" id="learn-annotation">
                Click "Next" to step through the opening line.
              </div>
            </div>
          </div>
          <button class="btn btn-primary btn-lg" id="start-training-line" style="width:100%;">
            🎯 Train This Line
          </button>
        </div>
      </div>
    `;

    this.board = new ChessBoard({
      container: document.getElementById('learn-board')!,
      flipped,
      interactive: false,
    });

    this.game = new Chess();
    this.updateLearnView();

    document.getElementById('back-btn')?.addEventListener('click', () => {
      this.selectedLine = null;
      this.navigateTo('learn');
    });
    document.getElementById('learn-start')?.addEventListener('click', () => { this.learnMoveIndex = 0; this.rebuildLearnPosition(); });
    document.getElementById('learn-prev')?.addEventListener('click', () => { if (this.learnMoveIndex > 0) { this.learnMoveIndex--; this.rebuildLearnPosition(); } });
    document.getElementById('learn-next')?.addEventListener('click', () => { if (this.learnMoveIndex < this.selectedLine!.moves.length) { this.learnMoveIndex++; this.rebuildLearnPosition(); } });
    document.getElementById('learn-end')?.addEventListener('click', () => { this.learnMoveIndex = this.selectedLine!.moves.length; this.rebuildLearnPosition(); });
    document.getElementById('learn-flip')?.addEventListener('click', () => { this.board.setFlipped(!this.board.isFlipped()); });
    document.getElementById('start-training-line')?.addEventListener('click', () => {
      this.trainingQueue = [this.selectedLine!];
      this.trainingIndex = 0;
      this.startTrainingLine();
      this.navigateTo('train');
    });

    // Keyboard navigation
    const keyHandler = (e: KeyboardEvent) => {
      if (this.currentPage !== 'learn' || !this.selectedLine) return;
      if (e.key === 'ArrowRight') { document.getElementById('learn-next')?.click(); }
      if (e.key === 'ArrowLeft') { document.getElementById('learn-prev')?.click(); }
    };
    document.addEventListener('keydown', keyHandler);
  }

  private rebuildLearnPosition(): void {
    this.game = new Chess();
    const line = this.selectedLine!;
    for (let i = 0; i < this.learnMoveIndex && i < line.moves.length; i++) {
      try { this.game.move(line.moves[i]); } catch { break; }
    }
    this.board.setPosition(this.game.fen());
    if (this.learnMoveIndex > 0) {
      const hist = this.game.history({ verbose: true });
      const last = hist[hist.length - 1];
      if (last) this.board.setLastMove(last.from as Square, last.to as Square);
    } else {
      this.board.clearLastMove();
    }
    this.updateLearnView();
    this.runAnalysis();
  }

  private updateLearnView(): void {
    const line = this.selectedLine!;
    const progress = line.moves.length > 0 ? (this.learnMoveIndex / line.moves.length * 100) : 0;
    const progressEl = document.getElementById('learn-progress');
    if (progressEl) progressEl.style.width = `${progress}%`;

    const moveLabel = document.getElementById('learn-move-label');
    if (moveLabel) moveLabel.textContent = `Move ${this.learnMoveIndex} / ${line.moves.length}`;

    // Annotation
    const ann = document.getElementById('learn-annotation');
    if (ann) {
      const annotation = line.annotations[this.learnMoveIndex];
      if (annotation) {
        ann.innerHTML = `<strong>${line.moves[this.learnMoveIndex - 1] || 'Start'}:</strong> ${annotation}`;
      } else if (this.learnMoveIndex === 0) {
        ann.innerHTML = 'Click <strong>Next ▶</strong> or press <strong>→</strong> to step through the line.';
      } else {
        ann.innerHTML = `<strong>${this.learnMoveIndex}. ${line.moves[this.learnMoveIndex - 1]}</strong>`;
      }
    }

    // Move list
    const moveList = document.getElementById('learn-moves');
    if (moveList) {
      let html = '';
      for (let i = 0; i < line.moves.length; i++) {
        if (i % 2 === 0) {
          html += `<span class="move-number">${Math.floor(i / 2) + 1}.</span>`;
        }
        const active = i < this.learnMoveIndex ? (i === this.learnMoveIndex - 1 ? 'active' : 'last') : '';
        html += `<span class="move-cell ${active}" data-idx="${i}">${line.moves[i]}</span>`;
      }
      moveList.innerHTML = html;
      moveList.querySelectorAll('.move-cell').forEach(cell => {
        cell.addEventListener('click', () => {
          this.learnMoveIndex = parseInt((cell as HTMLElement).dataset.idx!) + 1;
          this.rebuildLearnPosition();
        });
      });
    }
  }

  // ===== TRAIN =====
  private renderTrain(container: HTMLElement): void {
    if (this.trainingQueue.length > 0) {
      this.renderTrainingSession(container);
      return;
    }

    const dueLines = this.repertoire.getDueLines();
    const newLines = this.repertoire.getNewLines();

    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">Training</div>
          <div class="page-subtitle">Spaced repetition review</div>
        </div>
      </div>
      <div class="page-body" style="flex-direction:column;max-width:700px;">
        ${dueLines.length > 0 ? `
          <div class="stat-card" style="margin-bottom:var(--space-lg);">
            <span class="stat-card-label">Lines Due for Review</span>
            <span class="stat-card-value">${dueLines.length}</span>
            <button class="btn btn-primary btn-lg" id="start-due-review" style="margin-top:var(--space-md);">
              🎯 Start Review Session
            </button>
          </div>
        ` : `
          <div class="annotation-box" style="margin-bottom:var(--space-lg);text-align:center;">
            <strong>No reviews due!</strong> All caught up. 🎉
          </div>
        `}

        ${newLines.length > 0 ? `
          <div class="stat-card" style="margin-bottom:var(--space-lg);">
            <span class="stat-card-label">New Lines to Learn</span>
            <span class="stat-card-value">${newLines.length}</span>
            <button class="btn btn-secondary btn-lg" id="start-new-learn" style="margin-top:var(--space-md);">
              📖 Learn 5 New Lines
            </button>
          </div>
        ` : ''}

        <div class="section-title">Train by Opening</div>
        <div class="opening-grid">
          ${this.repertoire.getOpenings().map(op => {
            const opDue = this.repertoire.getLinesByOpening(op.id).filter(l => {
              const c = this.srs.getCard(l.id);
              return c && c.nextReview <= Date.now();
            }).length;
            return `
              <div class="opening-card" data-train-opening="${op.id}">
                <div class="opening-card-icon">${op.color === 'white' ? '♔' : '♚'}</div>
                <div class="opening-card-title">${op.name}</div>
                <div class="opening-card-meta">
                  <span>🎯 ${opDue} due</span>
                  <span>📝 ${this.repertoire.getLinesByOpening(op.id).length} total</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    document.getElementById('start-due-review')?.addEventListener('click', () => {
      this.trainingQueue = dueLines;
      this.trainingIndex = 0;
      this.sessionStats = { correct: 0, incorrect: 0, total: 0 };
      this.startTrainingLine();
      this.renderTrain(container);
    });

    document.getElementById('start-new-learn')?.addEventListener('click', () => {
      this.trainingQueue = newLines.slice(0, 5);
      this.trainingIndex = 0;
      this.sessionStats = { correct: 0, incorrect: 0, total: 0 };
      this.startTrainingLine();
      this.renderTrain(container);
    });

    document.querySelectorAll('[data-train-opening]').forEach(card => {
      card.addEventListener('click', () => {
        const openingId = (card as HTMLElement).dataset.trainOpening!;
        const lines = this.repertoire.getLinesByOpening(openingId);
        this.trainingQueue = lines;
        this.trainingIndex = 0;
        this.sessionStats = { correct: 0, incorrect: 0, total: 0 };
        this.startTrainingLine();
        this.renderTrain(container);
      });
    });
  }

  private startTrainingLine(): void {
    if (this.trainingIndex >= this.trainingQueue.length) {
      this.trainState = 'complete';
      return;
    }
    this.selectedLine = this.trainingQueue[this.trainingIndex];
    this.trainMoveIndex = 0;
    this.trainState = 'waiting';
    this.currentLineFailed = false; // Reset the failure flag for the new line
    this.game = new Chess();
    // Play opponent moves until it's the player's turn
    this.playOpponentMoves();
  }

  private playOpponentMoves(): void {
    const line = this.selectedLine!;
    const opening = this.repertoire.getOpeningForLine(line.id)!;
    const playerColor = opening.color;

    while (this.trainMoveIndex < line.moves.length) {
      const isWhiteMove = this.trainMoveIndex % 2 === 0;
      const isPlayerMove = (playerColor === 'white' && isWhiteMove) || (playerColor === 'black' && !isWhiteMove);
      if (isPlayerMove) break;

      try {
        this.game.move(line.moves[this.trainMoveIndex]);
        this.trainMoveIndex++;
      } catch { break; }
    }

    if (this.trainMoveIndex >= line.moves.length) {
      // Line complete!
      this.srs.markCorrect(line.id);
      this.sessionStats.correct++;
      this.sessionStats.total++;
      this.trainState = 'correct';
      this.advanceTraining();
    }
  }

  private advanceTraining(): void {
    this.trainingIndex++;
    if (this.trainingIndex >= this.trainingQueue.length) {
      this.trainState = 'complete';
    }
  }

  private renderTrainingSession(container: HTMLElement): void {
    if (this.trainState === 'complete') {
      this.renderTrainingComplete(container);
      return;
    }

    const line = this.selectedLine!;
    const opening = this.repertoire.getOpeningForLine(line.id)!;
    const flipped = opening.color === 'black';
    const card = this.srs.getCard(line.id);

    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">Training: ${line.name}</div>
          <div class="page-subtitle">${opening.name} — Line ${this.trainingIndex + 1} of ${this.trainingQueue.length}</div>
        </div>
        <div class="training-info">
          <div class="training-info-item">✅ <strong>${this.sessionStats.correct}</strong></div>
          <div class="training-info-item">❌ <strong>${this.sessionStats.incorrect}</strong></div>
          <div class="training-info-item">Level: <strong>${card ? card.level : 0}</strong></div>
        </div>
      </div>
      <div class="page-body">
        <div class="board-container">
          <div class="board-wrapper" id="train-board"></div>
          <div class="progress-bar" style="width:100%;margin-top:var(--space-md);">
            <div class="progress-bar-fill" id="train-progress" style="width:${(this.trainMoveIndex / line.moves.length * 100)}%"></div>
          </div>
        </div>
        <div class="side-panel">
          <div class="panel" id="eval-panel">
            <div class="panel-header">
              <span class="panel-title">Stockfish 16.1</span>
              <span class="analysis-depth" id="analysis-depth">Depth: 0</span>
            </div>
            <div class="panel-body">
              <div class="eval-bar-container" style="margin-bottom:var(--space-sm);">
                <div class="eval-bar" style="height:14px;">
                  <div class="eval-bar-fill" id="eval-bar-fill" style="width:50%"></div>
                </div>
                <div class="eval-score equal" id="eval-score" style="font-size:13px;padding:2px 6px;">0.0</div>
              </div>
            </div>
          </div>
          <div class="trainer-feedback ${this.trainState}" id="train-feedback">
            ${this.getTrainFeedback()}
          </div>
          <div class="panel">
            <div class="panel-header"><span class="panel-title">Your Move</span></div>
            <div class="panel-body">
              <div class="annotation-box" id="train-hint">
                Play the correct move for ${opening.color === 'white' ? 'White' : 'Black'}. 
                ${this.trainMoveIndex > 0 ? `Move ${Math.floor(this.trainMoveIndex / 2) + 1}` : 'First move'}
              </div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-header"><span class="panel-title">Moves Played</span></div>
            <div class="panel-body">
              <div class="move-list" id="train-moves">${this.buildTrainMoveList()}</div>
            </div>
          </div>
          <div style="display:flex;gap:var(--space-sm);">
            <button class="btn btn-secondary" id="train-skip" style="flex:1;">Skip Line →</button>
            <button class="btn btn-danger" id="train-quit" style="flex:1;">End Session</button>
          </div>
        </div>
      </div>
    `;

    this.board = new ChessBoard({
      container: document.getElementById('train-board')!,
      flipped,
      interactive: true,
      onMove: (from, to, promotion) => this.handleTrainMove(from, to, promotion),
    });

    this.board.setPosition(this.game.fen());
    if (this.trainMoveIndex > 0) {
      const hist = this.game.history({ verbose: true });
      const last = hist[hist.length - 1];
      if (last) this.board.setLastMove(last.from as Square, last.to as Square);
    }

    // Set up hint timer
    this.setupHintTimer();

    document.getElementById('train-skip')?.addEventListener('click', () => {
      this.srs.markIncorrect(line.id);
      this.sessionStats.incorrect++;
      this.sessionStats.total++;
      this.advanceTraining();
      this.startTrainingLine();
      this.renderTrain(container);
    });

    document.getElementById('train-quit')?.addEventListener('click', () => {
      this.trainState = 'complete';
      this.renderTrain(container);
    });
  }

  private handleTrainMove(from: Square, to: Square, promotion?: PieceSymbol): boolean {
    const line = this.selectedLine!;
    if (this.trainMoveIndex >= line.moves.length) return false;

    const expectedMove = line.moves[this.trainMoveIndex];

    // Try the move
    const testGame = new Chess(this.game.fen());
    const move = testGame.move({ from, to, promotion: promotion || 'q' });
    if (!move) return false;

    // Check if it matches the expected move
    if (move.san === expectedMove) {
      // Correct!
      this.game.move({ from, to, promotion: promotion || 'q' });
      this.trainMoveIndex++;
      this.trainState = 'correct';

      this.board.setPosition(this.game.fen());
      this.board.setLastMove(from, to);

      // Play opponent's response after a brief delay
      setTimeout(() => {
        this.playOpponentMoves();
        if (this.trainMoveIndex >= line.moves.length) {
          if (!this.currentLineFailed) {
            this.srs.markCorrect(line.id);
            this.sessionStats.correct++;
          }
          this.sessionStats.total++;
          this.trainState = 'correct';
          // Auto advance after 1.5s
          setTimeout(() => {
            this.advanceTraining();
            this.startTrainingLine();
            const main = document.getElementById('main-content')!;
            this.renderTrain(main);
          }, 1500);
        }
        this.board.setPosition(this.game.fen());
        const hist = this.game.history({ verbose: true });
        const last = hist[hist.length - 1];
        if (last) this.board.setLastMove(last.from as Square, last.to as Square);
        this.updateTrainUI();
        this.setupHintTimer();
      }, 400);

      this.updateTrainUI();
      return true;
    } else {
      // Incorrect!
      this.trainState = 'incorrect';

      // Show the correct move with an arrow
      const correctGame = new Chess(this.game.fen());
      const correctMove = correctGame.move(expectedMove);
      if (correctMove) {
        this.board.setArrows([{
          from: correctMove.from as Square,
          to: correctMove.to as Square,
        }]);
      }

      if (!this.currentLineFailed) {
        this.srs.markIncorrect(line.id);
        this.sessionStats.incorrect++;
        this.currentLineFailed = true;
      }

      this.updateTrainUI();

      // Show correct answer arrow, then clear it, but let user finish the line
      setTimeout(() => {
        this.board.clearArrows();
        // If they haven't made a correct move yet, reset state to waiting
        if (this.trainState === 'incorrect') {
          this.trainState = 'waiting';
          this.updateTrainUI();
        }
      }, 3000);

      return false;
    }
  }

  private setupHintTimer(): void {
    if (this.hintTimeout) clearTimeout(this.hintTimeout);
    this.hintTimeout = setTimeout(() => {
      if (this.trainState === 'waiting' && this.selectedLine) {
        const line = this.selectedLine;
        if (this.trainMoveIndex < line.moves.length) {
          const hintGame = new Chess(this.game.fen());
          const hintMove = hintGame.move(line.moves[this.trainMoveIndex]);
          if (hintMove) {
            this.board.setHint(hintMove.from as Square);
          }
        }
      }
    }, 8000);
  }

  private updateTrainUI(): void {
    const feedback = document.getElementById('train-feedback');
    if (feedback) {
      feedback.className = `trainer-feedback ${this.trainState}`;
      feedback.innerHTML = this.getTrainFeedback();
    }
    const progress = document.getElementById('train-progress');
    if (progress && this.selectedLine) {
      progress.style.width = `${(this.trainMoveIndex / this.selectedLine.moves.length * 100)}%`;
    }
    const moveList = document.getElementById('train-moves');
    if (moveList) {
      moveList.innerHTML = this.buildTrainMoveList();
    }
    this.runAnalysis();
  }

  private getTrainFeedback(): string {
    switch (this.trainState) {
      case 'correct': return '✅ Correct! Well played.';
      case 'incorrect': return '❌ Incorrect — see the correct move shown by the arrow.';
      case 'waiting': return '🤔 Your move...';
      case 'complete': return '🎉 Training complete!';
      case 'show': return '👀 Study this move.';
      default: return '';
    }
  }

  private buildTrainMoveList(): string {
    if (!this.selectedLine) return '';
    let html = '';
    for (let i = 0; i < this.trainMoveIndex && i < this.selectedLine.moves.length; i++) {
      if (i % 2 === 0) html += `<span class="move-number">${Math.floor(i / 2) + 1}.</span>`;
      html += `<span class="move-cell last">${this.selectedLine.moves[i]}</span>`;
    }
    return html;
  }

  private renderTrainingComplete(container: HTMLElement): void {
    const accuracy = this.sessionStats.total > 0 ? Math.round(this.sessionStats.correct / this.sessionStats.total * 100) : 0;

    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">Session Complete! 🎉</div>
          <div class="page-subtitle">Great work on your opening training</div>
        </div>
      </div>
      <div class="page-body" style="flex-direction:column;align-items:center;max-width:500px;">
        <div class="dashboard-grid" style="width:100%;">
          <div class="stat-card">
            <span class="stat-card-label">Correct</span>
            <span class="stat-card-value">${this.sessionStats.correct}</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-label">Incorrect</span>
            <span class="stat-card-value" style="background:linear-gradient(135deg,#ef4444,#f87171);-webkit-background-clip:text;">${this.sessionStats.incorrect}</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-label">Accuracy</span>
            <span class="stat-card-value">${accuracy}%</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-label">Lines</span>
            <span class="stat-card-value">${this.sessionStats.total}</span>
          </div>
        </div>
        <div style="display:flex;gap:var(--space-md);margin-top:var(--space-xl);">
          <button class="btn btn-primary btn-lg" id="back-dashboard">📊 Dashboard</button>
          <button class="btn btn-secondary btn-lg" id="train-again">🎯 Train Again</button>
        </div>
      </div>
    `;

    this.trainingQueue = [];
    this.trainState = 'waiting';

    document.getElementById('back-dashboard')?.addEventListener('click', () => this.navigateTo('dashboard'));
    document.getElementById('train-again')?.addEventListener('click', () => {
      this.trainState = 'waiting';
      this.navigateTo('train');
    });

    this.updateDueBadge();
  }

  // ===== ANALYZE =====
  private renderAnalyze(container: HTMLElement): void {
    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">Analysis Board</div>
          <div class="page-subtitle">Free analysis with Stockfish</div>
        </div>
        <div style="display:flex;gap:var(--space-sm);align-items:center;">
          <button class="btn ${this.engineEnabled ? 'btn-primary' : 'btn-secondary'}" id="toggle-engine">
            ${this.engineEnabled ? '🔬 Engine On' : '⬜ Engine Off'}
          </button>
          <button class="btn btn-secondary" id="analyze-reset">🔄 Reset</button>
        </div>
      </div>
      <div class="page-body">
        <div class="board-container">
          <div class="board-wrapper" id="analyze-board"></div>
          <div class="board-controls">
            <button class="board-btn" id="analyze-undo">↩ Undo</button>
            <button class="board-btn" id="analyze-flip">🔄 Flip</button>
          </div>
        </div>
        <div class="side-panel">
          <div class="panel" id="eval-panel" style="${this.engineEnabled ? '' : 'display:none'}">
            <div class="panel-header">
              <span class="panel-title">Evaluation</span>
              <span class="analysis-depth" id="analysis-depth">Depth: 0</span>
            </div>
            <div class="panel-body">
              <div class="eval-bar-container">
                <div class="eval-bar">
                  <div class="eval-bar-fill" id="eval-bar-fill" style="width:50%"></div>
                </div>
                <div class="eval-score equal" id="eval-score">0.0</div>
              </div>
              <div class="analysis-lines" id="analysis-lines" style="margin-top:var(--space-md);"></div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-header"><span class="panel-title">Moves</span></div>
            <div class="panel-body">
              <div class="move-list" id="analyze-moves"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.game = new Chess();
    this.board = new ChessBoard({
      container: document.getElementById('analyze-board')!,
      interactive: true,
      onMove: (from, to, promotion) => {
        const move = this.game.move({ from, to, promotion: promotion || 'q' });
        if (move) {
          this.board.setPosition(this.game.fen());
          this.board.setLastMove(from, to);
          this.updateAnalyzeUI();
          if (this.engineEnabled) this.runAnalysis();
          return true;
        }
        return false;
      },
    });

    document.getElementById('toggle-engine')?.addEventListener('click', () => {
      this.engineEnabled = !this.engineEnabled;
      const btn = document.getElementById('toggle-engine')!;
      btn.className = `btn ${this.engineEnabled ? 'btn-primary' : 'btn-secondary'}`;
      btn.innerHTML = this.engineEnabled ? '🔬 Engine On' : '⬜ Engine Off';
      const panel = document.getElementById('eval-panel')!;
      panel.style.display = this.engineEnabled ? '' : 'none';
      if (this.engineEnabled) this.runAnalysis();
      else this.engine.stop();
    });

    document.getElementById('analyze-undo')?.addEventListener('click', () => {
      this.game.undo();
      this.board.setPosition(this.game.fen());
      this.board.clearLastMove();
      this.updateAnalyzeUI();
      if (this.engineEnabled) this.runAnalysis();
    });

    document.getElementById('analyze-flip')?.addEventListener('click', () => {
      this.board.setFlipped(!this.board.isFlipped());
    });

    document.getElementById('analyze-reset')?.addEventListener('click', () => {
      this.game = new Chess();
      this.board.setPosition(this.game.fen());
      this.board.clearLastMove();
      this.updateAnalyzeUI();
      if (this.engineEnabled) this.runAnalysis();
    });
  }

  private runAnalysis(): void {
    this.engine.analyze(this.game.fen(), (result) => {
      const depthEl = document.getElementById('analysis-depth');
      if (depthEl) depthEl.textContent = `Depth: ${result.depth}`;

      if (result.lines.length > 0) {
        const mainLine = result.lines[0];
        const score = mainLine.score;
        const mate = mainLine.mate;
        const turn = this.game.turn();

        // Adjust score for side to move
        const displayScore = turn === 'b' ? -score : score;
        const displayMate = mate !== null ? (turn === 'b' ? -mate : mate) : null;

        const scoreEl = document.getElementById('eval-score');
        if (scoreEl) {
          scoreEl.textContent = StockfishEngine.formatScore(displayScore, displayMate);
          scoreEl.className = `eval-score ${displayScore > 20 ? 'white-winning' : displayScore < -20 ? 'black-winning' : 'equal'}`;
        }

        const barFill = document.getElementById('eval-bar-fill');
        if (barFill) {
          barFill.style.width = `${StockfishEngine.scoreToBarPercent(displayScore, displayMate)}%`;
        }

        const linesEl = document.getElementById('analysis-lines');
        if (linesEl) {
          linesEl.innerHTML = result.lines.map(line => {
            const ls = turn === 'b' ? -line.score : line.score;
            const lm = line.mate !== null ? (turn === 'b' ? -line.mate : line.mate) : null;
            return `
              <div class="analysis-line">
                <span class="analysis-line-eval">${StockfishEngine.formatScore(ls, lm)}</span>
                <span class="analysis-line-moves">${line.pv.slice(0, 8).join(' ')}</span>
              </div>
            `;
          }).join('');
        }
      }
    });
  }

  private updateAnalyzeUI(): void {
    const moveList = document.getElementById('analyze-moves');
    if (moveList) {
      const history = this.game.history();
      let html = '';
      for (let i = 0; i < history.length; i++) {
        if (i % 2 === 0) html += `<span class="move-number">${Math.floor(i / 2) + 1}.</span>`;
        html += `<span class="move-cell ${i === history.length - 1 ? 'active' : ''}">${history[i]}</span>`;
      }
      moveList.innerHTML = html;
    }
  }

  // ===== STATS =====
  private renderStats(container: HTMLElement): void {
    const stats = this.srs.getStats();
    const openings = this.repertoire.getOpenings();

    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">Statistics</div>
          <div class="page-subtitle">Track your progress</div>
        </div>
      </div>
      <div class="page-body" style="flex-direction:column;max-width:800px;">
        <div class="dashboard-grid">
          <div class="stat-card">
            <span class="stat-card-label">Total Lines</span>
            <span class="stat-card-value">${stats.totalCards}</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-label">New</span>
            <span class="stat-card-value">${stats.newCards}</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-label">Learning</span>
            <span class="stat-card-value">${stats.learningCards}</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-label">Mastered</span>
            <span class="stat-card-value">${stats.masteredCards}</span>
          </div>
        </div>

        <div class="section-title">Progress by Opening</div>
        ${openings.map(op => {
          const lines = this.repertoire.getLinesByOpening(op.id);
          const mastered = lines.filter(l => { const c = this.srs.getCard(l.id); return c && c.level >= 7; }).length;
          const learning = lines.filter(l => { const c = this.srs.getCard(l.id); return c && c.level > 0 && c.level < 7; }).length;
          return `
            <div class="panel" style="margin-bottom:var(--space-md);">
              <div class="panel-header">
                <span class="panel-title">${op.color === 'white' ? '♔' : '♚'} ${op.name}</span>
                <span class="analysis-depth">${mastered}/${lines.length} mastered</span>
              </div>
              <div class="panel-body">
                <div class="progress-bar">
                  <div class="progress-bar-fill" style="width:${(mastered / lines.length * 100).toFixed(0)}%"></div>
                </div>
                <div class="progress-stats">
                  <span>🟢 ${mastered} mastered</span>
                  <span>🟡 ${learning} learning</span>
                  <span>⚪ ${lines.length - mastered - learning} new</span>
                </div>
                <div class="line-list" style="margin-top:var(--space-md);">
                  ${lines.map(l => {
                    const card = this.srs.getCard(l.id);
                    const status = card ? SpacedRepetition.getStatusClass(card) : 'new';
                    const level = card ? `Lv${card.level}` : 'New';
                    const nextReview = card ? SpacedRepetition.formatNextReview(card) : 'New';
                    return `
                      <div class="line-item">
                        <span class="line-status ${status}"></span>
                        <span class="line-name">${l.name}</span>
                        <span class="line-level">${level}</span>
                        <span class="line-level">${nextReview}</span>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>
          `;
        }).join('')}

        <button class="btn btn-danger" id="reset-all" style="align-self:center;margin-top:var(--space-xl);">
          ⚠️ Reset All Progress
        </button>
      </div>
    `;

    document.getElementById('reset-all')?.addEventListener('click', () => {
      if (confirm('Reset ALL progress? This cannot be undone.')) {
        this.srs.resetAll();
        this.repertoire = new RepertoireManager(this.srs);
        this.navigateTo('stats');
      }
    });
  }

  // ===== HELPERS =====
  private renderOpeningSelector(container: HTMLElement, returnPage: Page): void {
    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">Select Opening</div>
          <div class="page-subtitle">Choose an opening to study</div>
        </div>
      </div>
      <div class="page-body" style="flex-direction:column;max-width:700px;">
        <div class="opening-grid">
          ${this.repertoire.getOpenings().map(op => `
            <div class="opening-card" data-select-opening="${op.id}">
              <div class="opening-card-icon">${op.color === 'white' ? '♔' : '♚'}</div>
              <div class="opening-card-title">${op.name}</div>
              <div class="opening-card-desc">${op.description.substring(0, 120)}...</div>
              <div class="opening-card-meta">
                <span>📝 ${this.repertoire.getLinesByOpening(op.id).length} lines</span>
                <span>${op.color === 'white' ? '⬜ White' : '⬛ Black'}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    document.querySelectorAll('[data-select-opening]').forEach(card => {
      card.addEventListener('click', () => {
        this.selectedOpening = (card as HTMLElement).dataset.selectOpening!;
        this.selectedLine = null;
        this.navigateTo(returnPage);
      });
    });
  }

  private updateDueBadge(): void {
    const stats = this.srs.getStats();
    const badge = document.getElementById('due-badge');
    if (badge) {
      if (stats.dueNow > 0) {
        badge.style.display = '';
        badge.textContent = String(stats.dueNow);
      } else {
        badge.style.display = 'none';
      }
    }
  }

  private updateEngineStatus(): void {
    const dot = document.getElementById('engine-dot');
    const label = document.getElementById('engine-label');
    if (this.engine.loaded) {
      dot?.classList.add('active');
      if (label) label.textContent = 'Stockfish ready';
    } else {
      if (label) label.textContent = 'Engine unavailable';
    }
  }
}

// Launch the app
new App();
