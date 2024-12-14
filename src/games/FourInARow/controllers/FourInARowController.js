import React, { useState, useEffect } from 'react';
import { FourInARowModel } from '../models/FourInARowModel';
import FourInARowView from '../views/FourInARowView';
import SettingsPopup from '../views/Buttons/SettingsPopup';
import { useNavigate } from 'react-router-dom'; //home


const model = new FourInARowModel();


function FourInARowController() {
    const [gameState, setGameState] = useState(model.getState());
    const [showSettings, setShowSettings] = useState(false); // Inicializace stavu pro zobrazení nastavení
    const navigate = useNavigate(); // Inicializace navigace pomocí React Routeru home
    
    useEffect(() => {
        console.log("useEffect pouzito, NACTENI/REFRESH")
        const fetchState = async () => {
            try {
                // Načítání aktuálního stavu
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

         // Spuštění intervalu pro pravidelné aktualizace časovače
         const interval = setInterval(() => {
            setGameState((prevState) => ({
                ...prevState,
                remainingTime: prevState.TimerOn && prevState.gameStarted
                    ? Math.max(prevState.remainingTime - 1, 0)
                    : prevState.remainingTime
            }));
        }, 1000);

        fetchState(); // načítání stavu pri spusteni
        // Vyčištění při odchodu z komponenty
        return () => clearInterval(interval);
}, []);
    
    const startNewGame = async () => {
        console.log("Starting new game")
        try {
            const response = await fetch('http://localhost:3001/fourinarow/new-game', {
                method: 'POST',
            });
            if (response.ok) {
                const updatedState = await response.json();
                setGameState(updatedState);  // aktualizuje stav hry na základě odpovědi ze serveru
                console.log("updated state in startNewGame");
            } else {
            }
        } catch (error) {
            console.error('Error starting new game:', error);
        }
    };
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
            body: JSON.stringify({ column }),
        });
        if (response.ok) {
            const updatedState = await response.json();
            setGameState((prevState) => ({
                ...updatedState,
                TimerOn: prevState.TimerOn, // Udržení lokálního TimerOn
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
                setGameState(updatedState); // Aktualizuje stav hry podle odpovědi serveru
            } else {
                console.error('Failed to undo move');
            }
        } catch (error) {
            console.error('Error undoing move:', error);
        }
    };
    const toggleSettings = () => {
        setShowSettings(!showSettings); // inicializace na false, toggle
    };

    const setTimeLimit = async () => {
        const time = prompt("Zadejte časový limit na tah (v sekundách):"); //TODO server vypisuje obsah pouze po zadani cassu checknout
        if (time !== null && !isNaN(time) && Number(time) > 0) {
            const parsedTime = Number(time);
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
                        remainingTime: parsedTime, // Okamžitě nastaví zbývající čas
                        TimerOn: true,  // Přidáno zapnutí časovače
                    });
                    console.log("Časový limit nastaven na serveru:", updatedState.timeLimit);
                } else {
                    console.error("Chyba při nastavení časového limitu na serveru");
                }
            } catch (error) {
                console.error("Chyba při připojení k serveru:", error);
            }
        } else {
            console.log("Neplatný vstup nebo zrušeno");
        }
    };

    const goToMainMenu = () => {
        navigate('/'); // Přesměruje na hlavní stránku (HomePage)
        console.log("Returning to main menu");
    };

    const timerToggle = async () => {
        try {
            const response = await fetch('http://localhost:3001/fourinarow/timer-toggle', {
                method: 'POST',
            });
            if (response.ok) {
                const updatedState = await response.json();
                setGameState(updatedState);
            } else {
                console.error('Failed to toggle timer');
            }
        } catch (error) {
            console.error('Error toggling timer:', error);
        }
    };
    
    const getTimerMessage = () => {
        if (!gameState.TimerOn) return null;
        if (!gameState.gameStarted) return 'Čas se spustí po prvním tahu.';
        
        if (gameState.remainingTime > 0) {
            return `Zbývající čas na tah: ${gameState.remainingTime} sekund`;
        } else {
            //gameState.turnColour === 'red' ? 'yellow' : 'red';
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
                gameState={gameState}
                makeMove={makeMove}
                startNewGame={startNewGame}
                resetGame={resetGame}
                undo={undo}
                setTimeLimit={setTimeLimit} // Správný název předání funkce
                toggleSettings={toggleSettings}
                showNewGameButton={gameState.winner || gameState.full}
                goToMainMenu={goToMainMenu}
                timerToggle={timerToggle}
                timerMessage={getTimerMessage()}
            />
                {showSettings && <SettingsPopup onClose={toggleSettings} />}
        </div>
    );

}

export default FourInARowController;
