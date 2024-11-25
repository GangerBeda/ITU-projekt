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

app.post('/catan/init', (req, res) => {
    fs.writeFile(
        'db/gameObj.json',
        '{"hexColors":{"path-0":"#222","material-0":"#222","settler-0":"#222","path-1":"#222","material-1":"#222","settler-1":"#222","path-2":"#222","material-2":"#222","settler-2":"#222","path-3":"#222","material-3":"#222","settler-3":"#222","path-4":"#222","material-4":"#222","settler-4":"#222","path-5":"#222","material-5":"#222","settler-5":"#222","path-6":"#222","material-6":"#222","settler-6":"#222","path-7":"#222","material-7":"#222","settler-7":"#222","path-8":"#222","material-8":"#222","settler-8":"#222","path-9":"#222","material-9":"#222","settler-9":"#222","path-10":"#222","material-10":"#222","settler-10":"#222","path-11":"#222","material-11":"#222","settler-11":"#222","path-12":"#222","material-12":"#222","settler-12":"#222","path-13":"#222","material-13":"#222","settler-13":"#222","path-14":"#222","material-14":"#222","settler-14":"#222","path-15":"#222","material-15":"#222","settler-15":"#222","path-16":"#222","material-16":"#222","settler-16":"#222","path-17":"#222","material-17":"#222","settler-17":"#222","path-18":"#222","material-18":"#222","settler-18":"#222","path-19":"#222","material-19":"#222","settler-19":"#222","path-20":"#222","material-20":"#222","settler-20":"#222","path-21":"#222","material-21":"#222","settler-21":"#222","path-22":"#222","material-22":"#222","settler-22":"#222","path-23":"#222","material-23":"#222","settler-23":"#222","path-24":"#222","material-24":"#222","settler-24":"#222","path-25":"#222","material-25":"#222","settler-25":"#222","path-26":"#222","material-26":"#222","settler-26":"#222","path-27":"#222","material-27":"#222","settler-27":"#222","path-28":"#222","material-28":"#222","settler-28":"#222","path-29":"#222","material-29":"#222","settler-29":"#222","path-30":"#222","material-30":"#222","settler-30":"#222","path-31":"#222","material-31":"#222","settler-31":"#222","path-32":"#222","material-32":"#222","settler-32":"#222","path-33":"#222","material-33":"#222","settler-33":"#222","path-34":"#222","material-34":"#222","settler-34":"#222","path-35":"#222","material-35":"#222","settler-35":"#222","path-36":"#222","material-36":"#222","settler-36":"#222","path-37":"#222","material-37":"#222","settler-37":"#222","path-38":"#222","material-38":"#222","settler-38":"#222","path-39":"#222","material-39":"#222","settler-39":"#222","path-40":"#222","material-40":"#222","settler-40":"#222","path-41":"#222","material-41":"#222","settler-41":"#222","path-42":"#222","material-42":"#222","settler-42":"#222","path-43":"#222","material-43":"#222","settler-43":"#222","path-44":"#222","material-44":"#222","settler-44":"#222","path-45":"#222","material-45":"#222","settler-45":"#222","path-46":"#222","material-46":"#222","settler-46":"#222","path-47":"#222","material-47":"#222","settler-47":"#222","path-48":"#222","material-48":"#222","settler-48":"#222","path-49":"#222","material-49":"#222","settler-49":"#222","path-50":"#222","material-50":"#222","settler-50":"#222","path-51":"#222","material-51":"#222","settler-51":"#222","path-52":"#222","material-52":"#222","settler-52":"#222","path-53":"#222","material-53":"#222","settler-53":"#222","path-54":"#222","material-54":"#222","settler-54":"#222","path-55":"#222","material-55":"#222","settler-55":"#222","path-56":"#222","material-56":"#222","settler-56":"#222","path-57":"#222","material-57":"#222","settler-57":"#222","path-58":"#222","material-58":"#222","settler-58":"#222","path-59":"#222","material-59":"#222","settler-59":"#222","path-60":"#222","material-60":"#222","settler-60":"#222","path-61":"#222","material-61":"#222","settler-61":"#222","path-62":"#222","material-62":"#222","settler-62":"#222","path-63":"#222","material-63":"#222","settler-63":"#222","path-64":"#222","material-64":"#222","settler-64":"#222","path-65":"#222","material-65":"#222","settler-65":"#222","path-66":"#222","material-66":"#222","settler-66":"#222","path-67":"#222","material-67":"#222","settler-67":"#222","path-68":"#222","material-68":"#222","settler-68":"#222","path-69":"#222","material-69":"#222","settler-69":"#222","path-70":"#222","material-70":"#222","settler-70":"#222","path-71":"#222","material-71":"#222","settler-71":"#222","path-72":"#222","material-72":"#222","settler-72":"#222","path-73":"#222","material-73":"#222","settler-73":"#222","path-74":"#222","material-74":"#222","settler-74":"#222","path-75":"#222","material-75":"#222","settler-75":"#222","path-76":"#222","material-76":"#222","settler-76":"#222","path-77":"#222","material-77":"#222","settler-77":"#222","path-78":"#222","material-78":"#222","settler-78":"#222","path-79":"#222","material-79":"#222","settler-79":"#222","path-80":"#222","material-80":"#222","settler-80":"#222","path-81":"#222","material-81":"#222","settler-81":"#222","path-82":"#222","material-82":"#222","settler-82":"#222","path-83":"#222","material-83":"#222","settler-83":"#222","path-84":"#222","material-84":"#222","settler-84":"#222","path-85":"#222","material-85":"#222","settler-85":"#222","path-86":"#222","material-86":"#222","settler-86":"#222","path-87":"#222","material-87":"#222","settler-87":"#222","path-88":"#222","material-88":"#222","settler-88":"#222","path-89":"#222","material-89":"#222","settler-89":"#222","path-90":"#222","material-90":"#222","settler-90":"#222","path-91":"#222","material-91":"#222","settler-91":"#222","path-92":"#222","material-92":"#222","settler-92":"#222","path-93":"#222","material-93":"#222","settler-93":"#222","path-94":"#222","material-94":"#222","settler-94":"#222","path-95":"#222","material-95":"#222","settler-95":"#222","path-96":"#222","material-96":"#222","settler-96":"#222","path-97":"#222","material-97":"#222","settler-97":"#222","path-98":"#222","material-98":"#222","settler-98":"#222","path-99":"#222","material-99":"#222","settler-99":"#222"},"hexHoverColors":{"path-0":"#555","material-0":"#555","settler-0":"#555","path-1":"#555","material-1":"#555","settler-1":"#555","path-2":"#555","material-2":"#555","settler-2":"#555","path-3":"#555","material-3":"#555","settler-3":"#555","path-4":"#555","material-4":"#555","settler-4":"#555","path-5":"#555","material-5":"#555","settler-5":"#555","path-6":"#555","material-6":"#555","settler-6":"#555","path-7":"#555","material-7":"#555","settler-7":"#555","path-8":"#555","material-8":"#555","settler-8":"#555","path-9":"#555","material-9":"#555","settler-9":"#555","path-10":"#555","material-10":"#555","settler-10":"#555","path-11":"#555","material-11":"#555","settler-11":"#555","path-12":"#555","material-12":"#555","settler-12":"#555","path-13":"#555","material-13":"#555","settler-13":"#555","path-14":"#555","material-14":"#555","settler-14":"#555","path-15":"#555","material-15":"#555","settler-15":"#555","path-16":"#555","material-16":"#555","settler-16":"#555","path-17":"#555","material-17":"#555","settler-17":"#555","path-18":"#555","material-18":"#555","settler-18":"#555","path-19":"#555","material-19":"#555","settler-19":"#555","path-20":"#555","material-20":"#555","settler-20":"#555","path-21":"#555","material-21":"#555","settler-21":"#555","path-22":"#555","material-22":"#555","settler-22":"#555","path-23":"#555","material-23":"#555","settler-23":"#555","path-24":"#555","material-24":"#555","settler-24":"#555","path-25":"#555","material-25":"#555","settler-25":"#555","path-26":"#555","material-26":"#555","settler-26":"#555","path-27":"#555","material-27":"#555","settler-27":"#555","path-28":"#555","material-28":"#555","settler-28":"#555","path-29":"#555","material-29":"#555","settler-29":"#555","path-30":"#555","material-30":"#555","settler-30":"#555","path-31":"#555","material-31":"#555","settler-31":"#555","path-32":"#555","material-32":"#555","settler-32":"#555","path-33":"#555","material-33":"#555","settler-33":"#555","path-34":"#555","material-34":"#555","settler-34":"#555","path-35":"#555","material-35":"#555","settler-35":"#555","path-36":"#555","material-36":"#555","settler-36":"#555","path-37":"#555","material-37":"#555","settler-37":"#555","path-38":"#555","material-38":"#555","settler-38":"#555","path-39":"#555","material-39":"#555","settler-39":"#555","path-40":"#555","material-40":"#555","settler-40":"#555","path-41":"#555","material-41":"#555","settler-41":"#555","path-42":"#555","material-42":"#555","settler-42":"#555","path-43":"#555","material-43":"#555","settler-43":"#555","path-44":"#555","material-44":"#555","settler-44":"#555","path-45":"#555","material-45":"#555","settler-45":"#555","path-46":"#555","material-46":"#555","settler-46":"#555","path-47":"#555","material-47":"#555","settler-47":"#555","path-48":"#555","material-48":"#555","settler-48":"#555","path-49":"#555","material-49":"#555","settler-49":"#555","path-50":"#555","material-50":"#555","settler-50":"#555","path-51":"#555","material-51":"#555","settler-51":"#555","path-52":"#555","material-52":"#555","settler-52":"#555","path-53":"#555","material-53":"#555","settler-53":"#555","path-54":"#555","material-54":"#555","settler-54":"#555","path-55":"#555","material-55":"#555","settler-55":"#555","path-56":"#555","material-56":"#555","settler-56":"#555","path-57":"#555","material-57":"#555","settler-57":"#555","path-58":"#555","material-58":"#555","settler-58":"#555","path-59":"#555","material-59":"#555","settler-59":"#555","path-60":"#555","material-60":"#555","settler-60":"#555","path-61":"#555","material-61":"#555","settler-61":"#555","path-62":"#555","material-62":"#555","settler-62":"#555","path-63":"#555","material-63":"#555","settler-63":"#555","path-64":"#555","material-64":"#555","settler-64":"#555","path-65":"#555","material-65":"#555","settler-65":"#555","path-66":"#555","material-66":"#555","settler-66":"#555","path-67":"#555","material-67":"#555","settler-67":"#555","path-68":"#555","material-68":"#555","settler-68":"#555","path-69":"#555","material-69":"#555","settler-69":"#555","path-70":"#555","material-70":"#555","settler-70":"#555","path-71":"#555","material-71":"#555","settler-71":"#555","path-72":"#555","material-72":"#555","settler-72":"#555","path-73":"#555","material-73":"#555","settler-73":"#555","path-74":"#555","material-74":"#555","settler-74":"#555","path-75":"#555","material-75":"#555","settler-75":"#555","path-76":"#555","material-76":"#555","settler-76":"#555","path-77":"#555","material-77":"#555","settler-77":"#555","path-78":"#555","material-78":"#555","settler-78":"#555","path-79":"#555","material-79":"#555","settler-79":"#555","path-80":"#555","material-80":"#555","settler-80":"#555","path-81":"#555","material-81":"#555","settler-81":"#555","path-82":"#555","material-82":"#555","settler-82":"#555","path-83":"#555","material-83":"#555","settler-83":"#555","path-84":"#555","material-84":"#555","settler-84":"#555","path-85":"#555","material-85":"#555","settler-85":"#555","path-86":"#555","material-86":"#555","settler-86":"#555","path-87":"#555","material-87":"#555","settler-87":"#555","path-88":"#555","material-88":"#555","settler-88":"#555","path-89":"#555","material-89":"#555","settler-89":"#555","path-90":"#555","material-90":"#555","settler-90":"#555","path-91":"#555","material-91":"#555","settler-91":"#555","path-92":"#555","material-92":"#555","settler-92":"#555","path-93":"#555","material-93":"#555","settler-93":"#555","path-94":"#555","material-94":"#555","settler-94":"#555","path-95":"#555","material-95":"#555","settler-95":"#555","path-96":"#555","material-96":"#555","settler-96":"#555","path-97":"#555","material-97":"#555","settler-97":"#555","path-98":"#555","material-98":"#555","settler-98":"#555","path-99":"#555","material-99":"#555","settler-99":"#555"}}',
        (err) => {
            if (err) {
                console.error('Error writing to file', err);
                return res.status(500).json({ message: 'Failed to save gameObj' });
            }

            res.status(201).json({
                message: 'Init successful',
            });
        }
    );
    console.log('hi');
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
        this.lastMoveTime = null; // Initialize as null to indicate game hasn't started
        this.gameStarted = false; // New flag to track if game has started
        this.winner = null; // Track game winner
        this.gameOver = false;
    }

    updateTime() {
        if (this.gameMode === 'timed' && this.gameStarted) {
            const currentTime = Date.now();
            
            // Only update time if last move time exists (game has started)
            if (this.lastMoveTime) {
                const timePassed = currentTime - this.lastMoveTime;
                console.log(timePassed);
                if (this.chess.turn() === 'w') {
                    this.remainingTimeWhite = Math.max(0, this.remainingTimeWhite - timePassed);
                    if (this.remainingTimeWhite === 0) {
                        this.winner = 'black'; // Black wins if white runs out of time
                        this.gameOver = true;
                    }
                } else {
                    this.remainingTimeBlack = Math.max(0, this.remainingTimeBlack - timePassed);
                    if (this.remainingTimeBlack === 0) {
                        this.winner = 'white'; // White wins if black runs out of time
                        this.gameOver = true;
                    }
                }
            }
            
            this.lastMoveTime = currentTime;
        }
    }

    checkGameEnd() {
        if (this.chess.isCheckmate()) {
            this.winner = this.chess.turn() === 'w' ? 'black' : 'white';
            this.gameOver = true;
        } else if (this.chess.isDraw() || this.chess.isStalemate() || this.chess.isInsufficientMaterial()) {
            this.winner = 'draw';
            this.gameOver = true;
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
    const { gameId, from, to, promotion } = req.body; // Add promotion here
    const game = games.get(gameId);

    if (!game) {
        return res.status(404).json({ error: 'Game not found' });
    }

    if (game.gameOver) {
        return res.status(400).json({ error: 'Game is already over' });
    }

    game.updateTime();
    if (game.gameOver) {
        return res.status(400).json({ error: `Game over: ${game.winner} wins` });
    }

    try {
        let move;
        // Handle promotion if provided
        if (promotion) {
            move = game.chess.move({ from, to, promotion }); // Handle pawn promotion
        } else {
            move = game.chess.move({ from, to }); // Normal move
        }

        if (!game.gameStarted && game.chess.turn() === 'b') {
            game.gameStarted = true;
            game.lastMoveTime = Date.now();
        }

        game.moveHistory.push(move);
        game.checkGameEnd();

        const response = {
            fen: game.chess.fen(),
            turn: game.chess.turn(),
            isCheck: game.chess.isCheck(),
            isCheckmate: game.chess.isCheckmate(),
            isDraw: game.chess.isDraw(),
            moveHistory: game.moveHistory,
            remainingTimeWhite: game.remainingTimeWhite,
            remainingTimeBlack: game.remainingTimeBlack,
            winner: game.winner,
            gameStarted: game.gameStarted,
            gameOver: game.gameOver
        };

        res.json(response);
    } catch (error) {
        res.status(400).json({ error: "Illegal move. Try again." });
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
