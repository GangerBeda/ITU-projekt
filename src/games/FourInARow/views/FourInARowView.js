import React from 'react';
import './FourInARowView.css';

function FourInARowView({
    gameState,
    remainingTime,
    makeMove,
    startNewGame,
    resetGame,
    undo,
    setTimeLimit,
    toggleSettings,
    showNewGameButton,
    goToMainMenu }) {

console.log("VIEW FourInARowView:", { gameState, setTimeLimit }); //toto je tam 2x bcs vyvojovy rezim


    return (
        <div className="site">
                {/* home button */}
                <button className="button goToMainMenu" onClick={goToMainMenu}></button>

                {/* Kontejner pro tlačítka pro časovač, nastavení */}
                <div className="buttons-container-top">
                        <button className="button timerButton" onClick={setTimeLimit}></button>
                        <button className="button settings" onClick={toggleSettings}></button>
                </div>

                    {/* hraci pole */}
                <div className="Board">
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


                         {/* Kontejner pro tlačítka desky */}
                        <div className="buttons-container-board">
                            <button className="button resetButton" onClick={resetGame}></button>
                            <button className="button undoButton" onClick={undo}></button>

                        </div>
                </div>


                {/* Informace o hře */}

                <div className={`gameInfo ${gameState.turnColour}`}>
                    <p>{gameState.message}</p>
                    <p>Zbývající čas na tah: {gameState.timeLimit !== null ? `${gameState.timeLimit} sekund` : 'Není nastaven'}</p>
                </div>




                 {/* Tlačítko pro novou hru */}
                {showNewGameButton && (
                <button className="button1" onClick={() => {
                            resetGame();
                            console.log("Tlačítko 'Nová hra' bylo kliknuto!");
                        }}
                    >Nová hra
                </button>
                )}

        </div>
    );
}
 
export default FourInARowView;
