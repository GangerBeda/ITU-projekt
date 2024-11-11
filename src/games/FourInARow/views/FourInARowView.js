import React from 'react';
import './FourInARowView.css';
import SettingsPopup from './Buttons/SettingsPopup';
function FourInARowView({ gameState, makeMove, startNewGame, resetGame, undo, setTimeLimit, goToMainMenu, showSettings, toggleSettings }) {

    return (
        <div style={{ position: 'relative' }}>
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

            <button onClick={goToMainMenu} className="menu-icon"></button>

            <button onClick={toggleSettings} className="settings-button">Nastavení</button>
            {showSettings && (
                <SettingsPopup onClose={toggleSettings} />
            )}

            <button onClick={resetGame}>Reset</button>
            <button onClick={setTimeLimit}>Nastavit čas</button>
            <button onClick={undo}>Undo</button>

            <div className="game-info">
                <p>{gameState.currentPlayer && `Hráč ${gameState.currentPlayer} je na tahu`}</p>
                <p>Zbývající čas na tah: {gameState.timeLimit !== null ? `${gameState.timeLimit} sekund` : 'Není nastaven'}</p>
            </div>

            {gameState.winner && <button onClick={startNewGame}>Nová hra</button>}
        </div>
    );
}

export default FourInARowView;
