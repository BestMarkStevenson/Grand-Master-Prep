// SVG Chess Board Renderer with drag-and-drop
import { Chess, type Square, type PieceSymbol, type Color } from 'chess.js';

// Unicode piece characters
const PIECE_CHARS: Record<string, string> = {
  'wK': '♔', 'wQ': '♕', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
  'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟',
};

export interface BoardConfig {
  container: HTMLElement;
  size?: number;
  flipped?: boolean;
  interactive?: boolean;
  onMove?: (from: Square, to: Square, promotion?: PieceSymbol) => boolean;
  onSquareClick?: (square: Square) => void;
}

interface Arrow {
  from: Square;
  to: Square;
  color?: string;
}

export class ChessBoard {
  private svg!: SVGSVGElement;
  private config: Required<BoardConfig>;
  private game: Chess;
  private selectedSquare: Square | null = null;
  private legalMoves: Square[] = [];
  private lastMove: { from: Square; to: Square } | null = null;
  private arrows: Arrow[] = [];
  private hintSquare: Square | null = null;
  private dragging: { piece: SVGElement; square: Square; startX: number; startY: number } | null = null;
  private squareSize = 0;
  private boardGroup!: SVGGElement;
  private piecesGroup!: SVGGElement;
  private overlayGroup!: SVGGElement;
  private arrowGroup!: SVGGElement;
  private checkSquare: Square | null = null;

  constructor(config: BoardConfig) {
    this.config = {
      size: 560,
      flipped: false,
      interactive: true,
      onMove: () => true,
      onSquareClick: () => {},
      ...config,
    };
    this.game = new Chess();
    this.createSVG();
    this.render();
    this.setupEvents();
  }

  private createSVG(): void {
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('viewBox', '0 0 800 800');
    this.svg.setAttribute('class', 'board-svg');
    this.svg.style.userSelect = 'none';

    // Defs for filters/gradients
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    // Check highlight filter
    const checkFilter = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
    checkFilter.setAttribute('id', 'check-gradient');
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', 'rgba(255,0,0,0.8)');
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '50%');
    stop2.setAttribute('stop-color', 'rgba(255,0,0,0.4)');
    const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop3.setAttribute('offset', '100%');
    stop3.setAttribute('stop-color', 'rgba(255,0,0,0)');
    checkFilter.appendChild(stop1);
    checkFilter.appendChild(stop2);
    checkFilter.appendChild(stop3);
    defs.appendChild(checkFilter);

    // Arrow marker
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '4');
    marker.setAttribute('markerHeight', '4');
    marker.setAttribute('refX', '2.5');
    marker.setAttribute('refY', '2');
    marker.setAttribute('orient', 'auto');
    const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    arrowPath.setAttribute('d', 'M 0 0 L 4 2 L 0 4 Z');
    arrowPath.setAttribute('fill', 'rgba(16, 185, 129, 0.8)');
    marker.appendChild(arrowPath);
    defs.appendChild(marker);

    this.svg.appendChild(defs);

    this.boardGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.overlayGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.piecesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.arrowGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    this.svg.appendChild(this.boardGroup);
    this.svg.appendChild(this.overlayGroup);
    this.svg.appendChild(this.piecesGroup);
    this.svg.appendChild(this.arrowGroup);

    this.config.container.innerHTML = '';
    this.config.container.appendChild(this.svg);
    this.squareSize = 100; // 800 / 8
  }

  private render(): void {
    this.renderBoard();
    this.renderPieces();
    this.renderOverlays();
    this.renderArrows();
  }

  private renderBoard(): void {
    this.boardGroup.innerHTML = '';
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isLight = (row + col) % 2 === 0;
        const sq = this.getSquareFromCoords(row, col);
        const { x, y } = this.getScreenCoords(row, col);

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', String(x));
        rect.setAttribute('y', String(y));
        rect.setAttribute('width', String(this.squareSize));
        rect.setAttribute('height', String(this.squareSize));
        rect.setAttribute('data-square', sq);

        // Determine class
        let className = `board-square ${isLight ? 'light' : 'dark'}`;
        if (this.lastMove && (this.lastMove.from === sq || this.lastMove.to === sq)) {
          className = `board-square ${isLight ? 'highlight-light' : 'highlight-dark'}`;
        }
        if (this.selectedSquare === sq) {
          className = 'board-square selected';
        }
        rect.setAttribute('class', className);
        this.boardGroup.appendChild(rect);

        // Check highlight
        if (this.checkSquare === sq) {
          const checkCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          checkCircle.setAttribute('cx', String(x + this.squareSize / 2));
          checkCircle.setAttribute('cy', String(y + this.squareSize / 2));
          checkCircle.setAttribute('r', String(this.squareSize / 2));
          checkCircle.setAttribute('fill', 'url(#check-gradient)');
          checkCircle.style.pointerEvents = 'none';
          this.boardGroup.appendChild(checkCircle);
        }

        // Coordinates
        if (col === 0) {
          const rankText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          rankText.setAttribute('x', String(x + 4));
          rankText.setAttribute('y', String(y + 16));
          rankText.setAttribute('class', `board-coords ${isLight ? 'coord-light' : 'coord-dark'}`);
          const displayRow = this.config.flipped ? row + 1 : 8 - row;
          rankText.textContent = String(displayRow);
          this.boardGroup.appendChild(rankText);
        }
        if (row === 7) {
          const fileText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          fileText.setAttribute('x', String(x + this.squareSize - 12));
          fileText.setAttribute('y', String(y + this.squareSize - 4));
          fileText.setAttribute('class', `board-coords ${isLight ? 'coord-light' : 'coord-dark'}`);
          const displayCol = this.config.flipped ? 7 - col : col;
          fileText.textContent = 'abcdefgh'[displayCol];
          this.boardGroup.appendChild(fileText);
        }

        // Hint highlight
        if (this.hintSquare === sq) {
          const hintRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          hintRect.setAttribute('x', String(x));
          hintRect.setAttribute('y', String(y));
          hintRect.setAttribute('width', String(this.squareSize));
          hintRect.setAttribute('height', String(this.squareSize));
          hintRect.setAttribute('class', 'hint-square');
          hintRect.setAttribute('fill', 'rgba(245, 158, 11, 0.3)');
          hintRect.style.pointerEvents = 'none';
          this.boardGroup.appendChild(hintRect);
        }
      }
    }
  }

  private renderPieces(): void {
    this.piecesGroup.innerHTML = '';
    const board = this.game.board();
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (!piece) continue;

        const displayRow = this.config.flipped ? 7 - row : row;
        const displayCol = this.config.flipped ? 7 - col : col;
        const x = displayCol * this.squareSize;
        const y = displayRow * this.squareSize;

        const key = `${piece.color === 'w' ? 'w' : 'b'}${piece.type.toUpperCase()}`;
        const char = PIECE_CHARS[key];
        if (!char) continue;

        const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        img.setAttribute('href', `/pieces/${key}.svg`);
        img.setAttribute('x', String(x));
        img.setAttribute('y', String(y));
        img.setAttribute('width', String(this.squareSize));
        img.setAttribute('height', String(this.squareSize));
        img.setAttribute('class', 'board-piece');
        img.setAttribute('data-square', this.squareFromBoardCoords(row, col));
        this.piecesGroup.appendChild(img);
      }
    }
  }

  private renderOverlays(): void {
    this.overlayGroup.innerHTML = '';

    // Legal move indicators
    for (const sq of this.legalMoves) {
      const { row, col } = this.coordsFromSquare(sq);
      const { x, y } = this.getScreenCoords(row, col);
      const center_x = x + this.squareSize / 2;
      const center_y = y + this.squareSize / 2;

      const piece = this.game.get(sq);
      if (piece) {
        // Capture ring
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', String(center_x));
        circle.setAttribute('cy', String(center_y));
        circle.setAttribute('r', String(this.squareSize / 2 - 4));
        circle.setAttribute('class', 'capture-ring');
        this.overlayGroup.appendChild(circle);
      } else {
        // Move dot
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', String(center_x));
        circle.setAttribute('cy', String(center_y));
        circle.setAttribute('r', '16');
        circle.setAttribute('class', 'move-dot');
        this.overlayGroup.appendChild(circle);
      }
    }
  }

  private renderArrows(): void {
    this.arrowGroup.innerHTML = '';
    for (const arrow of this.arrows) {
      const fromCoords = this.coordsFromSquare(arrow.from);
      const toCoords = this.coordsFromSquare(arrow.to);
      const from = this.getScreenCoords(fromCoords.row, fromCoords.col);
      const to = this.getScreenCoords(toCoords.row, toCoords.col);

      const x1 = from.x + this.squareSize / 2;
      const y1 = from.y + this.squareSize / 2;
      const x2 = to.x + this.squareSize / 2;
      const y2 = to.y + this.squareSize / 2;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', String(x1));
      line.setAttribute('y1', String(y1));
      line.setAttribute('x2', String(x2));
      line.setAttribute('y2', String(y2));
      line.setAttribute('class', 'board-arrow');
      line.setAttribute('marker-end', 'url(#arrowhead)');
      if (arrow.color) {
        line.setAttribute('stroke', arrow.color);
        line.setAttribute('fill', arrow.color);
      }
      this.arrowGroup.appendChild(line);
    }
  }

  private setupEvents(): void {
    if (!this.config.interactive) return;

    this.svg.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.svg.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.svg.addEventListener('mouseup', (e) => this.onMouseUp(e));
    this.svg.addEventListener('mouseleave', () => this.onMouseLeave());
  }

  private onMouseDown(e: MouseEvent): void {
    const square = this.getSquareFromEvent(e);
    if (!square) return;

    const piece = this.game.get(square);

    // If clicking on a legal move square
    if (this.selectedSquare && this.legalMoves.includes(square)) {
      this.tryMove(this.selectedSquare, square);
      return;
    }

    // If clicking own piece
    if (piece && this.config.interactive) {
      this.selectedSquare = square;
      const moves = this.game.moves({ square, verbose: true });
      this.legalMoves = moves.map(m => m.to as Square);

      // Start drag
      const pieceEl = this.piecesGroup.querySelector(`[data-square="${square}"]`) as SVGElement;
      if (pieceEl) {
        this.dragging = { piece: pieceEl, square, startX: e.clientX, startY: e.clientY };
        pieceEl.classList.add('dragging');
        // Move to front
        this.piecesGroup.appendChild(pieceEl);
      }

      this.render();
    } else {
      // Deselect
      this.selectedSquare = null;
      this.legalMoves = [];
      this.render();
    }
  }

  private onMouseMove(e: MouseEvent): void {
    if (!this.dragging) return;

    const svgRect = this.svg.getBoundingClientRect();
    const scaleX = 800 / svgRect.width;
    const scaleY = 800 / svgRect.height;

    const dx = (e.clientX - this.dragging.startX) * scaleX;
    const dy = (e.clientY - this.dragging.startY) * scaleY;

    this.dragging.piece.setAttribute('transform', `translate(${dx},${dy})`);
  }

  private onMouseUp(e: MouseEvent): void {
    if (this.dragging) {
      const square = this.getSquareFromEvent(e);
      this.dragging.piece.classList.remove('dragging');
      this.dragging.piece.removeAttribute('transform');

      if (square && square !== this.dragging.square && this.legalMoves.includes(square)) {
        this.tryMove(this.dragging.square, square);
      } else {
        this.render();
      }
      this.dragging = null;
    }
  }

  private onMouseLeave(): void {
    if (this.dragging) {
      this.dragging.piece.classList.remove('dragging');
      this.dragging.piece.removeAttribute('transform');
      this.dragging = null;
      this.render();
    }
  }

  private tryMove(from: Square, to: Square): void {
    // Check for promotion
    const piece = this.game.get(from);
    let promotion: PieceSymbol | undefined;
    if (piece?.type === 'p') {
      const toRank = parseInt(to[1]);
      if ((piece.color === 'w' && toRank === 8) || (piece.color === 'b' && toRank === 1)) {
        promotion = 'q'; // Auto-promote to queen
      }
    }

    const allowed = this.config.onMove(from, to, promotion);
    if (allowed) {
      this.selectedSquare = null;
      this.legalMoves = [];
    } else {
      this.selectedSquare = null;
      this.legalMoves = [];
      this.render();
    }
  }

  private getSquareFromEvent(e: MouseEvent): Square | null {
    const svgRect = this.svg.getBoundingClientRect();
    const x = ((e.clientX - svgRect.left) / svgRect.width) * 800;
    const y = ((e.clientY - svgRect.top) / svgRect.height) * 800;

    let col = Math.floor(x / this.squareSize);
    let row = Math.floor(y / this.squareSize);

    if (col < 0 || col > 7 || row < 0 || row > 7) return null;

    return this.getSquareFromCoords(row, col);
  }

  private getSquareFromCoords(displayRow: number, displayCol: number): Square {
    const row = this.config.flipped ? displayRow : 7 - displayRow;
    const col = this.config.flipped ? 7 - displayCol : displayCol;
    const file = 'abcdefgh'[col];
    const rank = row + 1;
    return `${file}${rank}` as Square;
  }

  private squareFromBoardCoords(boardRow: number, boardCol: number): Square {
    const file = 'abcdefgh'[boardCol];
    const rank = 8 - boardRow;
    return `${file}${rank}` as Square;
  }

  private coordsFromSquare(sq: Square): { row: number; col: number } {
    const col = sq.charCodeAt(0) - 97;
    const row = 8 - parseInt(sq[1]);
    return {
      row: this.config.flipped ? 7 - row : row,
      col: this.config.flipped ? 7 - col : col,
    };
  }

  private getScreenCoords(displayRow: number, displayCol: number): { x: number; y: number } {
    return {
      x: displayCol * this.squareSize,
      y: displayRow * this.squareSize,
    };
  }

  // Public API
  setPosition(fen: string): void {
    this.game.load(fen);
    this.selectedSquare = null;
    this.legalMoves = [];
    this.checkSquare = null;
    if (this.game.isCheck()) {
      // Find king square
      const board = this.game.board();
      const turn = this.game.turn();
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = board[r][c];
          if (p && p.type === 'k' && p.color === turn) {
            this.checkSquare = this.squareFromBoardCoords(r, c);
          }
        }
      }
    }
    this.render();
  }

  getPosition(): string {
    return this.game.fen();
  }

  setLastMove(from: Square, to: Square): void {
    this.lastMove = { from, to };
    this.render();
  }

  clearLastMove(): void {
    this.lastMove = null;
    this.render();
  }

  setFlipped(flipped: boolean): void {
    this.config.flipped = flipped;
    this.render();
  }

  isFlipped(): boolean {
    return this.config.flipped;
  }

  setInteractive(interactive: boolean): void {
    this.config.interactive = interactive;
  }

  setArrows(arrows: Arrow[]): void {
    this.arrows = arrows;
    this.renderArrows();
  }

  clearArrows(): void {
    this.arrows = [];
    this.renderArrows();
  }

  setHint(square: Square | null): void {
    this.hintSquare = square;
    this.render();
  }

  getGame(): Chess {
    return this.game;
  }

  destroy(): void {
    this.svg.remove();
  }
}
