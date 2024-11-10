class UltimateTicTacToe {
    constructor() {
        this.subBoards = Array.from({ length: 9 }, () => Array(9).fill(null));
        this.mainBoard = Array(9).fill(null);
        this.isXNext = true;
        this.activeSubBoard = null;
        this.blindMode = false;
        this.winner = null;
    }
}

module.exports = UltimateTicTacToe;