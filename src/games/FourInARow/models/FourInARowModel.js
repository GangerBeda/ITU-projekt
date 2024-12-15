/*********************************************************
 * Autor: Martin Bureš <xbures38>
*  Project: Games Hub
 * Game: 4 in a Row
 *********************************************************/
class FourInARowModel {
    constructor() {
        this.board = Array(6).fill(null).map(() => Array(7).fill(null));
        this.currentPlayer = 'red';         // Aktuální hráč
        this.turnColour = 'red-turn'        // Barva hráče na tahu pro GUI
        this.highlightedPlayer ='Červený'   // Zvýrazněný hráč v GUI
        this.movesHistory = [];
        this.winner = null;
        this.full = false;                  // Pole je prazdne
        this.message = 'hráč začíná.';      // Inicializace zprávy
        this.timer = null;
        this.gameStarted = false;
        this.remainingTime = 10;            // Zbývající čas na aktuální tah
        this.timeLimit = 30;                // Inicializace časového limitu 
        this.TimerOn = false;               // Stav běhu časovače
        this.TimerOnVypZap = false;         // Povolení časovače uživatelem (toggle přepínač)
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
        this.remainingTime =  this.timeLimit;


        // Reset příznaků hry
        this.stopTimer(); // Zastavení časovače
        this.gameStarted = false;
    }

    makeMove(column) {
        this.TimerOn = true;
        // this.TimerOnVypZap = true; // --
        this.gameStarted = true;
        if (this.winner || this.full) {
            return;
        }
    
        for (let row = this.board.length - 1; row >= 0; row--) {
            if (!this.board[row][column]) {
                this.board[row][column] = this.currentPlayer;
                this.movesHistory.push({ row, column, player: this.currentPlayer });
                if (this.checkWinner(row, column, this.currentPlayer)) {
                    this.winner = this.currentPlayer;
                    this.highlightedPlayer = this.winner === 'red' ? 'Červený' : 'Žlutý';
                    this.message = `hráč vyhrál! `;
                    this.turnColour = `${this.winner}-turn`; 
                    this.stopTimer();                       // Zastaví časovač při výhře
                } else if (this.checkFull()) {
                    this.full = true;
                    this.message = "Herní pole je plné, remíza!";
                    this.turnColour = '';                   // Žádný hráč už není na tahu
                    this.highlightedPlayer = '';            // Žádný hráč není zvýrazněn
                    this.stopTimer(); 
                } else {
                    // Tah lze provést:
                    this.remainingTime = this.timeLimit;    // Reset času
                    this.currentPlayer = this.currentPlayer === 'red' ? 'yellow' : 'red';
                    this.highlightedPlayer = this.currentPlayer === 'red' ? 'Červený' : 'Žlutý';
                    this.message = `hráč je na tahu.`;
                    this.turnColour = `${this.currentPlayer}-turn`;

                    if(this.TimerOn === true){
                        this.startTimer();                  // Spustí časovač odznovu, pokud hra s časovačem
                        this.TimerOn = true;
                    } else{
                        this.TimerOn = false;               // Nechá časovač vyplý
                    }
                }
                
                return true;                                // Pokud byl tah úspěšný
            }
        }
        return false;  // Pokud není možné provést tah, vrátí `false`
    }

    undo() {
        if (this.movesHistory.length === 0) return;         // nejsou tahy, nedelej nic

        this.stopTimer();                                   // Zastavení časovače, kvůli pravděpodobné chybě
        console.log("this.TimerOn Před undo - TimerOn:", this.TimerOn);
        this.remainingTime = this.timeLimit;                // obnoví časový limit              
        const lastMove = this.movesHistory.pop();
        this.board[lastMove.row][lastMove.column] = null;   //vynuluje předchozí tah
        this.currentPlayer = lastMove.player;
        this.winner = null;                                 // zruší vítěze
        this.full = false;
        this.message = `hráč je na tahu.`;
        this.turnColour = `${this.currentPlayer}-turn`;
        this.highlightedPlayer = this.currentPlayer === 'red' ? 'Červený' : 'Žlutý';

        if(this.TimerOn === true){                          // pokud time mode on, obnoví
            this.startTimer();
        }
        console.log("this.TimerOn Po undo - TimerOn:", this.TimerOn);
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

    checkFull() {
        return this.movesHistory.length === 42;     // Pokud je počet tahů 42, pole je plné
    }

    // přepíná hráče při vypršení času, kvůli vítězství
    handleTimeOut() {
        if (this.currentPlayer === 'red') {
            this.currentPlayer = 'yellow';          // Přepne na druhého hráče
            this.turnColour = 'yellow-turn';        // Změní barvu tahu
            this.highlightedPlayer = 'Žlutý';       // Změní text pro hráče
        } else {
            this.currentPlayer = 'red';             // Pokud je čas vyčerpán pro žlutého, přepne na červeného
            this.turnColour = 'red-turn';
            this.highlightedPlayer = 'Červený';
        }
    }
    // kontroluje yda doběhl čas
    checkTimeOut() {
        if (this.remainingTime <= 0) {
            this.handleTimeOut();
            this.remainingTime = this.timeLimit;    // Resetuje čas pro dalšího hráče
        }
    }
    
    timerToggle(){
        console.log("\n");
        console.log("Timer Toggled");

        this.stopTimer();
        this.TimerOnVypZap = !this.TimerOnVypZap;   // otočení módu
    
        
        if (this.TimerOn) {                         // při togglovaní vyresetuj čas
            this.remainingTime = this.timeLimit;
                                                    // pustí čas jen když hra už začala
            if (this.gameStarted) {
                this.startTimer();
            }

        } else {                                    // při toggle dolů vypne časovačw
            // Stop the timer when toggling off
            this.stopTimer();
        }
        console.log("TimerOn:", this.TimerOn);
        console.log("TimerOnVypZap:", this.TimerOnVypZap);
    }

    
    //resetuje/pusti timer

    startTimer() { // ignor, kdyz hra nezacala nebo kdyz uz se timer uz pustil nebo timer neni pusteny jinak se pust
        if (!this.gameStarted || this.timer || !this.TimerOnVypZap ){
            console.log("\n");
            console.log("Časovač nebyl spuštěn - podmínka nesplněna.");
            console.log("true, null, true" );
            console.log("Stav hry:", { gameStarted: this.gameStarted, timer: this.timer, TimerOnVypZap: this.TimerOnVypZap });
            return;
        }
        console.log("\n");
        console.log("Časovač spuštěn!");
        console.log("Stav hry:", { gameStarted: this.gameStarted, timer: this.timer, TimerOnVypZap: this.TimerOnVypZap });
        console.log("Počáteční čas:", this.timeLimit);

        this.remainingTime = this.timeLimit;        // čas na časový limit

        this.timer = setInterval(() => {            // pustí timer na serveru
            this.remainingTime -= 1;
            console.log("Zbývající čas:", this.remainingTime);

            if (this.remainingTime <= 0) {
                console.log("Čas došel!");
                this.stopTimer();
                this.message = `Čas vypršel! Hráč ${this.currentPlayer === 'red' ? 'Červený' : 'Žlutý'} prohrál.`;
                this.winner = this.currentPlayer === 'red' ? 'yellow' : 'red';     // Druhý hráč vyhrává
                this.highlightedPlayer = this.winner === 'red' ? 'Červený' : 'Žlutý';
                this.turnColour = `${this.winner}-turn`;
            }

        }, 1000); // Každou sekundu odečítat čas
    }
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
    
    settings(options) {
        if (options.timeLimit !== undefined) {
            this.timeLimit = options.timeLimit;
        }
    }
    setTimeLimit(timeLimit) {
        this.TimerOnVypZap = true;
        this.timeLimit = timeLimit;
        this.remainingTime = this.timeLimit; // Aktualizace zbývajícího času
        console.log("NA SERVERU Časový limit nastaven:", this.timeLimit);

        // Pokud hra běží a časovač není aktivní, spusť časovač

        if (this.gameStarted && !this.timer) {
            console.log("Hra již začala, spouštím časovač automaticky.");
            this.TimerOn = true;  // Zapnutí časovače
            this.startTimer();    // Spuštění časovače
        }
    }
}
    module.exports = { FourInARowModel };

