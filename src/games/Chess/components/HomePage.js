import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ navigate, rootNavigate }) => {
    const startNewGame = () => {
        navigate('/play', { state: { isNew: true }});
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
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    zIndex: 10,
                    width: '150px',  // 1.5x the original width
                    height: '90px', // 1.5x the original height
                    fontSize: '30px' // 1.5x the original font size
                }}
            >
                Home
            </button>
    
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
                className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
            >
                <h1 style={{ fontSize: '4rem' }} className="mb-8">Chess</h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* New Game Button */}
                    <button 
                        onClick={startNewGame} 
                        className="btn-primary" 
                        style={{ 
                            fontSize: '30px',  
                            width: '300px',
                            height: '90px', 
                            backgroundColor: 'blue', 
                            color: 'white', 
                            textAlign: 'center',
                            wordWrap: 'break-word', // Makes sure text breaks into two lines if needed
                            whiteSpace: 'normal'    // Allow wrapping
                        }}>
                        New Game
                    </button>
    
                    {/* Load Game Button */}
                    <button 
                        onClick={loadGame} 
                        className="btn-secondary" 
                        style={{ 
                            fontSize: '30px',  // 1.5x the original font size
                            width: '300px',  // 1.5x the original width
                            height: '90px',  // 1.5x the original height
                            backgroundColor: 'white', 
                            color: 'black',
                            textAlign: 'center',
                            wordWrap: 'break-word', // Allows text to break into two lines
                            whiteSpace: 'normal'    // Allow wrapping
                        }}>
                        Load Game
                    </button>
    
                    {/* Settings Button */}
                    <button 
                        onClick={goToSettings} 
                        className="btn-secondary" 
                        style={{ 
                            fontSize: '30px',  // 1.5x the original font size
                            width: '300px',  // 1.5x the original width
                            height: '90px',  // 1.5x the original height
                            backgroundColor: 'white', 
                            color: 'black',
                            textAlign: 'center',
                            wordWrap: 'break-word', // Allows text to break into two lines
                            whiteSpace: 'normal'    // Allow wrapping
                        }}>
                        Settings
                    </button>
                </div>
            </div>
        </div>
    </DndProvider>
    );
};

export default HomePage;