/* author: Martin Vrablec
*  component for rendering square in the game boards
*/

import React from "react";
import "./Square.css";

// suare component used to display the game board
const Square = ({ value, onClick, isWinner, onMouseEnter, onMouseLeave, isBlind, isActive }) => {
    // sets styles based on parsed information 
    //dispalys the value of the square ( O or X)
    return (
        <div
            className={`square ${isWinner ? "won" : ""} 
                                ${isBlind ? "blind" : ""} 
                                ${!isActive ? "active" : ""}`}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {value}
        </div>
    );
};

export default Square;