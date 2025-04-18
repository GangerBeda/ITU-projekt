/*********************************************************
 * Autor: Martin Bureš <xbures38>
*  Project: Games Hub
 * Game: 4 in a Row
 *********************************************************/
import React, { useState, useEffect } from 'react';
import { FourInARowModel } from '../models/FourInARowModel';
import FourInARowView from '../views/FourInARowView';
import { useNavigate } from 'react-router-dom';
import TimeLimitPopup from '../views/Buttons/TimeLimitPopup';

const model = new FourInARowModel();

function FourInARowController() {
    const [gameState, setGameState] = useState(model.getState());
    const [showSettings, setShowSettings] = useState(false); // Inicializace stavu pro zobrazení nastavení
    const navigate = useNavigate(); // Inicializace navigace pomocí React Routeru home
    const [showTimeLimitPopup, setShowTimeLimitPopup] = useState(false);

    const toggleTimeLimitPopup = () => {
        setShowTimeLimitPopup(!showTimeLimitPopup);
    };
    
    useEffect(() => {
        const fetchState = async () => {
            try {
                // Načítání aktuálního stavu hry při prvním načtení nebo po obnovení stránky
                const response = await fetch('http://localhost:3001/fourinarow/current-state');
                if (response.ok) {
                    const updatedState = await response.json();
                    setGameState(updatedState);
                } else {
                    console.error("Chyba při načítání stavu");
                }
            } catch (error) {
                console.error("Chyba při připojení k serveru:", error);
            }
        };
    
        const interval = setInterval(() => {
            setGameState((prevState) => {
                // Kontrola všech podmínek pro správný běh časovače
                if (
                    prevState.TimerOn &&
                    prevState.TimerOnVypZap &&
                    prevState.gameStarted &&
                    prevState.remainingTime > 0
                ) {
                    return {
                        ...prevState,
                        remainingTime: prevState.remainingTime - 1 
                    };
                }
                return prevState; // Neodečítat čas, pokud podmínky nejsou splněny
            });
        }, 1000);
    
        fetchState(); // Načtení stavu při prvním vykreslení
    
        // Vyčištění intervalu při unmountu komponenty
        return () => clearInterval(interval);
    }, []);
    
    
    const resetGame = async () => {
        console.log("Reseting game")
        try {
            const response = await fetch('http://localhost:3001/fourinarow/reset', {
                method: 'POST',
            });
            if (response.ok) {
                const updatedState = await response.json();
                setGameState(updatedState);
                console.log("Updated state in resetGame");
            } else {
                console.error('Failed to start a new game');
            }
        } catch (error) {
            console.error('Error starting new game:', error);
        }
    };


const makeMove = async (column) => {
    try {
        const response = await fetch('http://localhost:3001/fourinarow/makeMove', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ column }),               // převádí JavaScript objekt do řetězce JSON (JavaScript Object Notation),
                                                            // aby mohl být odeslán na server.
        });
        if (response.ok) {
            const updatedState = await response.json();
            setGameState((prevState) => ({
                ...updatedState,
                TimerOn: prevState.TimerOn, // Zachování stavu časovače na klientovi
            }));
        } else {
            const error = await response.json();
            console.error('Move failed:', error);
        }
    } catch (error) {
        console.error('Error making move:', error);
    }
};

    const undo = async () => {
        try {
            const response = await fetch('http://localhost:3001/fourinarow/undo', {
                method: 'POST',
            });
            if (response.ok) {
                const updatedState = await response.json();
                setGameState(updatedState);
            } else {
                console.error('Failed to undo move');
            }
        } catch (error) {
            console.error('Error undoing move:', error);
        }
    };

    const setTimeLimit = async (parsedTime) => {
        console.log("Nastavený čas na klientovi:", parsedTime);
    
        try {
            const response = await fetch('http://localhost:3001/fourinarow/set-time', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ timeLimit: parsedTime }),
            });
    
            if (response.ok) {
                const updatedState = await response.json();
                setGameState({
                    ...updatedState,
                    remainingTime: parsedTime, 
                    TimerOn: true,  
                });
                console.log("Časový limit nastaven na serveru:", updatedState.timeLimit);
            } else {
                console.error("Chyba při nastavení časového limitu na serveru");
            }
        } catch (error) {
            console.error("Chyba při připojení k serveru:", error);
        }
    };

    const timerToggle = async () => {
        try {
            const response = await fetch('http://localhost:3001/fourinarow/timer-toggle', {
                method: 'POST',
            });
            if (response.ok) {
                const updatedState = await response.json();
                setGameState({
                    ...updatedState,
                    remainingTime: updatedState.timeLimit, 
                    TimerOn: updatedState.TimerOnVypZap, 

                });
    
                console.log("Timer toggled and state updated");
            } else {
                console.error('Failed to toggle timer');
            }
        } catch (error) {
            console.error('Error toggling timer:', error);
        }
    };

    const toggleSettings = () => {
        setShowSettings(!showSettings); // inicializace na false, toggle
    };
    

    const goToMainMenu = () => {
        navigate('/'); // Přesměruje na hlavní stránku (HomePage)
        console.log("Returning to main menu");
    };
    
    
    
    const getTimerMessage = () => {
        if (!gameState.TimerOnVypZap) return null;
        if (!gameState.gameStarted) return 'Čas se spustí po tahu.';
        
        if (gameState.remainingTime > 0) {
            return `Zbývající čas na tah: ${gameState.remainingTime} sekund`;

        } else {

            const player = gameState.currentPlayer === 'red' ? 'yellow' : 'red'
            gameState.turnColour = `${player}-turn`;
            gameState.highlightedPlayer = player === 'red' ?  'Červený' : 'Žlutý' 
            gameState.message = `hráč vyhrál!`;
            
            return "Čas vypršel";
        }
    };
    
    

    // Předání dat a akcí do view
    return (
        <div>

            <FourInARowView
                goToMainMenu={goToMainMenu}
                toggleSettings={toggleSettings}
                toggleTimeLimitPopup={toggleTimeLimitPopup}
                timerToggle={timerToggle}
                gameState={gameState}
                makeMove={makeMove}
                resetGame={resetGame}
                undo={undo}
                showNewGameButton={gameState.winner || gameState.full || gameState.remainingTime <= 0}
                timerMessage={getTimerMessage()}
                setTimeLimit={setTimeLimit}  // Předáno do TimeLimitPopup pro nastavení časového limitu

                
            />
                {/* Podmíněné vykreslení popupů pro nastavení a časový limit,
                s předáním funkcí pro zavření a nastavení hodnot */}

                {showTimeLimitPopup && (
                <TimeLimitPopup
                    onClose={toggleTimeLimitPopup}
                    onSetTimeLimit={setTimeLimit}
                />
)}

        </div>
    );
}

export default FourInARowController;
