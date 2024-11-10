import React from 'react';
import './SettingsPopup.css';

function SettingsPopup({ onClose }) {
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <p>Jednotliva nastaveni</p>
                <button onClick={onClose}>Zavřít</button>
            </div>
        </div>
    );
}

export default SettingsPopup;
