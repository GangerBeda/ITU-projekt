/*********************************************************
 * Autor: Martin Bureš <xbures38>
*  Project: Games Hub
 * Game: 4 in a Row
 *********************************************************/
import React from 'react';
import Switch from 'react-switch';
import './Styles/Globalstyles.css';
import './Styles/Boardstyles.css';
import './Styles/Buttonstyles.css';
import './Styles/GameInfostyles.css';
import './Styles/Timer.css';


function FourInARowView({
    goToMainMenu,            // návrat na hlavní obrazovku
    toggleSettings,          // zobrazení/zavření nastavení
    toggleTimeLimitPopup,    // zobrazení/zavření nastavení časového limitu
    timerToggle,             // zapnutí/vypnutí časovače
    gameState,              
    makeMove,                // provedení tahu
    resetGame,               // restartování hry, začátek nové hry
    undo,                    // vrácení posledního tahu
    showNewGameButton,       // boolean zobrazit tlačítko "Začít novou hru"
    timerMessage,            // Zpráva zobrazující zbývající čas na tah

}) {
    return (
        <div className="site4">

            {/* Home Button */}
        <button className="button4 goToMainMenu4" onClick={goToMainMenu}></button>
    
            {/* kontejner s tlačítkami vpravo nahoře ve sloupci */}
            <div className="buttons-container-grid4">
    
                {/* Hover s pravidly hry */}
                <button className="button4 rulesButton4">
                    <div className="rules-hover"> 
                        <h4>Pravidla hry</h4>
                        <ul4>
                            <li><strong>Cíl hry:</strong> Spojte čtyři kameny v řadě (horizontálně, vertikálně nebo diagonálně).</li>
                            <li><strong>Začátek hry:</strong> Červený hráč začíná, hráči se střídají po tahu.</li>
                            <li><strong>Tah:</strong> Klikněte na sloupec, kámen spadne na nejnižší volné místo.</li>
                            <li><strong>Konec hry:</strong> Hra končí spojením čtyř kamenů nebo plnou deskou.</li>
                            <li><strong>Vrácení tahu a reset:</strong> Použijte tlačítka pod deskou.</li>
                            <li><strong>Hra na čas:</strong> Aktivujte časovač s limitem pro tah. Nestihnutí tahu znamená prohru. Čas lze nastavit.</li>
                        </ul4>

                    </div>
                </button>
    
    
                {/* Timer Button */}
                <button className="button4 timerButton4" onClick={toggleTimeLimitPopup}></button>
    
                {/* Toggle */}
                <Switch className="button4 switch4"
                    onChange={timerToggle}
                    checked={gameState.TimerOnVypZap}
                    uncheckedIcon={false}
                    checkedIcon={false}
                />
            </div>

            {/* Timer Container */}
            <div className="timer-container4">
                <div className={`timer4 ${gameState.TimerOn ? 'timer-visible4' : ''}`}>
                    {gameState.TimerOn && timerMessage}
                </div>
            </div>

            <div className="mid4">

                {/* Game Board */}
                <div className="Board">
                    {gameState.board.map((row, rowIndex) => (
                        <div key={rowIndex} className="board-row">
                            {row.map((cell, colIndex) => (
                                <div
                                    key={colIndex}
                                    className={`board-cell ${cell || ''}`} // Přidání CSS třídy podle stavu buňky (červená/žlutá/prázdná)
                                    onClick={() => makeMove(colIndex)}
                                >
                                    {cell && <div className={`piece ${cell}`}></div>}
                                </div>
                            ))}
                        </div>
                    ))}

                    {/* Board Buttons */}
                    <div className="buttons-container-board4">
                        <button className="button4 resetButton4" onClick={resetGame}></button>
                        <button className="button4 undoButton4" onClick={undo}></button>
                    </div>
                </div>

                {/* Game Info */}
                <div className="game-info-container4">
                    <span className="game-info4">
                        <span className={`player-colour ${gameState.turnColour}`}>
                            {gameState.highlightedPlayer}
                        </span>
                        {` ${gameState.message}`}
                    </span>
                </div>
            </div>

            {/* New Game Button */}
            <div className="new-game-container4">
                {showNewGameButton && (
                    <button
                        className="new-gameButton4"
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