import React from "react";
import "./ClassicTTTModeButton.css";

const ClassicTTTModeButton = ({ onClick }) => {
    return (
        <div className="classic-button" onClick={onClick}>
            Classic Tic Tac Toe
        </div>
    );
};

export default ClassicTTTModeButton;