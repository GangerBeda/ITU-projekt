import React from "react";
import Square from "./Square";
import "./ClassicBoard.css";

const ClassicBoard = ({ board, onSquareClick }) => (
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