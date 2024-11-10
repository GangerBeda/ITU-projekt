const express = require('express');
const cors = require('cors');
const fs = require('fs');

const bodyParser = require('body-parser');
const { Chess } = require('chess.js');

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

app.post('/api/gameObj', (req, res) => {
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

app.get('/api/gameObj', (req, res) => {
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
        remainingTimeBlack: game.remainingTimeBlack
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
            remainingTimeBlack: game.remainingTimeBlack
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
        remainingTimeBlack: game.remainingTimeBlack
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
        remainingTimeBlack: game.remainingTimeBlack
    });
});

app.post('/chess/exit', (req, res) => {
    const { gameId } = req.body;
    games.delete(gameId);
    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

