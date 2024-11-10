import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Settings = ({ navigate }) => {
    const [settings, setSettings] = useState({
        gameMode: 'timed',
        timeLimit: 5,
        controlType: 'click'
    });

    useEffect(() => {
        // Load existing settings if available
        const savedSettings = localStorage.getItem('chessSettings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setSettings(parsed);
            } catch (error) {
            }
        }
    }, []);

    const saveSettings = () => {
        try {
            localStorage.setItem('chessSettings', JSON.stringify(settings));
            alert('Settings saved successfully');
            navigate('/', { state: { settings } });
        } catch (error) {
        }
    };

    const handleSettingChange = (key, value) => {
        setSettings(prev => {
            const newSettings = { ...prev, [key]: value };
            return newSettings;
        });
    };

    const goBack = () => {
        navigate('/');
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

                <div style={{
                    backgroundColor: '#D3D3D3',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '3rem',
                }}>
                    <div style={{
                        backgroundColor: '#E5E5E5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '525px', // Scaled from 350px
                        marginBottom: '15rem', // Scaled from 10rem
                    }}>
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '12px', // Scaled from 8px
                            width: '100%',
                            padding: '30px', // Scaled from 20px
                            boxShadow: '0 3px 6px rgba(0,0,0,0.1)' // Slightly adjusted for scale
                        }}>
                            <div style={{
                                backgroundColor: '#3B52E4',
                                margin: '-30px -30px 30px -30px', // Scaled from -20px -20px 20px -20px
                                padding: '22px 30px', // Scaled from 15px 20px
                                borderRadius: '12px 12px 0 0', // Scaled from 8px
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px' // Scaled from 10px
                            }}>
                                <span style={{
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '24px', // Scaled and made bold
                                    fontWeight: 'bold'
                                }} onClick={goBack}>
                                    ←
                                </span>
                                <h2 style={{
                                    color: 'white',
                                    margin: 0,
                                    fontSize: '24px', // Scaled from 16px
                                    fontWeight: 'bold'
                                }}>
                                    Settings
                                </h2>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}> {/* Scaled from 20px */}
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '12px', // Scaled from 8px
                                        fontSize: '21px', // Scaled from 14px
                                        fontWeight: 'bold'
                                    }}>
                                        Game Mode
                                    </label>
                                    <div style={{ display: 'flex', gap: '12px' }}> {/* Scaled from 8px */}
                                        <button
                                            onClick={() => handleSettingChange('gameMode', 'untimed')}
                                            style={{
                                                flex: 1,
                                                padding: '12px', // Scaled from 8px
                                                borderRadius: '6px', // Scaled from 4px
                                                border: 'none',
                                                backgroundColor: settings.gameMode === 'untimed' ? '#3B52E4' : '#E5E5E5',
                                                color: settings.gameMode === 'untimed' ? 'white' : '#000',
                                                cursor: 'pointer',
                                                fontSize: '21px', // Scaled from 14px
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Without Timer
                                        </button>
                                        <button
                                            onClick={() => handleSettingChange('gameMode', 'timed')}
                                            style={{
                                                flex: 1,
                                                padding: '12px', // Scaled from 8px
                                                borderRadius: '6px', // Scaled from 4px
                                                border: 'none',
                                                backgroundColor: settings.gameMode === 'timed' ? '#3B52E4' : '#E5E5E5',
                                                color: settings.gameMode === 'timed' ? 'white' : '#000',
                                                cursor: 'pointer',
                                                fontSize: '21px', // Scaled from 14px
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            With Timer
                                        </button>
                                    </div>
                                </div>

                                {settings.gameMode === 'timed' && (
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '12px', // Scaled from 8px
                                            fontSize: '21px', // Scaled from 14px
                                            fontWeight: 'bold'
                                        }}>
                                            Time Control
                                        </label>
                                        <div style={{ display: 'flex', gap: '12px' }}> {/* Scaled from 8px */}
                                            {[5, 10, 15].map(time => (
                                                <button
                                                    key={time}
                                                    onClick={() => handleSettingChange('timeLimit', time)}
                                                    style={{
                                                        flex: 1,
                                                        padding: '12px', // Scaled from 8px
                                                        borderRadius: '6px', // Scaled from 4px
                                                        border: 'none',
                                                        backgroundColor: settings.timeLimit === time ? '#3B52E4' : '#E5E5E5',
                                                        color: settings.timeLimit === time ? 'white' : '#000',
                                                        cursor: 'pointer',
                                                        fontSize: '21px', // Scaled from 14px
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {time} min
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '12px', // Scaled from 8px
                                        fontSize: '21px', // Scaled from 14px
                                        fontWeight: 'bold'
                                    }}>
                                        Control Type
                                    </label>
                                    <div style={{ display: 'flex', gap: '12px' }}> {/* Scaled from 8px */}
                                        <button
                                            onClick={() => handleSettingChange('controlType', 'click')}
                                            style={{
                                                flex: 1,
                                                padding: '12px', // Scaled from 8px
                                                borderRadius: '6px', // Scaled from 4px
                                                border: 'none',
                                                backgroundColor: settings.controlType === 'click' ? '#3B52E4' : '#E5E5E5',
                                                color: settings.controlType === 'click' ? 'white' : '#000',
                                                cursor: 'pointer',
                                                fontSize: '21px', // Scaled from 14px
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Click
                                        </button>
                                        <button
                                            onClick={() => handleSettingChange('controlType', 'drag')}
                                            style={{
                                                flex: 1,
                                                padding: '12px', // Scaled from 8px
                                                borderRadius: '6px', // Scaled from 4px
                                                border: 'none',
                                                backgroundColor: settings.controlType === 'drag' ? '#3B52E4' : '#E5E5E5',
                                                color: settings.controlType === 'drag' ? 'white' : '#000',
                                                cursor: 'pointer',
                                                fontSize: '21px', // Scaled from 14px
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Drag & Drop
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={saveSettings}
                                    style={{
                                        width: '100%',
                                        padding: '18px', // Scaled from 12px
                                        backgroundColor: '#3B52E4',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px', // Scaled from 4px
                                        cursor: 'pointer',
                                        fontSize: '21px', // Scaled from 14px
                                        fontWeight: 'bold',
                                        marginTop: '15px' // Scaled from 10px
                                    }}
                                >
                                    Save Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};

export default Settings;