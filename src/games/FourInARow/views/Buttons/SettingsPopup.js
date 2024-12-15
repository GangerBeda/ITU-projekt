import React from 'react';
import './Modal.css';

function SettingsPopup({ onClose }) {
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Nastavení hry</h2>
                <p>Zde by se mohly zobrazit různé možnosti nastavení...</p>
            </div>
        </div>
    );
}

export default SettingsPopup;
