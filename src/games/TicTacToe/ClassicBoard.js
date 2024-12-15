import React from "react";
import Square from "./Square";
import "./ClassicBoard.css";

// classic board for classsic tic-tac-toe
const ClassicBoard = ({ board, onSquareClick }) => (

    // renders squares based on parsed information
    <div className="classic-board">
        {board.map((value, index) => (
            <Square
                key={index}
                value={value}
                onClick={() => onSquareClick(index)}
                isActive={true}
            />
        ))}
    </div>
);

export default ClassicBoard;