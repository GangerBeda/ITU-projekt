import React from "react";
import "./Square.css";

const Square = ({ value, onClick, isWinner, onMouseEnter, onMouseLeave, isBlind, isActive }) => {
    return (
        <div
            className={`square ${isWinner ? "won" : ""} ${isBlind ? "blind" : ""} ${!isActive ? "active" : ""}`}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {value}
        </div>
    );
};

export default Square;