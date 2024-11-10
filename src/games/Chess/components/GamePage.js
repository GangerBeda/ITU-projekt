import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom'; // Pridaný import
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Chessboard from './Chessboard';

const GamePage = ({ navigate }) => {
    const location = useLocation();
    const shouldLoadGame = new URLSearchParams(location.search).get('load');

    const [gameState, setGameState] = useState(null);

    const [settings, setSettings] = useState(null);

    const timerRef = useRef(null);

    // A ref to track whether settings have been loaded
    const settingsLoaded = useRef(false);

    const timed = useRef(false);

    const loadSettings = () => {
        const savedSettings = localStorage.getItem('chessSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));  // Load saved settings
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
            settingsLoaded.current = true; // Mark settings as loaded
        }

        if (settings === null) {
            return; // Exit early if settings aren't loaded yet
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
    }, [settings]);  // Only run when settings or shouldLoadGame change


    useEffect(() => {
        if (!gameState || !gameState.turn || !timed.current) return;  // Exit if no game state or if it's not a timed game

        // Set the timer based on the current player's turn (white or black)
        const currentPlayer = gameState.turn === 'w' ? 'white' : 'black';
        const currentTimer = currentPlayer === 'white' ? 'remainingTimeWhite' : 'remainingTimeBlack';

        // Set up the timer to update every second
        const timer = setInterval(() => {
            if (gameState.turn === 'w' && currentPlayer === 'white') {
                setGameState(prev => ({
                    ...prev,
                    [currentTimer]: prev[currentTimer] - 1000  // Subtract 1 second
                }));
            } else if (gameState.turn === 'b' && currentPlayer === 'black') {
                setGameState(prev => ({
                    ...prev,
                    [currentTimer]: prev[currentTimer] - 1000  // Subtract 1 second
                }));
            }
        }, 1000);

        // Cleanup function to clear the interval when the component unmounts or when the turn changes
        return () => clearInterval(timer);
    }, [gameState?.turn, gameState?.remainingTimeWhite, gameState?.remainingTimeBlack, settings?.gameMode]); // Trigger when game state or settings change


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
        } catch (error) {
            console.error('Error loading game:', error);
            alert('Failed to load game');
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

    const handleMove = async (from, to) => {
        try {
            const response = await fetch('http://localhost:3001/chess/move', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gameId: gameState.gameId,
                    from,
                    to
                })
            });
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

            // Save to localStorage for demo purposes
            localStorage.setItem('savedChessGame', JSON.stringify(data.savedState));
            alert('Game saved successfully!');
        } catch (error) {
            console.error('Error saving game:', error);
            alert('Failed to save game');
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

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            handleExit();
        };
    }, [gameState?.gameId]);

    const formatTime = (milliseconds) => {
        if (!milliseconds && milliseconds !== 0) return '--:--';
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
                        backgroundSize: '45px 45px', // Set a smaller size for the image
                        backgroundRepeat: 'no-repeat', // Prevents repeating the image
                        backgroundPosition: 'center' // Center the image in the button
                    }}
                ></button>

                {/* White card container */}
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
                                        backgroundSize: '25px 25px', // Set a smaller size for the image
                                        backgroundRepeat: 'no-repeat', // Prevents repeating the image
                                        backgroundPosition: 'center' // Center the image in the button
                                    }}>
                                    </button>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    gap: '20px',
                                    marginLeft: 'auto'
                                }}>
                                    <button onClick={startNewGame} className="btn-secondary" style={{
                                        backgroundColor: '#f5f5f5',
                                        width: '40px',
                                        height: '40px',
                                        border: "2px solid black",
                                        borderRadius: "4px",
                                        backgroundImage: `url(${require('../assets/images/icons/restart_icon.png')})`,
                                        backgroundSize: '30px 30px', // Set a smaller size for the image
                                        backgroundRepeat: 'no-repeat', // Prevents repeating the image
                                        backgroundPosition: 'center' // Center the image in the button
                                    }}></button>
                                    <button onClick={handleSave} className="btn-secondary" style={{
                                        backgroundColor: '#f5f5f5',
                                        width: '40px',
                                        height: '40px',
                                        border: "2px solid black",
                                        borderRadius: "4px",
                                        backgroundImage: `url(${require('../assets/images/icons/save_icon.png')})`,
                                        backgroundSize: '30px 30px', // Set a smaller size for the image
                                        backgroundRepeat: 'no-repeat', // Prevents repeating the image
                                        backgroundPosition: 'center' // Center the image in the button
                                    }}></button>
                                    <button onClick={goToSettings} className="btn-secondary" style={{
                                        backgroundColor: '#f5f5f5',
                                        width: '40px',
                                        height: '40px',
                                        border: "2px solid black",
                                        borderRadius: "4px",
                                        backgroundImage: `url(${require('../assets/images/icons/settings_icon.png')})`,
                                        backgroundSize: '30px 30px', // Set a smaller size for the image
                                        backgroundRepeat: 'no-repeat', // Prevents repeating the image
                                        backgroundPosition: 'center' // Center the image in the button
                                    }}></button>
                                </div>
                            </div>
                        </div>

                        {/* Move history panel */}
                        <div style={{
                            width: settings.notation === 'detailed' ? '200px' : '140px', // Dynamic width based on notation
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
                                            fontWeight: index % 2 !== 0 ? 'bold' : 'normal', // Odd indices are bold
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