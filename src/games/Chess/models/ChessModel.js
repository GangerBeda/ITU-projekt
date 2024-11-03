export class ChessModel {
  constructor() {
    this.board = [
      ["r", "n", "b", "q", "k", "b", "n", "r"],
      ["p", "p", "p", "p", "p", "p", "p", "p"],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ["P", "P", "P", "P", "P", "P", "P", "P"],
      ["R", "N", "B", "Q", "K", "B", "N", "R"],
    ];
    this.currentPlayer = "white";
    this.movesHistory = [];
    this.gameStatus = "active";
    this.observers = []; // Initialize observers array
  }

  // Observer Pattern
  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notifyObservers() {
    this.observers.forEach(observer => observer(this.getState()));
  }

  getState() {
    return {
      board: this.board,
      currentPlayer: this.currentPlayer,
      movesHistory: this.movesHistory,
      gameStatus: this.gameStatus
    };
  }

  // Helper methods remain the same...
  getPieceColor(piece) {
    if (!piece) return null;
    return piece.toUpperCase() === piece ? "white" : "black";
  }

  isValidPosition(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  // Validate moves for specific pieces
  isValidPawnMove(start, end) {
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;
    const piece = this.board[startRow][startCol];
    const isWhite = this.getPieceColor(piece) === "white";

    // Direction of movement depends on color
    const direction = isWhite ? -1 : 1;

    // Basic one square forward move
    if (
      startCol === endCol &&
      endRow === startRow + direction &&
      !this.board[endRow][endCol]
    ) {
      return true;
    }

    // Initial two square move
    if (
      startCol === endCol &&
      ((isWhite && startRow === 6 && endRow === 4) ||
        (!isWhite && startRow === 1 && endRow === 3)) &&
      !this.board[endRow][endCol] &&
      !this.board[startRow + direction][startCol]
    ) {
      return true;
    }

    // Capture moves
    if (Math.abs(startCol - endCol) === 1 && endRow === startRow + direction) {
      return (
        this.board[endRow][endCol] &&
        this.getPieceColor(this.board[endRow][endCol]) !== this.currentPlayer
      );
    }

    return false;
  }

  isValidRookMove(start, end) {
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;

    // Rook can only move horizontally or vertically
    if (startRow !== endRow && startCol !== endCol) return false;

    // Check if path is clear
    const rowDir = endRow > startRow ? 1 : endRow < startRow ? -1 : 0;
    const colDir = endCol > startCol ? 1 : endCol < startCol ? -1 : 0;

    let currentRow = startRow + rowDir;
    let currentCol = startCol + colDir;

    while (currentRow !== endRow || currentCol !== endCol) {
      if (this.board[currentRow][currentCol]) return false;
      currentRow += rowDir;
      currentCol += colDir;
    }

    return true;
  }

  // Main game logic methods
  isValidMove(start, end) {
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;

    // Basic validation
    if (
      !this.isValidPosition(startRow, startCol) ||
      !this.isValidPosition(endRow, endCol)
    )
      return false;

    const piece = this.board[startRow][startCol];
    if (!piece || this.getPieceColor(piece) !== this.currentPlayer)
      return false;

    // Can't capture own pieces
    if (
      this.board[endRow][endCol] &&
      this.getPieceColor(this.board[endRow][endCol]) === this.currentPlayer
    ) {
      return false;
    }

    // Piece specific validation
    switch (piece.toLowerCase()) {
      case "p":
        return this.isValidPawnMove(start, end);
      case "r":
        return this.isValidRookMove(start, end);
      // TODO: Add other piece validations
      default:
        return true; // Temporary
    }
  }

  makeMove(start, end) {
    if (!this.isValidMove(start, end)) {
      return false;
    }

    this.updateState(start, end);
    return true;
  }

  updateState(start, end) {
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;

    // Record move
    this.movesHistory.push({
      piece: this.board[startRow][startCol],
      from: `${String.fromCharCode(97 + startCol)}${8 - startRow}`,
      to: `${String.fromCharCode(97 + endCol)}${8 - endRow}`,
      captured: this.board[endRow][endCol],
    });

    // Execute move
    this.board[endRow][endCol] = this.board[startRow][startCol];
    this.board[startRow][startCol] = null;

    // Switch players
    this.currentPlayer = this.currentPlayer === "white" ? "black" : "white";

    // Notify observers of state change
    this.notifyObservers();
  }
}
