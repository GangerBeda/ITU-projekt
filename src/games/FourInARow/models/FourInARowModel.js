class FourInARowModel {
    constructor() {
        this.board = Array(6).fill(null).map(() => Array(7).fill(null));
        this.currentPlayer = 'red';
        this.turnColour = 'red-turn'
        this.highlightedPlayer ='Červený'
        this.movesHistory = [];
        this.winner = null;
        this.full = false;
        this.message = 'hráč začíná.'; // Inicializace zprávy

        this.timer = null;
        this.gameStarted = false;
        this.remainingTime = 10; // Zbývající čas na aktuální tah
        this.timeLimit = 30; // Inicializace časového limitu (30 sekund na tah)
        this.TimerOn = false;
        this.TimerOnVypZap = false;
    }
    // Zde je metoda, která přepíná hráče při vypršení času
    handleTimeOut() {
        if (this.currentPlayer === 'red') {
            this.currentPlayer = 'yellow'; // Přepne na druhého hráče
            this.turnColour = 'yellow-turn'; // Změní barvu tahu
            this.highlightedPlayer = 'Žlutý'; // Změní text pro hráče
        } else {
            this.currentPlayer = 'red'; // Pokud je čas vyčerpán pro žlutého, přepne na červeného
            this.turnColour = 'red-turn';
            this.highlightedPlayer = 'Červený';
        }
    }

    // Tato metoda by měla být volána při každém "ticku" timeru nebo když čas vyprší
    // Například, když zůstane 0 sekund:
    checkTimeOut() {
        if (this.remainingTime <= 0) {
            this.handleTimeOut(); // Přepne hráče, když čas vyprší
            this.remainingTime = this.timeLimit; // Resetuje čas pro dalšího hráče
        }
    }

    getState() {
        return {
            board: this.board,
            currentPlayer: this.currentPlayer,
            winner: this.winner,
            full: this.full,
            message: this.message,
            movesHistory: this.movesHistory,
            turnColour: this.turnColour,
            highlightedPlayer: this.highlightedPlayer,

            gameStarted: this.gameStarted,
            remainingTime: this.remainingTime,
            timeLimit: this.timeLimit,
            
            TimerOn: this.TimerOn,
            TimerOnVypZap: this.TimerOnVypZap
        };
    }


        timerToggle(){
            console.log("thisok.  1111 TimerOnVypZap pred ", this.TimerOnVypZap);
            console.log("thisok.  2222TimerOn: pred podminkou", this.TimerOn);

            // Toggle the timer state
            this.TimerOn = !this.TimerOn;
            this.TimerOnVypZap = this.TimerOn;
        
            // If timer is being turned on, reset the game state if needed
            if (this.TimerOn) {
                this.remainingTime = this.timeLimit;
                
                // Start timer if game has started
                if (this.gameStarted) {
                    this.startTimer();
                }
            } else {
                // Stop the timer when toggling off
                this.stopTimer();
            }
            console.log("TimerOn:", this.TimerOn);
            console.log("TimerOnVypZap:", this.TimerOnVypZap);
        }
    

    resetGame() {
        this.board = Array(6).fill(null).map(() => Array(7).fill(null));
        this.currentPlayer = 'red';
        this.winner = null;
        this.full = false;
        this.message = 'hráč začíná.'; // Reset zprávy
        this.movesHistory = [];
        this.turnColour = 'red-turn'
        this.highlightedPlayer ='Červený'

        // Reset časovače


        // Reset příznaků hry
        this.stopTimer(); // Zastavení časovače
        this.gameStarted = false;
    }
    //resetuje/pusti timer
    startTimer() {
        if (!this.gameStarted || this.timer){
            console.log("Časovač nebyl spuštěn - podmínka nesplněna.");
            console.log("Stav hry:", { gameStarted: this.gameStarted, timer: this.timer });
            return;
        }


        console.log("Časovač spuštěn!");
        console.log("Počáteční čas:", this.timeLimit);

        this.remainingTime = this.timeLimit; // Nastavte zbývající čas na časový limit

        this.timer = setInterval(() => {
            this.remainingTime -= 1;

            console.log("Zbývající čas:", this.remainingTime);

            if (this.remainingTime <= 0) {
                console.log("Čas došel!");
                this.stopTimer();
                this.message = `Čas vypršel! Hráč ${this.currentPlayer === 'red' ? 'Červený' : 'Žlutý'} prohrál.`;
                this.winner = this.currentPlayer === 'red' ? 'yellow' : 'red'; // Druhý hráč vyhrává
                this.highlightedPlayer = this.winner === 'red' ? 'Červený' : 'Žlutý';
                this.turnColour = `${this.winner}-turn`;
            }

        }, 1000); // Každou sekundu odečítat čas
    }


    //stopne timer
    stopTimer() {
        console.log("Pokus o zastavení časovače, timer:", this.timer);
        if (this.timer) {
            console.log("Časovač zastaven.");
            clearInterval(this.timer);
            this.timer = null;
            this.gameStarted = false;  
        } else {
            console.log("Časovač nebyl aktivní, není co zastavit.");
        }
    }
    makeMove(column) {
        if (this.winner || this.full) {
            return;
        }
    
        for (let row = this.board.length - 1; row >= 0; row--) {
            if (!this.board[row][column]) {
                this.board[row][column] = this.currentPlayer;
                this.movesHistory.push({ row, column, player: this.currentPlayer });
                this.gameStarted = true;

    
                if (this.checkWinner(row, column, this.currentPlayer)) {
                    this.winner = this.currentPlayer;
                    this.highlightedPlayer = this.winner === 'red' ? 'Červený' : 'Žlutý';
                    this.message = `hráč vyhrál! `;
                    this.turnColour = `${this.winner}-turn`; 
                    this.stopTimer(); // Zastavte časovač při výhře
                } else if (this.checkFull()) {
                    this.full = true;  // Pokud je pole plné, nastavíme, že je hra ukončena
                    this.message = "Herní pole je plné, remíza!";
                    this.turnColour = ''; // Žádný hráč už není na tahu
                    this.highlightedPlayer = ''; // Žádný hráč
                    this.stopTimer(); // 
                } else {

                    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    this.remainingTime = this.timeLimit;  // Reset času

                    this.currentPlayer = this.currentPlayer === 'red' ? 'yellow' : 'red';
                    this.highlightedPlayer = this.currentPlayer === 'red' ? 'Červený' : 'Žlutý';
                    this.message = `hráč je na tahu.`;
                    this.turnColour = `${this.currentPlayer}-turn`;

                    if(this.TimerOn === true){
                        this.startTimer(); // Spusť časovač pro dalšího hráče
                        this.TimerOn = true;
                    } else{
                        this.TimerOn = false;
                    }
                }
                
                return true;  // Vraťte `true`, pokud byl tah úspěšný
            }
        }
    
        return false;  // Pokud není možné provést tah, vrátí `false`
    }
    

    undo() {
        if (this.movesHistory.length === 0) return;
    
        console.log("this.TimerOn Před undo - TimerOn:", this.TimerOn);
    
        this.remainingTime = this.timeLimit;  
        const lastMove = this.movesHistory.pop(); 
        this.board[lastMove.row][lastMove.column] = null; 
        this.currentPlayer = lastMove.player;
        this.winner = null;
        this.full = false;
        this.message = `hráč je na tahu.`;
    
        this.turnColour = `${this.currentPlayer}-turn`;
        this.highlightedPlayer = this.currentPlayer === 'red' ? 'Červený' : 'Žlutý';
    
        if(this.TimerOn === true){
            this.startTimer();
        }
    
        console.log("this.TimerOn Po undo - TimerOn:", this.TimerOn);
    }

    settings(options) {

        if (options.timeLimit !== undefined) {
            this.timeLimit = options.timeLimit;
        }

    }
    setTimeLimit(timeLimit) {
        this.timeLimit = timeLimit;
        this.remainingTime = this.timeLimit; // Aktualizace zbývajícího času
        console.log("Časový limit nastaven na serveru:", this.timeLimit);
        console.log("Časový limit nastaven:", this.timeLimit);
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
