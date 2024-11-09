export class FourInARowModel {
    constructor() {
        this.board = Array(6).fill(null).map(() => Array(7).fill(null));
        this.currentPlayer = 'red';
        this.movesHistory = [];
        this.winner = null;
        this.message = 'Hráč Červený začíná.'; // Inicializace zprávy
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
            winner: this.winner,
            message: this.message,
            movesHistory: this.movesHistory,
        };
    }

    resetGame() {
        this.board = Array(6).fill(null).map(() => Array(7).fill(null));
        this.currentPlayer = 'red';
        this.winner = null;
        this.message = 'Hráč Červený začíná.'; // Reset zprávy
        this.movesHistory = [];
        this.notifyObservers();
    }

    makeMove(column) {
        // Pokud už existuje vítěz, ukončíme funkci. Žádné další tahy nejsou povoleny.
        if (this.winner) {
            return;
        }

        // Procházíme sloupce odspodu nahoru a hledáme první prázdnou pozici v daném sloupci.
        for (let row = this.board.length - 1; row >= 0; row--) {
            if (!this.board[row][column]) { // Pokud je pozice prázdná
                // Umístíme žeton aktuálního hráče do prázdné pozice.
                this.board[row][column] = this.currentPlayer;

                // Uložíme tah do historie tahů.
                this.movesHistory.push({ row, column, player: this.currentPlayer });

                // Zkontrolujeme, zda tento tah vedl k výhře aktuálního hráče.
                if (this.checkWinner(row, column, this.currentPlayer)) {
                    // Nastavíme aktuálního hráče jako vítěze.
                    this.winner = this.currentPlayer;

                    // Aktualizujeme zprávu pro uživatele, že hráč vyhrál a hra je ukončena.
                    this.message = `Hráč ${this.winner === 'red' ? 'Červený' : 'Žlutý'} vyhrál!<br />Hra je ukončena. Začněte novou hru.`;
                } else {
                    // Přepneme na dalšího hráče, pokud nebyl zjištěn vítěz.
                    this.currentPlayer = this.currentPlayer === 'red' ? 'yellow' : 'red';

                    // Aktualizujeme zprávu, který hráč je na tahu.
                    this.message = `Hráč ${this.currentPlayer === 'red' ? 'Červený' : 'Žlutý'} je na tahu.`;
                }

                // Upozorníme všechny pozorovatele (např. frontend komponenty), že došlo ke změně stavu.
                this.notifyObservers();
                return true; // Tah byl úspěšně proveden.
            }
        }

        // Pokud je sloupec plný (nebyla nalezena žádná prázdná pozice), vrátíme false.
        return false;
    }



    checkWinner(row, column, player) {
        const directions = [
            { dr: 0, dc: 1 },  // Horizontálně
            { dr: 1, dc: 0 },  // Vertikálně
            { dr: 1, dc: 1 },  // Diagonálně \
            { dr: 1, dc: -1 }  // Diagonálně /
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
