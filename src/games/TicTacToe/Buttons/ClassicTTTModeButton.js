import React from "react";
import "./MenuButtons.css";

const ClassicTTTModeButton = ({ onClick }) => {
    return (
        <div className="tic-tac-toe-menu-button" onClick={onClick}>
            Classic Tic Tac Toe
        </div>
    );
};

export default ClassicTTTModeButton;