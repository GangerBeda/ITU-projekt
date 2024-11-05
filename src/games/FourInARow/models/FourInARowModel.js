// FourInARowModel.js
export class FourInARowModel {
    constructor() {
        this.board = Array(6).fill(null).map(() => Array(7).fill(null)); // 6 řádků x 7 sloupců
        this.currentPlayer = 'red'; // Hráč na tahu (může být 'red' nebo 'yellow')
        this.movesHistory = [];
        this.observers = [];
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    notifyObservers() {
        this.observers.forEach(observer => observer(this.getState()));
    }

    getState() {
        return {
            board: this.board,
            currentPlayer: this.currentPlayer,
            movesHistory: this.movesHistory
        };
    }

    makeMove(column) {
        for (let row = this.board.length - 1; row >= 0; row--) {
            if (!this.board[row][column]) {
                this.board[row][column] = this.currentPlayer;
                this.movesHistory.push({ row, column, player: this.currentPlayer });
                this.currentPlayer = this.currentPlayer === 'red' ? 'yellow' : 'red';
                this.notifyObservers();
                return true;
            }
        }
        return false; // Pokud je sloupec plný
    }

    checkWinner() {
        // Implementujte logiku pro kontrolu vítěze (4 za sebou horizontálně, vertikálně nebo diagonálně)
        // Tento krok vyžaduje další funkce pro kontrolu směru.
    }
}
