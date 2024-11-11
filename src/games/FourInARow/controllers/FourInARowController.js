import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FourInARowModel } from '../models/FourInARowModel';
import FourInARowView from '../views/FourInARowView';

const model = new FourInARowModel();

function FourInARowController() {
    const [gameState, setGameState] = useState(model.getState());
    const [showSettings, setShowSettings] = useState(false);
    const navigate = useNavigate(); // Inicializace navigace pomocí React Routeru

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

    const goToMainMenu = () => {
        navigate('/'); // Přesměruje na hlavní stránku (HomePage)
        console.log("Returning to main menu");
    };

    return (

            <FourInARowView
                gameState={gameState}
                makeMove={makeMove}
                startNewGame={startNewGame}
                resetGame={resetGame}
                undo={undo}
                setTimeLimit={setTimeLimit}
                goToMainMenu={goToMainMenu} // Předáme jako prop
                toggleSettings={toggleSettings}   // Předáváme funkci toggleSettings
                showSettings={showSettings}
            />

    );
}

export default FourInARowController;
