import React from 'react';
import './FourInARowView.css';

function FourInARowView({ gameState, remainingTime, makeMove, startNewGame, resetGame, undo, setTimeLimit }) {
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

            <button onClick={resetGame}>Reset</button>
            <button onClick={undo}>Undo</button>
            <button onClick={setTimeLimit}>Nastavit čas</button> {/* Tlačítko pro nastavení času */}

            <div className="game-info">
                <p dangerouslySetInnerHTML={{__html: gameState.message}}></p>
                <p>Zbývající čas na tah: {remainingTime !== null ? `${remainingTime} sekund` : 'Není nastaven'}</p>
                {gameState.winner && <button onClick={startNewGame}>Nová hra</button>}
            </div>
        </div>
    );
}

export default FourInARowView;
