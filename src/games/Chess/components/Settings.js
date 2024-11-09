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
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        zIndex: 10,
                        width: '150px',
                        height: '90px',
                        fontSize: '30px'
                    }}
                >
                    Home
                </button>

                <div style={{
                    backgroundColor: '#D3D3D3',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '2rem'
                }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Game Settings</h2>

                    <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Game Mode</label>
                            <select
                                value={settings.gameMode}
                                onChange={(e) => handleSettingChange('gameMode', e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                            >
                                <option value="untimed">Without Timer</option>
                                <option value="timed">With Timer</option>
                            </select>
                        </div>

                        {settings.gameMode === 'timed' && (
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Time Control</label>
                                <select
                                    value={settings.timeLimit}
                                    onChange={(e) => handleSettingChange('timeLimit', Number(e.target.value))}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                                >
                                    <option value={5}>5 minutes</option>
                                    <option value={10}>10 minutes</option>
                                    <option value={15}>15 minutes</option>
                                </select>
                            </div>
                        )}

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Control Type</label>
                            <select
                                value={settings.controlType}
                                onChange={(e) => handleSettingChange('controlType', e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                            >
                                <option value="click">Click to Move</option>
                                <option value="drag">Drag & Drop</option>
                            </select>
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '1rem'
                        }}>
                            <button
                                onClick={goBack}
                                className="btn-secondary"
                                style={{ padding: '0.5rem 1rem' }}
                            >
                                Go Back
                            </button>
                            <button
                                onClick={saveSettings}
                                className="btn-primary"
                                style={{ padding: '0.5rem 1rem' }}
                            >
                                Save Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};

export default Settings;