import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ navigate, rootNavigate }) => {
    const startNewGame = () => {
        navigate('/play', { state: { isNew: true } });
    };

    const loadGame = () => {
        // Implement load game logic
        navigate('/play?load=true', { state: { isNew: false } });
    };

    const goToSettings = () => {
        navigate('/settings');
    };

    const goToRoot = () => {
        window.location.href = '/';
    };


    return (
        <DndProvider backend={HTML5Backend}>
            <div style={{
                position: 'relative',
                width: '100%'
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

                <div
                    style={{
                        backgroundColor: '#D3D3D3',
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',  // Ensures the buttons are centered vertically as well
                        padding: '20px'
                    }}
                >
                    <div style={{
                        backgroundColor: '#E5E5E5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '400px', // Scaled from 350px
                        marginBottom: '12rem', // Scaled from 10rem
                    }}>
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '12px', // Scaled from 8px
                            width: '100%',
                            padding: '50px', // Scaled from 20px
                            boxShadow: '0 3px 6px rgba(0,0,0,0.1)' // Slightly adjusted for scale
                        }}>
                            <div style={{
                                backgroundColor: 'white',
                                margin: '-30px -30px 30px -30px', // Scaled from -20px -20px 20px -20px
                                padding: '22px 30px', // Scaled from 15px 20px
                                borderRadius: '12px 12px 0 0', // Scaled from 8px
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '15px' // Scaled from 10px
                            }}>
                                <h2 style={{
                                    display: 'flex',
                                    color: 'black',
                                    margin: 0,
                                    fontSize: '40px', // Scaled from 16px
                                    fontWeight: 'bold'
                                }}>
                                    Chess Game
                                </h2>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}> {/* Scaled from 20px */}
                                <div>
                                    <div style={{ display: 'flex' }}> {/* Scaled from 8px */}
                                        <button
                                            onClick={startNewGame}
                                            style={{
                                                flex: 1,
                                                padding: '12px', // Scaled from 8px
                                                borderRadius: '6px', // Scaled from 4px
                                                border: 'none',
                                                backgroundColor: '#3B52E4',
                                                color: 'white',
                                                cursor: 'pointer',
                                                fontSize: '25px', // Scaled from 14px
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            New Game
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <div style={{ display: 'flex' }}> {/* Scaled from 8px */}
                                        <button
                                            onClick={loadGame}
                                            style={{
                                                flex: 1,
                                                padding: '12px', // Scaled from 8px
                                                borderRadius: '6px', // Scaled from 4px
                                                border: 'none',
                                                backgroundColor: '#E5E5E5',
                                                color: 'black',
                                                cursor: 'pointer',
                                                fontSize: '25px', // Scaled from 14px
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Load Game
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <div style={{ display: 'flex' }}> {/* Scaled from 8px */}
                                        <button
                                            onClick={goToSettings}
                                            style={{
                                                flex: 1,
                                                padding: '12px', // Scaled from 8px
                                                borderRadius: '6px', // Scaled from 4px
                                                border: 'none',
                                                backgroundColor: '#E5E5E5',
                                                color: 'black',
                                                cursor: 'pointer',
                                                fontSize: '25px', // Scaled from 14px
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Settings
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    
                </div>
            </div>
        </DndProvider>
    );

};

export default HomePage;