import React from 'react';
import './Styles/Globalstyles.css';
import './Styles/Boardstyles.css';
import './Styles/Buttonstyles.css';
import './Styles/GameInfostyles.css';


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
console.log(gameState.turnColour);
console.log(gameState.highlightedPlayer);

    return (
        <div className="site">
                {/* home button */}
                <button className="button goToMainMenu" onClick={goToMainMenu}></button>
            
                {/* Kontejner pro tlačítka pro časovač, nastavení */}
                <div className="buttons-container-top">
                        <button className="button timerButton" onClick={setTimeLimit}></button>
                        <button className="button settings" onClick={toggleSettings}></button>
                </div>
                    
            <div className="mid">        
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

                <div className={`game-Info`}>
                    <p>
                        <span className={`player-colour ${gameState.turnColour}`}>  
                            {gameState.highlightedPlayer}
                        </span>
                        {' '}{gameState.message}
                    </p>

                    <p>
                        Zbývající čas na tah: {gameState.timeLimit !== null ? `${gameState.timeLimit} sekund` : 'Není nastaven'}
                    </p>
                </div>
            </div>
                {/* Kontejner pro tlačítko Záčít novou hru */}
                <div className="new-game-container">
                    {showNewGameButton && (
                        <button
                            className="new-gameButton"
                            onClick={() => {
                                resetGame();
                                console.log("Tlačítko 'Záčít novou hru' bylo kliknuto!");
                            }}
                        >
                            Záčít novou hru
                        </button>
                    )}
                </div>
            


        </div>
    );
}
 
export default FourInARowView;
