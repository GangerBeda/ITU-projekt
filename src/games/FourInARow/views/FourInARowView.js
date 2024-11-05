// FourInARowView.js
import React from 'react';
import './FourInARowView.css';


function FourInARowView({ gameState, makeMove }) {
    const handleColumnClick = (colIndex) => {
        makeMove(colIndex);
    };

    return (
        <div className="four-in-a-row-board">
            {gameState.board.map((row, rowIndex) => (
                <div key={rowIndex} className="board-row">
                    {row.map((cell, colIndex) => (
                        <div
                            key={colIndex}
                            className={`board-cell ${cell || ''}`}
                            onClick={() => handleColumnClick(colIndex)}
                        >
                            {cell && <div className={`piece ${cell}`}></div>}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default FourInARowView;
