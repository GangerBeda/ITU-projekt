/* author: Martin Vrablec
* component for correct rendering of subbboards in Ultimate Tic Tac Toe and their squares
*/

import React from "react";
import Square from "./Square";
import "./SubBoard.css";

// sub-board component for main board in Ultimete Tic Tac Toe
const SubBoard = ({ board, isActive, winner, onSquareClick, onHoverSquare, hoveredSquare, blindModeActive }) => (

    // sets styles based on pased information 
    // renders squares based on pased information
    <div className={`sub-board ${winner ? "won" : ""} 
                                ${isActive ? "active" : ""} 
                                ${!winner && hoveredSquare ? "highlight" : ""}`}>
        {board.map((value, i) => (
            <Square
                key={i}
                value={value}
                onClick={() => isActive && !winner && onSquareClick(i)}
                onMouseEnter={() => onHoverSquare(i)}
                onMouseLeave={() => onHoverSquare(null)}
                isWinner={winner}
                isBlind={blindModeActive && !isActive}
                isActive={isActive}
            />
        ))}
        {winner && <div className="sub-board-winner">{winner}</div>}
    </div>
);

export default SubBoard;