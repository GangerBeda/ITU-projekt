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
        <div className="site">

            {/* Home Button */}
        <button className="button goToMainMenu" onClick={goToMainMenu}></button>
    
            {/* Sloučený grid pro všechna tlačítka */}
            <div className="buttons-container-grid">
    
                {/* Tlačítko s pravidly hry */}
                <button className="button rulesButton">
                    <div className="rules-hover"> 
                        <h1>Pravidla hry</h1>
                        <ul>
                            <li><strong>Cíl hry:</strong> Spojte čtyři kameny v řadě (horizontálně, vertikálně nebo diagonálně).</li>
                            <li><strong>Začátek hry:</strong> Červený hráč začíná, hráči se střídají po tahu.</li>
                            <li><strong>Tah:</strong> Klikněte na sloupec, kámen spadne na nejnižší volné místo.</li>
                            <li><strong>Konec hry:</strong> Hra končí spojením čtyř kamenů nebo plnou deskou.</li>
                            <li><strong>Vrácení tahu a reset:</strong> Použijte tlačítka pod deskou.</li>
                            <li><strong>Hra na čas:</strong> Aktivujte časovač s limitem pro tah. Nestihnutí tahu znamená prohru. Čas lze nastavit.</li>
                        </ul>

                    </div>
                </button>
    
    
                {/* Timer Button */}
                <button className="button timerButton" onClick={toggleTimeLimitPopup}></button>
    
                {/* Toggle */}
                <Switch className="button switch"
                    onChange={timerToggle}
                    checked={gameState.TimerOnVypZap}
                    uncheckedIcon={false}
                    checkedIcon={false}
                />
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
                                    className={`board-cell ${cell || ''}`} // Přidání CSS třídy podle stavu buňky (červená/žlutá/prázdná)
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