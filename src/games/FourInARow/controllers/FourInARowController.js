import React, { useState, useEffect } from 'react';
import { FourInARowModel } from '../models/FourInARowModel';
import FourInARowView from '../views/FourInARowView';

const model = new FourInARowModel();

function FourInARowController() {
    const [gameState, setGameState] = useState(model.getState());

    useEffect(() => {
        // Přidání observeru, který aktualizuje stav komponenty při změnách v modelu
        model.addObserver(setGameState);
        return () => model.observers = []; // Reset observerů při odpojení
    }, []);

    const startNewGame = () => {
        model.resetGame();
    };

    const makeMove = (column) => {
        model.makeMove(column);
    };

    // Předání dat a akcí do view
    return (
        <FourInARowView
            gameState={gameState}
            makeMove={makeMove}
            startNewGame={startNewGame}
        />
    );
}

export default FourInARowController;
