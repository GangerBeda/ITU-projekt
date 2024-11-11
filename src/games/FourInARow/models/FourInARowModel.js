class FourInARowModel {
    constructor() {
        this.board = Array(6).fill(null).map(() => Array(7).fill(null));
        this.currentPlayer = 'red';
        this.movesHistory = [];
        this.winner = null;
        this.message = 'Hráč Červený začíná.';
        this.timeLimit = 0;
    }

    getState() {
        return {
            board: this.board,
            currentPlayer: this.currentPlayer,
            winner: this.winner,
            message: this.message,
            movesHistory: this.movesHistory,
            timeLimit: this.timeLimit,
        };
    }

    resetGame() {
        this.board = Array(6).fill(null).map(() => Array(7).fill(null));
        this.currentPlayer = 'red';
        this.winner = null;
        this.message = 'Hráč Červený začíná.';
        this.movesHistory = [];
    }

    makeMove(column) {
        if (this.winner) {
            return;
        }

        for (let row = this.board.length - 1; row >= 0; row--) {
            if (!this.board[row][column]) {
                this.board[row][column] = this.currentPlayer;
                this.movesHistory.push({ row, column, player: this.currentPlayer });

                if (this.checkWinner(row, column, this.currentPlayer)) {
                    this.winner = this.currentPlayer;
                    this.message = `Hráč ${this.winner === 'red' ? 'Červený' : 'Žlutý'} vyhrál!<br />Hra je ukončena. Začněte novou hru.`;
                } else {
                    this.currentPlayer = this.currentPlayer === 'red' ? 'yellow' : 'red';
                    this.message = `Hráč ${this.currentPlayer === 'red' ? 'Červený' : 'Žlutý'} je na tahu.`;
                }

                return true;
            }
        }
        return false;
    }

    undo() {
        if (this.movesHistory.length === 0) return; // Pokud není žádný tah k vrácení

        const lastMove = this.movesHistory.pop(); // Odstrani z historie
        this.board[lastMove.row][lastMove.column] = null; // Odstrani žeton z pole
        this.currentPlayer = lastMove.player;
        this.winner = null;
        this.message = `Hráč ${this.currentPlayer === 'red' ? 'Červený' : 'Žlutý'} je na tahu.`;
    }

    settings(options) {

        if (options.timeLimit !== undefined) {
            this.timeLimit = options.timeLimit;
        }

    }
    setTimeLimit(timeLimit) {
        this.timeLimit = timeLimit;
        console.log("Časový limit nastaven na serveru:", this.timeLimit);
    }



    checkWinner(row, column, player) {
        const directions = [
            { dr: 0, dc: 1 },
            { dr: 1, dc: 0 },
            { dr: 1, dc: 1 },
            { dr: 1, dc: -1 }
        ];

        for (const { dr, dc } of directions) {
            let count = 1;
            for (let step = 1; step <= 3; step++) {
                const r = row + dr * step;
                const c = column + dc * step;
                if (r < 0 || r >= 6 || c < 0 || c >= 7 || this.board[r][c] !== player) break;
                count++;
            }
            for (let step = 1; step <= 3; step++) {
                const r = row - dr * step;
                const c = column - dc * step;
                if (r < 0 || r >= 6 || c < 0 || c >= 7 || this.board[r][c] !== player) break;
                count++;
            }
            if (count >= 4) return true;
        }
        return false;
    }
}

// Export třídy pomocí CommonJS
module.exports = { FourInARowModel };



