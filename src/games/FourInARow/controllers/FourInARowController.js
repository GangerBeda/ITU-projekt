import React, { useState, useEffect } from 'react';
import { FourInARowModel } from '../models/FourInARowModel';
import FourInARowView from '../views/FourInARowView';
import SettingsPopup from '../views/Buttons/SettingsPopup';


const model = new FourInARowModel();

function FourInARowController() {
    const [gameState, setGameState] = useState(model.getState());
    const [showSettings, setShowSettings] = useState(false); // Inicializace stavu pro zobrazení nastavení

    useEffect(() => {
            console.log("Updated GameState in Controller: ", gameState);
        // Přidání observeru na model pro zajištění synchronizace s view
        const observer = (state) => {
            setGameState(state); // Při změně modelu se aktualizuje view
        };
        
    
        // Čistící funkce, která odstraní observer při odpojení komponenty
        return () => {
            model.observers = model.observers.filter((obs) => obs !== observer);
        };
    }, []);
    

    const startNewGame = async () => {
        try {
            const response = await fetch('http://localhost:3001/fourinarow/new-game', {
                method: 'POST',
            });
            if (response.ok) {
                const updatedState = await response.json();
                setGameState(updatedState);  // aktualizuje stav hry na základě odpovědi ze serveru
            } else {
                console.error('Failed to start a new game');
            }
        } catch (error) {
            console.error('Error starting new game:', error);
        }
    };
    const resetGame = async () => {
        try {
            const response = await fetch('http://localhost:3001/fourinarow/new-game', {
                method: 'POST',
            });
            if (response.ok) {
                const updatedState = await response.json();
                setGameState(updatedState);  // aktualizuje stav hry na základě odpovědi ze serveru
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
                setGameState(updatedState); // Aktualizace stavu hry z odpovědi serveru
            } else {
                console.error('Move failed:', await response.json());
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
        setShowSettings(!showSettings); // Přepne stav pro zobrazení nastavení
    };

    const setTimeLimit = async () => {
        const time = prompt("Zadejte časový limit na tah (v sekundách):");
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
                    setGameState(updatedState); // Aktualizuje stav hry na základě odpovědi serveru
                    console.log("Časový limit nastaven na serveru:", updatedState.timeLimit); // Ověřte, že updatedState.timeLimit není undefined
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




    // Předání dat a akcí do view
    return (
        <div>
            <button onClick={toggleSettings}>Nastavení</button>
            <FourInARowView
                gameState={gameState}
                makeMove={makeMove}
                startNewGame={startNewGame}
                resetGame={resetGame}
                undo={undo}
                setTimeLimit={setTimeLimit} // Správný název předání funkce
            />
            {showSettings && <SettingsPopup onClose={toggleSettings} />}
        </div>
    );

}

export default FourInARowController;
