import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Chessboard from './Chessboard';

const GamePage = ({ navigate }) => {
    const location = useLocation();
    const shouldLoadGame = new URLSearchParams(location.search).get('load');

    const [gameState, setGameState] = useState(null);

    const [settings, setSettings] = useState(null);

    const timerRef = useRef(null);

    const settingsLoaded = useRef(false);

    const timed = useRef(false);
    const [notification, setNotification] = useState({ type: "", message: "" });
    const timeoutRef = useRef(null);  // Reference to store timeout

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


    // Update the useEffect hook that handles the timer
    useEffect(() => {
        if (!gameState || !timed.current) return;

        // Only start timer if game has started (after white's first move)
        if (!gameState.gameStarted || gameState.gameOver) return;

        // Clear existing timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        const currentPlayer = gameState.turn === 'w' ? 'white' : 'black';
        const currentTimer = currentPlayer === 'white' ? 'remainingTimeWhite' : 'remainingTimeBlack';

        timerRef.current = setInterval(() => {
            setGameState(prev => {
                const newTime = prev[currentTimer] - 1000;
                if (newTime <= 0) {
                    clearInterval(timerRef.current);
    
                    // Notify backend about game over
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

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [gameState?.turn, gameState?.gameStarted, gameState?.gameOver]);


    const loadGame = async (savedState) => {
        try {
            const response = await fetch('http://localhost:3001/chess/load', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ savedState })
            });
            const data = await response.json();

            timed.current = savedState.gameMode === "timed" ? true : false;

            setGameState(data);
            showNotification("success", "Game loaded successfully!");
    } catch (error) {
            showNotification("error", "Failed to load the game.");
        }
    };

    const goToSettings = () => {
        navigate('/settings');
    };

    const goToRoot = () => {
        window.location.href = '/';
    };

    const goBack = () => {
        navigate('/');
    };

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

            timed.current = settings.gameMode === "timed" ? true : false;

            const data = await response.json();

            setGameState(data);
        } catch (error) {
            console.error('Error starting new game:', error);
        }
    };

    const handleMove = async (from, to, promotionPiece) => {
        if (gameState?.gameOver) {
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

    useEffect(() => {
        return () => {
            handleExit();
        };
    }, [gameState?.gameId]);

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

    const formatTime = (milliseconds) => {
        if (!milliseconds && milliseconds !== 0) return '--:--';
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

     // Update the game over message to handle all end conditions
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

                { }
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
                            {notification.message && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "10px",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        padding: "10px 20px",
                                        borderRadius: "8px",
                                        zIndex: 1000,
                                        fontSize: "16px",
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
                                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)"
                                    }}
                                >
                                    {notification.message}
                                </div>
                            )}
                            <div style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '10px',
                                marginTop: '20px'
                            }}>
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
                                            
                                            {/* Optional: Review Game Feature */}
                                            <button 
                                                onClick={() => {
                                                    // Implement game review logic
                                                    // This could open a modal showing final board state, move history, etc.
                                                    alert('Game review feature coming soon!');
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

                            <Chessboard
                                fen={gameState ? gameState.fen : undefined}
                                onMove={handleMove}
                                controlType={settings.controlType}
                            />

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

                            <div style={{
                                display: 'flex',
                                gap: '20px',
                                width: '100%',
                                marginTop: '20px'
                            }}>
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
                                <div style={{
                                    display: 'flex',
                                    gap: '20px',
                                    marginLeft: 'auto'
                                }}>
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

                        { }
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
                            borderRadius: "4px",
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