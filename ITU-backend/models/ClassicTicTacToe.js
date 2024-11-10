class ClassicTicTacToe {
    constructor() {
        this.board = Array(9).fill(null);
        this.isXNext = true;
        this.winner = null;
    }
}

module.exports = ClassicTicTacToe;