import React from "react";
import "./ChessView.css";

function ChessView({ gameState, controller, handleCellClick }) {

    const getPieceSymbol = (piece) => {
        switch (piece?.toLowerCase()) {
            case "p": return "♟";
            case "r": return "♜";
            case "n": return "♞";
            case "b": return "♝";
            case "q": return "♛";
            case "k": return "♚";
            default: return "";
        }
    };

    return (
        <div className="chess-container">
            <div className="chess-board">
                {gameState.board.map((row, rowIndex) => (
                    <div key={rowIndex} className="board-row">
                        {row.map((piece, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`board-cell ${
                                    (rowIndex + colIndex) % 2 === 0 ? "light" : "dark"
                                } ${
                                    gameState.selectedPiece &&
                                    gameState.selectedPiece[0] === rowIndex &&
                                    gameState.selectedPiece[1] === colIndex
                                    ? "selected"
                                    : ""
                                }`}
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                            >
                                <span className={`piece ${controller.getPieceColor(piece)}`}>
                                    {getPieceSymbol(piece)}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="game-info">
                <div className="current-player">
                    Current Player: {gameState.currentPlayer}
                </div>
                <div className="moves-history">
                    <h3>Moves History</h3>
                    <ul>
                        {gameState.movesHistory.map((move, index) => (
                            <li key={index}>
                                {index + 1}. {getPieceSymbol(move.piece)} {move.from} →{" "}
                                {move.to}
                                {move.captured && ` x ${getPieceSymbol(move.captured)}`}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ChessView;
