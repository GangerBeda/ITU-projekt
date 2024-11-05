// FourInARow.js
import React, { useState } from 'react';
import FourInARowView from './views/FourInARowView';

function FourInARow() {
    const [gameState, setGameState] = useState({
        board: Array(6).fill(null).map(() => Array(7).fill(null)), // 6x7 mřížka
        currentPlayer: 'red', // Ponecháme hodnotu 'red' pro logiku hry
        winner: null,
    });
    const [message, setMessage] = useState('Hráč Červený začíná.');

    const startNewGame = () => {
        setGameState({
            board: Array(6).fill(null).map(() => Array(7).fill(null)),
            currentPlayer: 'red', // Ponecháme hodnotu 'red' pro začátek hry
            winner: null,
        });
        setMessage('Hráč "Červený" začíná.');
    };

    const makeMove = (column) => {
        if (gameState.winner) {
            setMessage('Hra je ukončena. Začněte novou hru.');
            return;
        }

        const newBoard = gameState.board.map(row => [...row]);
        for (let row = 5; row >= 0; row--) {
            if (!newBoard[row][column]) {
                newBoard[row][column] = gameState.currentPlayer;
                const newPlayer = gameState.currentPlayer === 'red' ? 'yellow' : 'red';
                const winner = checkForWinner(newBoard, row, column, gameState.currentPlayer);

                setGameState({
                    board: newBoard,
                    currentPlayer: newPlayer,
                    winner: winner,
                });

                // Messages
                const currentPlayerName = gameState.currentPlayer === 'red' ? 'Červený' : 'Žlutý';
                const nextPlayerName = newPlayer === 'red' ? 'Červený' : 'Žlutý';

                setMessage(winner ? `Hráč "${currentPlayerName}" vyhrál!` : `Hráč ${nextPlayerName} je na tahu.`);
                return;
            }
        }
        setMessage('Tento sloupec je plný.');
    };

    const checkForWinner = (board, row, column, player) => {
        const directions = [
            { dr: 0, dc: 1 },  // horizontálně
            { dr: 1, dc: 0 },  // vertikálně
            { dr: 1, dc: 1 },  // diagonálně \
            { dr: 1, dc: -1 }  // diagonálně /
        ];
        for (const { dr, dc } of directions) {
            let count = 1;
            for (let step = 1; step <= 3; step++) {
                const r = row + dr * step;
                const c = column + dc * step;
                if (r < 0 || r >= 6 || c < 0 || c >= 7 || board[r][c] !== player) break;
                count++;
            }
            for (let step = 1; step <= 3; step++) {
                const r = row - dr * step;
                const c = column - dc * step;
                if (r < 0 || r >= 6 || c < 0 || c >= 7 || board[r][c] !== player) break;
                count++;
            }
            if (count >= 4) return player;
        }
        return null;
    };

    return (
        <div>
            <FourInARowView gameState={gameState} makeMove={makeMove} />
            <div className="game-info">
                <p>{message}</p>
                {gameState.winner && <button onClick={startNewGame}>Nová hra</button>}
            </div>
        </div>
    );
}

export default FourInARow;
