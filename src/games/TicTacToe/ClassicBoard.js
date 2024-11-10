import React from "react";
import Square from "./Square";
import "./ClassicBoard.css";

const ClassicBoard = ({ board, isXNext, winner, onSquareClick }) => {
    return (
        <div className="classic-board">
            <div className="board-row">
                <Square value={board[0]} onClick={() => onSquareClick(0)} />
                <Square value={board[1]} onClick={() => onSquareClick(1)} />
                <Square value={board[2]} onClick={() => onSquareClick(2)} />
            </div>
            <div className="board-row">
                <Square value={board[3]} onClick={() => onSquareClick(3)} />
                <Square value={board[4]} onClick={() => onSquareClick(4)} />
                <Square value={board[5]} onClick={() => onSquareClick(5)} />
            </div>
            <div className="board-row">
                <Square value={board[6]} onClick={() => onSquareClick(6)} />
                <Square value={board[7]} onClick={() => onSquareClick(7)} />
                <Square value={board[8]} onClick={() => onSquareClick(8)} />
            </div>
            {winner && <div className="classic-winner">Winner: {winner}</div>}
        </div>
    );
};

export default ClassicBoard;
