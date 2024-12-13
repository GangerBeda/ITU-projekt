/*
 * ITU Games Hub
 * @brief Game Page component for the Chess Game
 * @author Da Costa Menezes Kristián || xdacos01
 */

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Chessboard from './Chessboard';

/**
 * GamePage Component
 * 
 * Manages the game state, including starting new games, loading saved games,
 * handling moves, saving game progress, and displaying notifications.
 * Utilizes React DnD for drag-and-drop functionality and handles game timers.
 * 
 * @param {Object} props - Component properties
 * @param {Function} props.navigate - Function to navigate between routes
 * @returns {JSX.Element} The rendered GamePage component
 */
const GamePage = ({ navigate }) => {
    const location = useLocation(); // Hook to access the current location
    const shouldLoadGame = new URLSearchParams(location.search).get('load'); // Determine if a saved game should be loaded

    const [gameState, setGameState] = useState(null); // State to hold the current game state
    const [settings, setSettings] = useState(null); // State to hold game settings
    const [notification, setNotification] = useState({ type: "", message: "" }); // State for notifications

    const timerRef = useRef(null); // Reference for the game timer
    const settingsLoaded = useRef(false); // Reference to check if settings are loaded
    const timed = useRef(false); // Reference to determine if the game mode is timed
    const timeoutRef = useRef(null); // Reference for notification timeout

    /**
     * Loads game settings from localStorage or sets default settings.
     */
    const loadSettings = () => {
        const savedSettings = localStorage.getItem('chessSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        } else {
            setSettings({
                gameMode: 'timed',
                controlType: 'click',
                timeLimit: 5,
                notation: 'compact'
            });
        }
    };

    // Load settings and initialize game state
    useEffect(() => {
        if (!settingsLoaded.current) {
            loadSettings();
            settingsLoaded.current = true;
        }

        if (settings === null) {
            return;
        }

        if (shouldLoadGame) {
            const savedState = JSON.parse(localStorage.getItem('savedChessGame'));
            if (savedState) {
                loadGame(savedState);
            } else {
                startNewGame();
            }
        } else {
            startNewGame();
        }
    }, [settings]);

    /**
     * Handles the game timer, updating remaining time and handling timeouts.
     */
    useEffect(() => {
        if (!gameState || !timed.current) return;

        // Start timer only if the game has started and is not over
        if (!gameState.gameStarted || gameState.gameOver) return;

        // Clear existing timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        const currentPlayer = gameState.turn === 'w' ? 'white' : 'black';
        const currentTimer = currentPlayer === 'white' ? 'remainingTimeWhite' : 'remainingTimeBlack';

        // Update the timer every second
        timerRef.current = setInterval(() => {
            setGameState(prev => {
                const newTime = prev[currentTimer] - 1000;
                if (newTime <= 0) {
                    clearInterval(timerRef.current);

                    // Notify backend about game over due to timeout
                    fetch('http://localhost:3001/chess/move', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            gameId: prev.gameId,
                            from: null, // No move is made
                            to: null,   // No move is made
                        }),
                    }).catch(console.error);

                    return {
                        ...prev,
                        [currentTimer]: 0,
                        gameOver: true,
                        winner: currentPlayer === 'white' ? 'black' : 'white',
                    };
                }
                return { ...prev, [currentTimer]: newTime };
            });
        }, 1000);

        // Cleanup timer on component unmount or dependency change
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [gameState?.turn, gameState?.gameStarted, gameState?.gameOver]);

    /**
     * Loads a saved game state from the backend.
     * 
     * @param {Object} savedState - The saved game state
     */
    const loadGame = async (savedState) => {
        try {
            const response = await fetch('http://localhost:3001/chess/load', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ savedState })
            });
            const data = await response.json();

            timed.current = savedState.gameMode === "timed";

            setGameState(data);
            showNotification("success", "Game loaded successfully!");
        } catch (error) {
            showNotification("error", "Failed to load the game.");
        }
    };

    /**
     * Navigates to the settings page.
     */
    const goToSettings = () => {
        navigate('/settings');
    };

    /**
     * Redirects the user to the root URL.
     */
    const goToRoot = () => {
        window.location.href = '/';
    };

    /**
     * Navigates back to the main menu.
     */
    const goBack = () => {
        navigate('/');
    };

    /**
     * Starts a new game by requesting the backend to create a new game state.
     */
    const startNewGame = async () => {
        try {
            const response = await fetch('http://localhost:3001/chess/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode: settings.gameMode,
                    timeLimit: settings.gameMode === 'timed' ? settings.timeLimit : null
                })
            });

            timed.current = settings.gameMode === "timed";

            const data = await response.json();

            setGameState(data);
        } catch (error) {
            console.error('Error starting new game:', error);
        }
    };

    /**
     * Handles a move made by the player, sending it to the backend.
     * 
     * @param {string} from - The source square
     * @param {string} to - The target square
     * @param {string} promotionPiece - The piece to promote to, if applicable
     */
    const handleMove = async (from, to, promotionPiece) => {
        if (gameState?.gameOver) {
            return;
        }

        if (from === to) {
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/chess/move', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gameId: gameState.gameId,
                    from,
                    to,
                    promotion: promotionPiece || null,
                })
            });

            if (!response.ok) {
                const { error } = await response.json();
                showNotification("error", "Illegal move! Try again.");
                return;
            }

            const data = await response.json();
            setGameState(prev => ({ ...prev, ...data }));
        } catch (error) {
            console.error('Error making move:', error);
        }
    };

    /**
     * Saves the current game state to the backend and localStorage.
     */
    const handleSave = async () => {
        try {
            const response = await fetch('http://localhost:3001/chess/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gameId: gameState.gameId
                })
            });
            const data = await response.json();

            localStorage.setItem('savedChessGame', JSON.stringify(data.savedState));
            showNotification("success", "Game saved successfully!");
        } catch (error) {
            console.error('Error saving game:', error);
            showNotification("error", 'Failed to save the game');
        }
    };

    /**
     * Exits the current game by notifying the backend.
     */
    const handleExit = async () => {
        if (gameState?.gameId) {
            try {
                await fetch('http://localhost:3001/chess/exit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        gameId: gameState.gameId
                    })
                });
            } catch (error) {
                console.error('Error exiting game:', error);
            }
        }
    };

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            handleExit();
        };
    }, [gameState?.gameId]);

    /**
     * Displays a notification with the specified type and message.
     * 
     * @param {string} type - The type of notification ('success', 'info', 'error')
     * @param {string} message - The notification message
     */
    const showNotification = (type, message) => {
        // Clear any existing timeout to prevent rapid reset
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    
        setNotification({ type, message });
    
        // Set a new timeout for 3 seconds to hide the notification
        timeoutRef.current = setTimeout(() => {
            setNotification({ type: "", message: "" });
        }, 3000);
    };

    /**
     * Formats time from milliseconds to MM:SS format.
     * 
     * @param {number} milliseconds - Time in milliseconds
     * @returns {string} Formatted time string
     */
    const formatTime = (milliseconds) => {
        if (milliseconds === null || milliseconds === undefined) return '--:--';
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    /**
     * Generates the game over message based on the game state.
     * 
     * @returns {string|null} The game over message or null if the game is not over
     */
    const getGameOverMessage = () => {
        if (!gameState?.gameOver) return null;
        
        if (gameState.winner === 'draw') {
            return "Game Over - It's a draw!";
        }
        
        if (gameState.isCheckmate) {
            return `${gameState.winner.charAt(0).toUpperCase() + gameState.winner.slice(1)} wins by checkmate!`;
        }
        
        // Must be timeout
        return `${gameState.winner.charAt(0).toUpperCase() + gameState.winner.slice(1)} wins by timeout!`;
    };

    if (settings === null) {
        return <div>Loading settings...</div>;
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div style={{
                position: 'relative',
                width: '100%',
                minHeight: '100vh',
                backgroundColor: '#D3D3D3',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                {/* Home Button */}
                <button
                    onClick={goToRoot}
                    className="btn-primary"
                    style={{
                        backgroundImage: `url(${require('../assets/images/icons/home_icon.png')})`,
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        zIndex: 10,
                        backgroundColor: '#D3D3D3',
                        width: '50px',
                        height: '50px',
                        backgroundSize: '45px 45px',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center'
                    }}
                ></button>

                {/* Main Game Container */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '24px',
                    paddingLeft: '30px',
                    paddingRight: '30px',
                    paddingBottom: '15px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '20px',
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            maxWidth: '700px',
                        }}>
                            {/* Notification Message */}
                            {notification.message && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "60px",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        padding: "15px 25px",
                                        borderRadius: "8px",

                                        zIndex: 9999,

                                        fontSize: "20px",
                                        fontWeight: "bold",
                                        backgroundColor:
                                            notification.type === "success" ? "#d4edda" :
                                            notification.type === "info" ? "#cce5ff" :
                                            notification.type === "error" ? "#f8d7da" : "#fff",
                                        color:
                                            notification.type === "success" ? "#155724" :
                                            notification.type === "info" ? "#004085" :
                                            notification.type === "error" ? "#721c24" : "#000",
                                        border:
                                            notification.type === "success" ? "1px solid #c3e6cb" :
                                            notification.type === "info" ? "1px solid #b8daff" :
                                            notification.type === "error" ? "1px solid #f5c6cb" : "none",

                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                                        pointerEvents: "none",

                                        transition: "all 0.3s ease",
                                    }}
                                >
                                    {notification.message}
                                </div>
                            )}

                            {/* Timer and Turn Display */}
                            <div style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '10px',
                                marginTop: '20px'
                            }}>
                                {/* Black Player Timer */}
                                <div style={{
                                    backgroundColor: '#000',
                                    color: '#fff',
                                    padding: '10px 25px',
                                    borderRadius: '8px',
                                    fontSize: '24px',
                                    fontWeight: 'bold'
                                }}>
                                    Black: {formatTime(gameState?.remainingTimeBlack)}
                                </div>

                                {/* Current Turn Indicator */}
                                <div style={{
                                    backgroundColor: gameState?.turn === 'w' ? '#f5f5f5' : '#000',
                                    color: gameState?.turn === 'w' ? '#000' : '#fff',
                                    padding: '10px 25px',
                                    borderRadius: '8px',
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    width: '130px',
                                    textAlign: 'center',
                                    border: '1px solid #000'
                                }}>
                                    Turn: {gameState?.turn === 'w' ? 'White' : 'Black'}
                                </div>
                            </div>

                            {/* Game Over Modal */}
                            {gameState?.gameOver && (
                                <div style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    zIndex: 1000
                                }}>
                                    <div style={{
                                        backgroundColor: 'white',
                                        padding: '30px',
                                        borderRadius: '12px',
                                        textAlign: 'center',
                                        maxWidth: '400px',
                                        width: '90%'
                                    }}>
                                        <h2 style={{ marginBottom: '20px', color: '#333' }}>
                                            {getGameOverMessage()}
                                        </h2>
                                        
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            gap: '15px'
                                        }}>
                                            {/* New Game Button */}
                                            <button 
                                                onClick={() => {
                                                    startNewGame();
                                                    showNotification("info", "New game started!");
                                                }}
                                                style={{
                                                    padding: '12px 24px',
                                                    backgroundColor: '#333',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '18px',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                New Game
                                            </button>
                                            
                                            {/* Review Game Button */}
                                            <button 
                                                onClick={() => {
                                                    showNotification('info', 'Game review feature coming soon!');
                                                }}
                                                style={{
                                                    padding: '12px 24px',
                                                    backgroundColor: '#2196F3',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '18px',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                Review Game
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Chessboard Component */}
                            <Chessboard
                                fen={gameState ? gameState.fen : undefined}
                                onMove={handleMove}
                                controlType={settings.controlType}
                            />

                            {/* White Player Timer */}
                            <div style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'left',
                                marginTop: '10px',
                            }}>
                                <div style={{
                                    backgroundColor: '#f5f5f5',
                                    color: '#000',
                                    padding: '10px 25px',
                                    borderRadius: '8px',
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    border: '1px solid #000'
                                }}>
                                    White: {formatTime(gameState?.remainingTimeWhite)}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{
                                display: 'flex',
                                gap: '20px',
                                width: '100%',
                                marginTop: '20px'
                            }}>
                                {/* Back Button */}
                                <div style={{ flex: '0 0 auto' }}>
                                    <button onClick={goBack} className="btn-secondary" style={{
                                        backgroundColor: '#f5f5f5',
                                        width: '40px',
                                        height: '40px',
                                        border: "2px solid black",
                                        borderRadius: "4px",
                                        backgroundImage: `url(${require('../assets/images/icons/arrow_icon.png')})`,
                                        backgroundSize: '25px 25px',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center'
                                    }}>
                                    </button>
                                </div>
                                
                                {/* Right-side Action Buttons */}
                                <div style={{
                                    display: 'flex',
                                    gap: '20px',
                                    marginLeft: 'auto'
                                }}>
                                    {/* Restart Button */}
                                    <button onClick={() => {
                                            startNewGame();
                                            showNotification("info", "New game started!");
                                        }} 
                                        className="btn-secondary" style={{
                                            backgroundColor: '#f5f5f5',
                                            width: '40px',
                                            height: '40px',
                                            border: "2px solid black",
                                            borderRadius: "4px",
                                            backgroundImage: `url(${require('../assets/images/icons/restart_icon.png')})`,
                                            backgroundSize: '30px 30px',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'center'
                                        }}></button>

                                    {/* Save Button */}
                                    <button onClick={handleSave} className="btn-secondary" style={{
                                        backgroundColor: '#f5f5f5',
                                        width: '40px',
                                        height: '40px',
                                        border: "2px solid black",
                                        borderRadius: "4px",
                                        backgroundImage: `url(${require('../assets/images/icons/save_icon.png')})`,
                                        backgroundSize: '30px 30px',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center'
                                    }}></button>

                                    {/* Settings Button */}
                                    <button onClick={goToSettings} className="btn-secondary" style={{
                                        backgroundColor: '#f5f5f5',
                                        width: '40px',
                                        height: '40px',
                                        border: "2px solid black",
                                        borderRadius: "4px",
                                        backgroundImage: `url(${require('../assets/images/icons/settings_icon.png')})`,
                                        backgroundSize: '30px 30px',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center'
                                    }}></button>
                                </div>
                            </div>
                        </div>

                        {/* Move History Panel */}
                        <div style={{
                            width: settings.notation === 'detailed' ? '200px' : '140px',
                            height: '680px',
                            maxHeight: '680px',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '8px',
                            padding: '10px',
                            overflowY: 'auto',
                            fontSize: '18px',
                            color: '#000',
                            border: "2px solid black",
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                            marginTop: '80px',
                        }}>
                            <h3 style={{ textAlign: 'center', marginTop: '0' }}>Move History</h3>
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {gameState?.moveHistory?.map((move, index) => (
                                    <li
                                        key={index}
                                        style={{
                                            padding: '5px 0',
                                            borderBottom: '1px solid #ccc',
                                            fontSize: settings.notation === 'detailed' ? '18px' : '20px',
                                            fontWeight: index % 2 !== 0 ? 'bold' : 'normal',
                                        }}
                                    >
                                        {settings.notation === 'detailed' ? (
                                            `${index + 1}. ${move.piece} from ${move.from} to ${move.to}`
                                        ) : (
                                            `${index + 1}. ${move.san}`
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </DndProvider>
    );

};

export default GamePage;
