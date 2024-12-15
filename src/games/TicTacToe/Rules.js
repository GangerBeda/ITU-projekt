import React from 'react';
import "./Rules.css";

const Rules = () => {
  return (
    <div className="tic-tac-toe-rules">
      <p>
        <strong>Rules of Ultimate Tic Tac Toe:</strong>
      </p>
      <ul>
        <li>
          <strong>Turns and Moves:</strong>
          Players take turns placing their marks (X or O) in an empty cell. The position of the move on the mini-board 
          determines which mini-board the next player must play in. For example, if you place your mark in the top-right 
          cell of a mini-board, the next player must play in the top-right mini-board.
        </li>
        <br/>

        <li>
          <strong>Forced Moves:</strong>
          If the required mini-board (based on the previous move) is already won or full, the next player may choose any 
          empty cell on any available mini-board.
        </li>
        <br/>

        <li>
          <strong>Winning a Mini-Board:</strong>
          A player wins a mini-board by placing 3 of their marks in a row (horizontally, vertically, or diagonally) 
          within that mini-board.
        </li>
        <br/>

        <li>
          <strong>Winning the Game:</strong>
          The overall game is won by claiming 3 mini-boards in a row (horizontally, vertically, or diagonally) on the larger 3x3 grid.
        </li>
        <br/>

        <li>
          <strong>Game End:</strong>
          The game ends when one player wins 3 mini-boards in a row, or when all mini-boards are full. If no player has 3 
          mini-boards in a row and the entire board is full, the game ends in a draw.
        </li>
      </ul>
    </div>
  );
};

export default Rules;