const express = require('express');
const cors = require('cors');
const fs = require('fs');

const bodyParser = require('body-parser');
const { Chess } = require('chess.js');
const ClassicTicTacToe = require('./models/ClassicTicTacToe');
const UltimateTicTacToe = require('./models/UltimateTicTacToe');
const Score = require('./models/Score');

const { FourInARowModel } = require('../src/games/FourInARow/models/FourInARowModel');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/', (req, res) => {
    res.send('Got a POST request');
});

// settlers of catan
app.post('/catan/build', (req, res) => {
    const receivedObject = req.body;

    fs.writeFile('db/gameObj.json', JSON.stringify(receivedObject, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file', err);
            return res.status(500).json({ message: 'Failed to save gameObj' });
        }

        res.status(201).json({
            message: 'Object received and saved successfully',
            data: receivedObject,
        });
    });
});

app.get('/catan/state', (req, res) => {
    fs.readFile('db/gameObj.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file', err);
            return res.status(500).json({ message: 'Failed to read gameObj' });
        }

        res.status(200).json(JSON.parse(data));
    });
});

// CHESS
const games = new Map();

class GameState {
    constructor(mode, timeLimit = null) {
        this.chess = new Chess();
        this.gameMode = mode;
        this.timeLimit = timeLimit;
        this.moveHistory = [];
        this.startTime = Date.now();
        this.remainingTimeWhite = timeLimit ? timeLimit * 60 * 1000 : null;
        this.remainingTimeBlack = timeLimit ? timeLimit * 60 * 1000 : null;
        this.lastMoveTime = Date.now();
    }

    updateTime() {
        if (this.gameMode === 'timed') {
            const currentTime = Date.now();
            const timePassed = currentTime - this.lastMoveTime;
            if (this.chess.turn() === 'w') {
                this.remainingTimeWhite -= timePassed;
            } else {
                this.remainingTimeBlack -= timePassed;
            }
            this.lastMoveTime = currentTime;
        }
    }
}

// Routes
app.post('/chess/start', (req, res) => {
    const { mode, timeLimit } = req.body;
    const gameId = Date.now().toString();
    const game = new GameState(mode, timeLimit);
    games.set(gameId, game);

    res.json({
        gameId,
        fen: game.chess.fen(),
        turn: game.chess.turn(),
        gameMode: game.gameMode,
        remainingTimeWhite: game.remainingTimeWhite,
        remainingTimeBlack: game.remainingTimeBlack,
    });
});

app.post('/chess/move', (req, res) => {
    const { gameId, from, to } = req.body;
    const game = games.get(gameId);

    if (!game) {
        return res.status(404).json({ error: 'Game not found' });
    }

    try {
        game.updateTime();
        const move = game.chess.move({ from, to });
        game.moveHistory.push(move);

        const response = {
            fen: game.chess.fen(),
            turn: game.chess.turn(),
            isCheck: game.chess.isCheck(),
            isCheckmate: game.chess.isCheckmate(),
            isDraw: game.chess.isDraw(),
            moveHistory: game.moveHistory,
            remainingTimeWhite: game.remainingTimeWhite,
            remainingTimeBlack: game.remainingTimeBlack,
        };

        res.json(response);
    } catch (error) {
        res.status(400).json({ error: 'Invalid move' });
    }
});

app.post('/chess/save', (req, res) => {
    const { gameId } = req.body;
    const game = games.get(gameId);

    if (!game) {
        return res.status(404).json({ error: 'Game not found' });
    }

    const savedState = {
        fen: game.chess.fen(),
        gameMode: game.gameMode,
        timeLimit: game.timeLimit,
        moveHistory: game.moveHistory,
        remainingTimeWhite: game.remainingTimeWhite,
        remainingTimeBlack: game.remainingTimeBlack,
    };

    // In production, save to database
    res.json({ savedState });
});

app.post('/chess/load', (req, res) => {
    const { savedState } = req.body;
    const gameId = Date.now().toString();
    const game = new GameState(savedState.gameMode, savedState.timeLimit);

    game.chess.load(savedState.fen);
    game.moveHistory = savedState.moveHistory;
    game.remainingTimeWhite = savedState.remainingTimeWhite;
    game.remainingTimeBlack = savedState.remainingTimeBlack;

    games.set(gameId, game);

    res.json({
        gameId,
        fen: game.chess.fen(),
        turn: game.chess.turn(),
        gameMode: game.gameMode,
        moveHistory: game.moveHistory,
        remainingTimeWhite: game.remainingTimeWhite,
        remainingTimeBlack: game.remainingTimeBlack,
    });
});

app.post('/chess/exit', (req, res) => {
    const { gameId } = req.body;
    games.delete(gameId);
    res.json({ success: true });
});

// ULTIMATE TIC TAC TOE

const score = new Score();
const gamesTTT = {
    classic: null,
    ultimate: null,
};

function calculateWinner(board) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (const [a, b, c] of winningCombinations) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function validateClassicMove(game, cellIndex) {
    return !game.winner && !game.board[cellIndex];
}

function validateUltimateMove(game, subBoardIndex, cellIndex) {
    return !game.mainBoard[subBoardIndex] && !game.subBoards[subBoardIndex][cellIndex];
}

app.post('/tictactoe/new-classic-game', (req, res) => {
    gamesTTT.classic = new ClassicTicTacToe();
    res.json({ board: gamesTTT.classic.board, isXNext: gamesTTT.classic.isXNext });
});

app.post('/tictactoe/classic-game/move', (req, res) => {
    const { cellIndex } = req.body;
    const game = gamesTTT.classic;

    if (!game || !validateClassicMove(game, cellIndex)) {
        return res.json({
            board: game.board,
            isXNext: game.isXNext,
            winner: game.winner,
        });
    }

    game.board[cellIndex] = game.isXNext ? 'X' : 'O';
    game.isXNext = !game.isXNext;
    game.winner = calculateWinner(game.board);

    if (game.winner) {
        score.scores[game.winner]++;
    }

    res.json({
        board: game.board,
        isXNext: game.isXNext,
        winner: game.winner,
    });
});

app.post('/tictactoe/new-ultimate-game', (req, res) => {
    gamesTTT.ultimate = new UltimateTicTacToe();
    res.json({
        subBoards: gamesTTT.ultimate.subBoards,
        mainBoard: gamesTTT.ultimate.mainBoard,
        isXNext: gamesTTT.ultimate.isXNext,
        blindMode: gamesTTT.ultimate.blindMode,
        activeSubBoard: gamesTTT.ultimate.activeSubBoard,
    });
});

app.post('/tictactoe/ultimate-game/move', (req, res) => {
    const { subBoardIndex, cellIndex, blindMode } = req.body;
    const game = gamesTTT.ultimate;

    if (blindMode !== null) {
        if (subBoardIndex === null && cellIndex === null) {
            game.blindMode = !blindMode;
            return res.json({
                subBoards: game.subBoards,
                mainBoard: game.mainBoard,
                isXNext: game.isXNext,
                activeSubBoard: game.activeSubBoard,
                blindMode: game.blindMode,
                winner: game.winner,
            });
        }
    }

    if (!game || !validateUltimateMove(game, subBoardIndex, cellIndex)) {
        return res.json({
            subBoards: game.subBoards,
            mainBoard: game.mainBoard,
            isXNext: game.isXNext,
            activeSubBoard: game.activeSubBoard,
            blindMode: game.blindMode,
            winner: game.winner,
        });
    }

    game.subBoards[subBoardIndex][cellIndex] = game.isXNext ? 'X' : 'O';
    game.isXNext = !game.isXNext;

    const subBoardWinner = calculateWinner(game.subBoards[subBoardIndex]);
    if (subBoardWinner) {
        game.mainBoard[subBoardIndex] = subBoardWinner;
    }

    game.winner = calculateWinner(game.mainBoard);
    game.activeSubBoard = subBoardWinner ? null : cellIndex;

    if (game.winner) {
        score.scores[game.winner]++;
    }

    res.json({
        subBoards: game.subBoards,
        mainBoard: game.mainBoard,
        isXNext: game.isXNext,
        activeSubBoard: game.activeSubBoard,
        blindMode: game.blindMode,
        winner: game.winner,
    });
});

app.get('/tictactoe/get-score', (req, res) => {
    res.json(score.scores);
});

app.post('/tictactoe/set-score', (req, res) => {
    const { player, wins } = req.body;

    if ((player !== 'X' && player !== 'O') || wins < 0) return res.status(400).send('Invalid input');

    score.scores[player] = wins;
    res.json(score.scores);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// 4 in a Row
const gameModel = new FourInARowModel(); // vytvoření instance modelu

app.get('/', (req, res) => {
    res.send('Server běží! Připojte se na /api/makeMove pro tah.');
});

app.post('/fourinarow/makeMove', (req, res) => {
    const { column } = req.body;

    if (typeof column !== 'number' || column < 0 || column > 6) {
        return res.status(400).json({ message: 'Invalid column' });
    }

    const moveResult = gameModel.makeMove(column);
    if (moveResult) {
        res.status(200).json(gameModel.getState());
    } else {
        res.status(400).json({ message: 'Column is full or game is over' });
    }
});
app.post('/fourinarow/new-game', (req, res) => {
    gameModel.resetGame(); // volá resetovací metodu ve vašem modelu
    res.status(200).json(gameModel.getState()); // vrátí aktualizovaný stav hry
});
app.post('/fourinarow/reset', (req, res) => {
    gameModel.resetGame(); // volá resetovací metodu ve vašem modelu
    res.status(200).json(gameModel.getState()); // vrátí aktualizovaný stav hry
});
app.post('/fourinarow/undo', (req, res) => {
    gameModel.undo();
    res.status(200).json(gameModel.getState());
});
app.post('/fourinarow/settings', (req, res) => {
    const options = req.body;
    gameModel.settings(options);
    res.status(200).json(gameModel.getState());
});
app.post('/fourinarow/set-time', (req, res) => {
    const { timeLimit } = req.body;

    if (typeof timeLimit !== 'number' || timeLimit <= 0) {
        console.error('Invalid time limit:', timeLimit); // Přidejte log
        return res.status(400).json({ message: 'Invalid time limit' });
    }

    try {
        gameModel.setTimeLimit(timeLimit);
        console.log('Server updated time limit:', gameModel.getState());
        res.status(200).json(gameModel.getState());
    } catch (error) {
        console.error('Error setting time limit on server:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ======================================== BLACKJACK START ========================================

function initializeDeck() {
    const suits = ['♠', '♣', '♥', '♦'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    return shuffleDeck(deck);
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function calculateHandValue(hand) {
    let value = 0;
    let aceCount = 0;

    for (let card of hand) {
        if (card.value === 'A') {
            aceCount++;
            value += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            value += 10;
        } else {
            value += parseInt(card.value);
        }
    }

    while (value > 21 && aceCount > 0) {
        value -= 10;
        aceCount--;
    }

    return value;
}

app.post('/blackjack/start', (req, res) => {
    const deck = initializeDeck();
    const playerHand = [deck.pop(), deck.pop()];
    const dealerHand = [deck.pop(), deck.pop()];

    res.json({ deck, playerHand, dealerHand });
});

console.log('test 2');

app.post('/blackjack/hit', (req, res) => {
    const { deck, playerHand } = req.body;

    if (deck.length > 0) {
        playerHand.push(deck.pop());
        const playerValue = calculateHandValue(playerHand);

        if (playerValue > 21) {
            return res.json({ playerHand, deck, message: 'Player busts! Dealer wins.', gameOver: true });
        }

        res.json({ playerHand, deck });
    } else {
        res.status(400).json({ message: 'No cards left in deck' });
    }
});

app.post('/blackjack/stand', (req, res) => {
    const { deck, dealerHand, playerHand } = req.body;

    while (calculateHandValue(dealerHand) < 17 && deck.length > 0) {
        dealerHand.push(deck.pop());
    }

    const dealerValue = calculateHandValue(dealerHand);
    const playerValue = calculateHandValue(playerHand);
    let result;

    if (dealerValue > 21 || playerValue > dealerValue) {
        result = 'Player wins!';
    } else if (dealerValue === playerValue) {
        result = "It's a tie!";
    } else {
        result = 'Dealer wins!';
    }

    res.json({ dealerHand, deck, message: result, gameOver: true });
});

// ======================================== BLACKJACK END ========================================
