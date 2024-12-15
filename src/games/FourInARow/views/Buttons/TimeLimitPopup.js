import React, { useState } from 'react';
import './Modal.css';

// Funkce pro generování možností výběru času
const generateOptions = (limit) =>
    Array.from({ length: limit + 1 }, (_, i) => (
        <option key={i} value={i.toString().padStart(2, '0')}>
            {i.toString().padStart(2, '0')}
        </option>
    ));

function TimeLimitPopup({ onClose, onSetTimeLimit }) {
    const [seconds, setSeconds] = useState("15");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = () => {
        const totalSeconds = Number(seconds);

        if (totalSeconds > 0 && totalSeconds <= 100) {
            onSetTimeLimit(totalSeconds); // Zavolá z FourInARowController
            onClose();
        } else {
            setErrorMessage("Zadejte platný čas od 1 do 100!");
        }
    };

    return (
        <div className="popup-overlay">

            <div className="popup-content">

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
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <button onClick={handleSubmit}>Nastavit</button>

            </div>

        </div>
    );
}

export default TimeLimitPopup;
