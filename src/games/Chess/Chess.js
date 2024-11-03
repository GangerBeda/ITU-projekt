import React, { useState, useEffect } from 'react';
import ChessView from './views/ChessView';
import { ChessController } from './controllers/ChessController';
import { ChessModel } from './models/ChessModel';
import './views/ChessView.css';

function Chess() {
    const [gameState, setGameState] = useState(null);
    const [controller, setController] = useState(null);

    useEffect(() => {
        const model = new ChessModel();
        const chessController = new ChessController(model);
        model.addObserver(setGameState);
        setController(chessController);
        setGameState(model.getState());
    }, []);

    if (!gameState || !controller) return <div>Loading...</div>;

    const handleCellClick = (row, col) => {
        const selectedPiece = gameState.selectedPiece;
        if (selectedPiece) {
            const result = controller.handleMove(selectedPiece, [row, col]);
            setGameState(result.gameState);
        } else {
            const piece = gameState.board[row][col];
            if (piece && controller.getPieceColor(piece) === gameState.currentPlayer) {
                setGameState({ ...gameState, selectedPiece: [row, col] });
            }
        }
    };

    return <ChessView
        gameState={gameState}
        controller={controller}
        handleCellClick={handleCellClick}
    />;
}

export default Chess;