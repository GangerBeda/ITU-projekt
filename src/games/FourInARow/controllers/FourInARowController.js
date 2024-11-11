import React, { useState } from 'react';
import { FourInARowModel } from '../models/FourInARowModel';
import FourInARowView from '../views/FourInARowView';
import SettingsPopup from '../views/Buttons/SettingsPopup';

const model = new FourInARowModel();

function FourInARowController() {
    const [gameState, setGameState] = useState(model.getState());
    const [showSettings, setShowSettings] = useState(false);

    const updateGameState = () => {
        setGameState(model.getState());
        console.log("Updated GameState in Controller: ", model.getState());
    };

    const startNewGame = () => {
        model.resetGame();
        updateGameState();
        console.log("New game started, GameState: ", model.getState());
    };

    const resetGame = () => {
        model.resetGame();
        updateGameState();
        console.log("Game reset, GameState: ", model.getState());
    };

    const makeMove = (column) => {
        model.makeMove(column);
        updateGameState();
        console.log("Move made in column:", column, "GameState: ", model.getState());
    };

    const undo = () => {
        model.undo();
        updateGameState();
        console.log("Undo performed, GameState: ", model.getState());
    };

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };

    const setTimeLimit = () => {
        const time = prompt("Zadejte časový limit na tah (v sekundách):");
        if (time !== null && !isNaN(time) && Number(time) > 0) {
            const parsedTime = Number(time);
            model.setTimeLimit(parsedTime);
            updateGameState();
            console.log("Časový limit nastaven na klientovi:", parsedTime);
        } else {
            console.log("Neplatný vstup nebo zrušeno");
        }
    };

    return (
        <div>
            <button onClick={toggleSettings}>Nastavení</button>

            {showSettings && (
                <SettingsPopup onClose={toggleSettings} />
            )}

            <FourInARowView
                gameState={gameState}
                makeMove={makeMove}
                startNewGame={startNewGame}
                resetGame={resetGame}
                undo={undo}
                setTimeLimit={setTimeLimit}
            />
        </div>
    );

}

export default FourInARowController;
