import React from 'react';
import './Modal.css';

function SettingsPopup({ onClose }) {
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <p>Nastaveni barev</p>
                <p>Nastaveni velikosti</p>
                <button onClick={onClose}>Zavřít</button>
            </div>
        </div>
    );
}

export default SettingsPopup;
