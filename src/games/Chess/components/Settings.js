import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Settings = ({ navigate }) => {
    const [settings, setSettings] = useState({
        gameMode: 'timed',
        timeLimit: 5,
        controlType: 'click',
        notation: 'compact'
    });

    const [notification, setNotification] = useState({
        type: "",
        message: ""
    });
    const timeoutRef = useRef(null);

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

    useEffect(() => {
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
            showNotification('success', 'Settings saved successfully');
        } catch (error) {
            showNotification("error", "Failed to save settings.");
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
                        backgroundSize: '45px 45px',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center'
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
                        width: '525px',
                        marginBottom: '15rem',
                    }}>
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            width: '100%',
                            padding: '30px',
                            boxShadow: '0 3px 6px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{
                                backgroundColor: '#3B52E4',
                                margin: '-30px -30px 30px -30px',
                                padding: '22px 30px',
                                borderRadius: '12px 12px 0 0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px'
                            }}>
                                <span style={{
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '24px',
                                    fontWeight: 'bold'
                                }} onClick={goBack}>
                                    ←
                                </span>
                                <h2 style={{
                                    color: 'white',
                                    margin: 0,
                                    fontSize: '24px',
                                    fontWeight: 'bold'
                                }}>
                                    Settings
                                </h2>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}> { }
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '12px',
                                        fontSize: '21px',
                                        fontWeight: 'bold'
                                    }}>
                                        Game Mode
                                    </label>
                                    <div style={{ display: 'flex', gap: '12px' }}> { }
                                        <button
                                            onClick={() => handleSettingChange('gameMode', 'untimed')}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                backgroundColor: settings.gameMode === 'untimed' ? '#3B52E4' : '#E5E5E5',
                                                color: settings.gameMode === 'untimed' ? 'white' : '#000',
                                                cursor: 'pointer',
                                                fontSize: '21px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Without Timer
                                        </button>
                                        <button
                                            onClick={() => handleSettingChange('gameMode', 'timed')}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                backgroundColor: settings.gameMode === 'timed' ? '#3B52E4' : '#E5E5E5',
                                                color: settings.gameMode === 'timed' ? 'white' : '#000',
                                                cursor: 'pointer',
                                                fontSize: '21px',
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
                                            marginBottom: '12px',
                                            fontSize: '21px',
                                            fontWeight: 'bold'
                                        }}>
                                            Time Control
                                        </label>
                                        <div style={{ display: 'flex', gap: '12px' }}> { }
                                            {[5, 10, 15].map(time => (
                                                <button
                                                    key={time}
                                                    onClick={() => handleSettingChange('timeLimit', time)}
                                                    style={{
                                                        flex: 1,
                                                        padding: '12px',
                                                        borderRadius: '6px',
                                                        border: 'none',
                                                        backgroundColor: settings.timeLimit === time ? '#3B52E4' : '#E5E5E5',
                                                        color: settings.timeLimit === time ? 'white' : '#000',
                                                        cursor: 'pointer',
                                                        fontSize: '21px',
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
                                        marginBottom: '12px',
                                        fontSize: '21px',
                                        fontWeight: 'bold'
                                    }}>
                                        Control Type
                                    </label>
                                    <div style={{ display: 'flex', gap: '12px' }}> { }
                                        <button
                                            onClick={() => handleSettingChange('controlType', 'click')}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                backgroundColor: settings.controlType === 'click' ? '#3B52E4' : '#E5E5E5',
                                                color: settings.controlType === 'click' ? 'white' : '#000',
                                                cursor: 'pointer',
                                                fontSize: '21px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Click
                                        </button>
                                        <button
                                            onClick={() => handleSettingChange('controlType', 'drag')}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                backgroundColor: settings.controlType === 'drag' ? '#3B52E4' : '#E5E5E5',
                                                color: settings.controlType === 'drag' ? 'white' : '#000',
                                                cursor: 'pointer',
                                                fontSize: '21px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Drag & Drop
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '12px',
                                        fontSize: '21px',
                                        fontWeight: 'bold'
                                    }}>
                                        Notation
                                    </label>
                                    <div style={{ display: 'flex', gap: '12px' }}> { }
                                        <button
                                            onClick={() => handleSettingChange('notation', 'compact')}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                backgroundColor: settings.notation === 'compact' ? '#3B52E4' : '#E5E5E5',
                                                color: settings.notation === 'compact' ? 'white' : '#000',
                                                cursor: 'pointer',
                                                fontSize: '21px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Compact Mode
                                        </button>
                                        <button
                                            onClick={() => handleSettingChange('notation', 'detailed')}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                backgroundColor: settings.notation === 'detailed' ? '#3B52E4' : '#E5E5E5',
                                                color: settings.notation === 'detailed' ? 'white' : '#000',
                                                cursor: 'pointer',
                                                fontSize: '21px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Detailed Mode
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={saveSettings}
                                    style={{
                                        width: '100%',
                                        padding: '18px',
                                        backgroundColor: '#3B52E4',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '21px',
                                        fontWeight: 'bold',
                                        marginTop: '15px'
                                    }}
                                >
                                    Save Settings
                                </button>
                            </div>
                        </div>
                    </div>
                    {notification.message && (
                        <div
                            style={{
                                position: "absolute",
                                top: "10px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                padding: "10px 20px",
                                borderRadius: "8px",

                                zIndex: 9999,

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

                                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                                pointerEvents: "none", // Disable interaction with the notification

                            }}
                        >
                            {notification.message}
                        </div>
                    )}
                </div>
            </div>
        </DndProvider>
    );
};

export default Settings;