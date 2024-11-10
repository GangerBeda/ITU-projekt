import React from "react";
import Square from "./Square";
import "./SubBoard.css";

const SubBoard = ({ board, isActive, winner, onSquareClick, onHoverSquare, hoveredSquare }) => {
    const renderSquare = (i) => (
        <Square
            value={board[i]}
            onClick={() => isActive && !winner && onSquareClick(i)}
            onMouseEnter={() => onHoverSquare(i)}
            onMouseLeave={() => onHoverSquare(null)} 
            isWinner={!!winner}
        />
    );

    return (
        <div className={`sub-board ${winner ? "won" : ""} ${isActive ? "active" : ""} ${hoveredSquare ? "highlight" : ""}`}>
            <div className="board-row">
                {renderSquare(0)} {renderSquare(3)} {renderSquare(6)}
            </div>
            <div className="board-row">
                {renderSquare(1)} {renderSquare(4)} {renderSquare(7)}
            </div>
            <div className="board-row">
                {renderSquare(2)} {renderSquare(5)} {renderSquare(8)}
            </div>
            {winner && <div className="sub-board-winner">{winner}</div>}
        </div>
    );
};

export default SubBoard;