import React from 'react';
import Switch from 'react-switch';
import './Styles/Globalstyles.css';
import './Styles/Boardstyles.css';
import './Styles/Buttonstyles.css';
import './Styles/GameInfostyles.css';
import './Styles/Timer.css';


function FourInARowView({
    gameState,
    makeMove,
    resetGame,
    undo,
    toggleSettings,
    showNewGameButton,
    goToMainMenu,
    timerToggle,
    timerMessage,
    toggleTimeLimitPopup
}) {
    return (
        <div className="site">
            {/* Home Button */}
            <button className="button goToMainMenu" onClick={goToMainMenu}></button>

            {/* Grid pro Timer Toggle, Settings */}
            <div className="buttons-container-grid">

                {/* Settings Button */}
                <button className="button settings" onClick={toggleSettings}></button>

                {/* Timer Button */}
                <button className="button timerButton" onClick={toggleTimeLimitPopup}></button>

                {/* Toggle */}
                <div className="timer-toggle-container">
                <Switch className= "button switch"
                    onChange={timerToggle}
                    checked={gameState.TimerOnVypZap}
                    uncheckedIcon={false}
                    checkedIcon={false}
                />

                </div>

            </div>

            {/* Timer Container */}
            <div className="timer-container">
                <div className={`timer ${gameState.TimerOn ? 'timer-visible' : ''}`}>
                    {gameState.TimerOn && timerMessage}
                </div>
            </div>

            <div className="mid">
                {/* Game Board */}
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

                    {/* Board Buttons */}
                    <div className="buttons-container-board">
                        <button className="button resetButton" onClick={resetGame}></button>
                        <button className="button undoButton" onClick={undo}></button>
                    </div>
                </div>

                {/* Game Info */}
                <div className="game-info-container">
                    <span className="game-info">
                        <span className={`player-colour ${gameState.turnColour}`}>
                            {gameState.highlightedPlayer}
                        </span>
                        {` ${gameState.message}`}
                    </span>
                </div>
            </div>

            {/* New Game Button */}
            <div className="new-game-container">
                {showNewGameButton && (
                    <button
                        className="new-gameButton"
                        onClick={() => {
                            resetGame();
                        }}
                    >
                        Začít novou hru
                    </button>
                )}
            </div>
        </div>
    );
}

export default FourInARowView;

//--startnewgame