import React from 'react';

import './Styles/Globalstyles.css';
import './Styles/Boardstyles.css';
import './Styles/Buttonstyles.css';
import './Styles/GameInfostyles.css';
import './Styles/Timer.css';
//TODO TIMR VLOGU I KDYZ UZ JE OZNAMENY VYSLEDEK
//TODO lepsi timer setting
//TODOtoggle button hezci
//TODO settings
//horni iknoy pr ipulce

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
    goToMainMenu,
    timerToggle,
    timerMessage }) {

console.log("VIEW FourInARowView:", { gameState, setTimeLimit }); //toto je tam 2x bcs vyvojovy rezim
console.log(gameState.turnColour);
console.log(gameState.highlightedPlayer);
console.log(gameState.remainingTime);
console.log("thisok VIEW TimerOn",gameState.TimerOn);
console.log("thisok VIEW TimerOnVypZap ",gameState.TimerOnVypZap);

    return (
        <div className="site">

                {/* home button */}
                <button className="button goToMainMenu" onClick={goToMainMenu}></button>

                {/* Kontejner pro tlačítka pro časovač, nastavení */}
                <div className="buttons-container-top">

                        <button className="button timerButton" onClick={setTimeLimit}></button>

                        <button className="button settings" onClick={toggleSettings}></button>
                                        {/* timer toggle */}
                    
                        <button className="toggleTimer" onClick={timerToggle}>timerToggle</button>
                    
                </div>

                

                <div className="timer-container">
                    <div className={`timer ${gameState.TimerOn ? 'timer-visible' : ''}`}>
                        {gameState.TimerOn && timerMessage}
                    </div>
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
                <div className="game-info-container">
                    <span className="game-info">
                        <span className={`player-colour ${gameState.turnColour}`}>
                            {gameState.highlightedPlayer}
                        </span>
                        {` ${gameState.message}`}
                    </span>
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
