import React from "react";
import "./Square.css";

const Square = ({ value, onClick, isWinner, onMouseEnter, onMouseLeave }) => {
    return (
        <button
            className={`square ${isWinner ? "won" : ""}`}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {value}
        </button>
    );
};

export default Square;