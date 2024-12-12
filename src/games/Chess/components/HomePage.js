/*
 * ITU Games Hub
 * @brief Home Page component for the Chess Game
 * @author Da Costa Menezes Kristián || xdacos01
 */

import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

/**
 * HomePage Component
 * 
 * Renders the main menu for the Chess Game, allowing users to start a new game,
 * load an existing game, navigate to settings, or return to the root page.
 * Utilizes React DnD for drag-and-drop functionality.
 * 
 * @param {Object} props - Component properties
 * @param {Function} props.navigate - Function to navigate between routes
 * @param {Function} props.rootNavigate - Function to navigate to the root
 * @returns {JSX.Element} The rendered HomePage component
 */
const HomePage = ({ navigate }) => {

    /**
     * Starts a new game by navigating to the play route with a new game state.
     */
    const startNewGame = () => {
        navigate('/play', { state: { isNew: true } });
    };

    /**
     * Loads an existing game by navigating to the play route with load parameter.
     */
    const loadGame = () => {
        navigate('/play?load=true', { state: { isNew: false } });
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

    return (
        <DndProvider backend={HTML5Backend}>
            <div style={{ position: 'relative', width: '100%' }}>
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

                {/* Main Container */}
                <div
                    style={{
                        backgroundColor: '#D3D3D3',
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px'
                    }}
                >
                    {/* Card Container */}
                    <div style={{
                        backgroundColor: '#E5E5E5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '400px',
                        marginBottom: '12rem',
                    }}>
                        {/* Card Content */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            width: '100%',
                            padding: '50px',
                            boxShadow: '0 3px 6px rgba(0,0,0,0.1)'
                        }}>
                            {/* Card Header */}
                            <div style={{
                                backgroundColor: 'white',
                                margin: '-30px -30px 30px -30px',
                                padding: '22px 30px',
                                borderRadius: '12px 12px 0 0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '15px'
                            }}>
                                <h2 style={{
                                    display: 'flex',
                                    color: 'black',
                                    margin: 0,
                                    fontSize: '40px',
                                    fontWeight: 'bold'
                                }}>
                                    Chess Game
                                </h2>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                {/* New Game Button */}
                                <div>
                                    <div style={{ display: 'flex' }}>
                                        <button
                                            onClick={startNewGame}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                backgroundColor: '#3B52E4',
                                                color: 'white',
                                                cursor: 'pointer',
                                                fontSize: '25px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            New Game
                                        </button>
                                    </div>
                                </div>

                                {/* Load Game Button */}
                                <div>
                                    <div style={{ display: 'flex' }}>
                                        <button
                                            onClick={loadGame}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                backgroundColor: '#E5E5E5',
                                                color: 'black',
                                                cursor: 'pointer',
                                                fontSize: '25px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Load Game
                                        </button>
                                    </div>
                                </div>

                                {/* Settings Button */}
                                <div>
                                    <div style={{ display: 'flex' }}>
                                        <button
                                            onClick={goToSettings}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                backgroundColor: '#E5E5E5',
                                                color: 'black',
                                                cursor: 'pointer',
                                                fontSize: '25px',
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
