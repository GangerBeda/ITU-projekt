class FourInARowModel {
    constructor() {
        this.board = Array(6).fill(null).map(() => Array(7).fill(null));
        this.currentPlayer = 'red';
        this.movesHistory = [];
        this.winner = null;
        this.full = false;
        this.message = 'Hráč Červený začíná.'; // Inicializace zprávy
        this.observers = [];
        this.timeLimit = 0; // Inicializace časového limitu
        this.turnColour = 'red'
    }

    // getTimeLimit() {
    //     return this.timeLimit;
    // }

    // addObserver(observer) {
    //     this.observers.push(observer);
    // }

    // notifyObservers() {
    //     this.observers.forEach(observer => observer(this.getState()));
    // }

    getState() {
        return {
            board: this.board,
            currentPlayer: this.currentPlayer,
            winner: this.winner,
            full: this.full,
            message: this.message,
            movesHistory: this.movesHistory,
            timeLimit: this.timeLimit, // Přidáno, pokud chybělo
            turnColour: this.turnColour
        };
    }

    resetGame() {
        this.board = Array(6).fill(null).map(() => Array(7).fill(null));
        this.currentPlayer = 'red';
        this.winner = null;
        this.full = false;
        this.message = 'Hráč Červený začíná.'; // Reset zprávy
        this.movesHistory = [];


        //this.notifyObservers();
    }

    makeMove(column) {
        if (this.winner || this.full) {
            return;
        }
    
        for (let row = this.board.length - 1; row >= 0; row--) {
            if (!this.board[row][column]) {
                this.board[row][column] = this.currentPlayer;
                this.movesHistory.push({ row, column, player: this.currentPlayer });
    
                if (this.checkWinner(row, column, this.currentPlayer)) {
                    this.winner = this.currentPlayer;
                    this.message = ` ${this.winner === 'red' ? 'Červený' : 'Žlutý'} hráč vyhrál! Hra je ukončena. Začněte novou hru.`;
                    this.turnColour = ''; // Žádný hráč už není na tahu
                } else if (this.checkFull()) {
                    this.full = true;  // Pokud je pole plné, nastavíme, že je hra ukončena
                    this.message = "Herní pole je plné, remíza! Začněte novou hru.";
                    this.turnColour = ''; // Žádný hráč už není na tahu
                } else {
                    this.currentPlayer = this.currentPlayer === 'red' ? 'yellow' : 'red';
                    this.message = `Hráč ${this.currentPlayer === 'red' ? 'Červený' : 'Žlutý'} je na tahu.`;
                    this.turnColour = `${this.currentPlayer}-turn`;
                }
    
                return true;  // Vraťte `true`, pokud byl tah úspěšný
            }
        }
    
        return false;  // Pokud není možné provést tah, vrátí `false`
    }
    

    undo() {
        if (this.movesHistory.length === 0) return; // Pokud není žádný tah k vrácení

        const lastMove = this.movesHistory.pop(); // Odstraňte poslední tah z historie
        this.board[lastMove.row][lastMove.column] = null; // Odstraňte žeton z herního pole
        this.currentPlayer = lastMove.player;
        this.winner = null;
        this.full = false;
        this.message = `Hráč ${this.currentPlayer === 'red' ? 'Červený' : 'Žlutý'} je na tahu.`;
       // this.notifyObservers();
    }

    settings(options) {

        if (options.timeLimit !== undefined) {
            this.timeLimit = options.timeLimit;
        }

       // this.notifyObservers();
    }
    setTimeLimit(timeLimit) {
        this.timeLimit = timeLimit;
       // this.notifyObservers();
        console.log("Časový limit nastaven na serveru:", this.timeLimit);
    }

    checkFull() {
        return this.movesHistory.length === 42; // Pokud je počet tahů 42, pole je plné
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



// colIndex je index sloupce ktery je predan funkci makeMove, ktea ho zpracovava jako column
// kazde poel v javascriptu ma .lengh
