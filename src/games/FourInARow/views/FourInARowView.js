import React from 'react';
import './FourInARowView.css';

function FourInARowView({ gameState, remainingTime, makeMove, startNewGame, resetGame, undo, setTimeLimit }) {

    console.log("GameState: ", gameState);
    console.log("Current Player: ", gameState.currentPlayer);
    console.log("Winner: ", gameState.winner);
    console.log("Time:", gameState.timeLimit);

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
                <p>{gameState.currentPlayer && `Hráč ${gameState.currentPlayer} je na tahu`}</p>
                <p>Zbývající čas na tah: {gameState.timeLimit !== null ? `${gameState.timeLimit} sekund` : 'Není nastaven'}</p>
            </div>

            {gameState.winner && <button onClick={startNewGame}>Nová hra</button>}

        </div>
    );
}

export default FourInARowView;



