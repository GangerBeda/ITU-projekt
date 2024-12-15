import React, { useState } from 'react';
import './Modal.css';

function TimeLimitPopup({ onClose, onSetTimeLimit }) {
    const [seconds, setSeconds] = useState("00");

    const handleSubmit = () => {
        const totalSeconds = Number(seconds);

        if (totalSeconds > 0 && totalSeconds <= 100) {
            onSetTimeLimit(totalSeconds); // Zavolá z FourInARowController
            onClose();
        } else {
            alert("Zadejte platný čas mezi 1 a 100 sekund!");
        }
    };

    const generateOptions = (limit) =>
        Array.from({ length: limit + 1 }, (_, i) => (
            <option key={i} value={i.toString().padStart(2, '0')}>
                {i.toString().padStart(2, '0')}
            </option>
        ));

    return (
        <div className="popup-overlay">
            <div className="popup-content" style={{ position: 'relative' }}>
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Nastavení časového limitu</h2>
                <div className="wheel-picker-container">
                    <select
                        className="time-picker"
                        value={seconds}
                        onChange={(e) => setSeconds(e.target.value)}
                    >
                        {generateOptions(100)}
                    </select>
                    <span> sekund</span>
                </div>
                <button onClick={handleSubmit}>Nastavit</button>
            </div>
        </div>
    );
}

export default TimeLimitPopup;
