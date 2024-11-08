// FourInARowView.js
import React from 'react';
import './FourInARowView.css';

function FourInARowView({ gameState, makeMove, startNewGame }) {
    return (
        <div>
            <div className="FourInARowView">
                <div className="four-in-a-row-board">
                    {gameState.board.map((row, rowIndex) => (
                        <div key={rowIndex} className="board-row">
                            {row.map((cell, colIndex) => (
                                <div
                                    key={colIndex}
                                    className={`board-cell ${cell || ''}`}
                                    onClick={() => makeMove(colIndex)}
                                >
                                    {cell && <div className={`piece ${cell}`}></div>}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <div className="game-info">
                <p dangerouslySetInnerHTML={{ __html: gameState.message }}></p>
                {gameState.winner && <button onClick={startNewGame}>Nová hra</button>}
            </div>
        </div>
    );
}

export default FourInARowView;
