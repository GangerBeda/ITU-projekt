/*
 * ITU Games Hub
 * @brief Settings component for configuring game preferences
 * @author Da Costa Menezes Kristián || xdacos01
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

/**
 * Settings Component
 * 
 * Allows users to configure game settings such as game mode (timed or untimed),
 * time control, control type (click or drag & drop), and notation style (compact or detailed).
 * Saves settings to localStorage and provides feedback notifications upon saving.
 * 
 * @param {Object} props - Component properties
 * @param {Function} props.navigate - Function to navigate between routes
 * @returns {JSX.Element} The rendered Settings component
 */
const Settings = ({ navigate }) => {
    // State to hold current settings
    const [settings, setSettings] = useState({
        gameMode: 'timed',
        timeLimit: 5,
        controlType: 'click',
        notation: 'compact'
    });

    // State to handle notification messages
    const [notification, setNotification] = useState({
        type: "",
        message: ""
    });

    // Reference to manage notification timeout
    const timeoutRef = useRef(null);

    /**
     * Displays a notification with the specified type and message.
     * Automatically hides the notification after 3 seconds.
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
     * Loads saved settings from localStorage when the component mounts.
     * If no saved settings are found, retains the default settings.
     */
    useEffect(() => {
        const savedSettings = localStorage.getItem('chessSettings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setSettings(parsed);
            } catch (error) {
                console.error('Error parsing saved settings:', error);
            }
        }
    }, []);

    /**
     * Saves the current settings to localStorage and displays a success notification.
     * If saving fails, displays an error notification.
     */
    const saveSettings = () => {
        try {
            localStorage.setItem('chessSettings', JSON.stringify(settings));
            showNotification('success', 'Settings saved successfully');
        } catch (error) {
            console.error('Error saving settings:', error);
            showNotification("error", "Failed to save settings.");
        }
    };

    /**
     * Updates a specific setting based on user interaction.
     * 
     * @param {string} key - The setting key to update (e.g., 'gameMode', 'timeLimit')
     * @param {any} value - The new value for the setting
     */
    const handleSettingChange = (key, value) => {
        setSettings(prev => {
            const newSettings = { ...prev, [key]: value };
            return newSettings;
        });
    };

    /**
     * Navigates back to the main menu.
     */
    const goBack = () => {
        navigate('/');
    };

    /**
     * Redirects the user to the root URL.
     */
    const goToRoot = () => {
        window.location.href = '/';
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div style={{
                position: 'relative',
                width: '100%'
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

                {/* Main Container */}
                <div style={{
                    backgroundColor: '#D3D3D3',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '3rem',
                }}>
                    {/* Settings Card */}
                    <div style={{
                        backgroundColor: '#E5E5E5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '525px',
                        marginBottom: '15rem',
                    }}>
                        {/* Card Content */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            width: '100%',
                            padding: '30px',
                            boxShadow: '0 3px 6px rgba(0,0,0,0.1)'
                        }}>
                            {/* Card Header */}
                            <div style={{
                                backgroundColor: '#3B52E4',
                                margin: '-30px -30px 30px -30px',
                                padding: '22px 30px',
                                borderRadius: '12px 12px 0 0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px'
                            }}>
                                {/* Back Arrow */}
                                <span style={{
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '24px',
                                    fontWeight: 'bold'
                                }} onClick={goBack}>
                                    ←
                                </span>
                                {/* Settings Title */}
                                <h2 style={{
                                    color: 'white',
                                    margin: 0,
                                    fontSize: '24px',
                                    fontWeight: 'bold'
                                }}>
                                    Settings
                                </h2>
                            </div>

                            {/* Settings Options */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                {/* Game Mode Selection */}
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '12px',
                                        fontSize: '21px',
                                        fontWeight: 'bold'
                                    }}>
                                        Game Mode
                                    </label>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        {/* Without Timer Button */}
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
                                        {/* With Timer Button */}
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

                                {/* Time Control Selection (Visible only if gameMode is 'timed') */}
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
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            {/* Time Limit Buttons */}
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

                                {/* Control Type Selection */}
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '12px',
                                        fontSize: '21px',
                                        fontWeight: 'bold'
                                    }}>
                                        Control Type
                                    </label>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        {/* Click Control Button */}
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
                                        {/* Drag & Drop Control Button */}
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

                                {/* Notation Style Selection */}
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '12px',
                                        fontSize: '21px',
                                        fontWeight: 'bold'
                                    }}>
                                        Notation
                                    </label>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        {/* Compact Mode Button */}
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
                                        {/* Detailed Mode Button */}
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

                                {/* Save Settings Button */}
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
                </div>
            </div>
        </DndProvider>
        );
    };

export default Settings;



