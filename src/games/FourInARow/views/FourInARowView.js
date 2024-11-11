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

// const numbers = [1, 2, 3, 4, 5];
// const listItems = numbers.map((number, index) => (
//   <li key={index}>{number}</li> // Používáme 'index' pro klíč a 'number' pro hodnotu
// ));
// priradi se index kazdemu pvku z pole numbers
// number je nazev aktualne prochazeneho prvku pole,je to hodnota na aktualni pozici v poli a  používáme ji pro práci v každé iteraci
// a používáme ji pro práci v každé iteraci
// index je pozice aktuálního prvku v poli je nazev ktery slouzi k prideleni ID a praci s timto konkretnim prvekme pole mimo tuto iteraci
// key={rowIndex} je dynamický atribut, který React používá pro optimalizaci renderování seznamu. upravuje pouze DOM

//className={board-cell ${cell || ''}}
// k board-cell prida 
// if(cell !=null)
// {pripoji k boarda-cell}
// else(){
// priradi prazdnou
// }

