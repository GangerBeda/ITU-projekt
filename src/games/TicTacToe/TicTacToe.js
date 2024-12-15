/* author: Martin Vrablec
*  main component of the TicTacToe game
* contains main functions and state for correct game rendering and working
*/

import React, { useState, useEffect } from "react";
import MainBoard from "./MainBoard";
import ClassicBoard from "./ClassicBoard"; 
import { createClassicGame, makeClassicMove, createUltimateGame, makeUltimateMove, getScore, setScore } from "./api";
import RestartButton from "./Buttons/RestartButton";
import BlindModeButton from "./Buttons/BlindModeButton";
import ResetScoreButton from "./Buttons/ResetScoreButton";
import HomeButton from "./Buttons/HomeButton";
import InfoButton from "./Buttons/InfoButton";
import Rules from "./Rules";
import "./TicTacToe.css";

const TicTacToe = () => {

  // state for game modes 
  const [isClassicMode, setIsClassicMode] = useState(false);

  // states used for classic game
  const [classicBoard, setClassicBoard] = useState([]);
  const [classicIsXNext, setClassicIsXNext] = useState(null);
  const [classicWinner, setClassicWinner] = useState(null);

  // states used for ultimate game
  const [subBoards, setSubBoards] = useState([]);
  const [mainBoard, setMainBoard] = useState([]);
  const [activeSubBoard, setActiveSubBoard] = useState(null);
  const [ultimateWinner, setUltimateWinner] = useState(null);

  // misc states
  const [isXNext, setIsXNext] = useState(null);
  const [blindMode, setBlindMode] = useState(null);
  const [showRules, setShowRules] = useState(false);

  // state used for score
  const [score, setScoreState] = useState([]);

  // change game mode
  // if classic mode is selected and classic game wasnt already started start it
  const toggleGameMode = () => {
    setIsClassicMode(!isClassicMode);
    if (classicIsXNext == null) {
      startClassicGame();
    }
  };

  // make request to server to turn on blind mode
  const toggleBlindMode = async () => {
    const gameUpdate = await makeUltimateMove(null, null, blindMode);
    setBlindMode(gameUpdate.blindMode);
  };

  // make request to server to reset score (setting them both to 0)
  const resetScore = () => {
    updateScore("X", 0);
    updateScore("O", 0);
  };

  // make request to server to restart the game (calling new game)
  const restartGame = () => {
    if (isClassicMode) {
      startClassicGame();
    } else {
      startUltimateGame();
    }
  };
  // make request to server to create a new classic game
  const startClassicGame = async () => {
    const game = await createClassicGame();
    setClassicBoard(game.board);
    setClassicIsXNext(game.isXNext);
    setClassicWinner(game.winner);
  };
  // mkae request to server to make a move in classic game, validates it, cheks for winner and updates the board
  // backend increments score if winner is found so fetch score if there is winner
  const makeClassicMoveClick = async (cellIndex) => {
    const gameUpdate = await makeClassicMove(cellIndex);
    if(classicWinner) return;
    setClassicBoard(gameUpdate.board);
    setClassicIsXNext(gameUpdate.isXNext);
    setClassicWinner(gameUpdate.winner);
    if(gameUpdate.winner) {
      fetchScore();
    }
  };
  // make request to server to create a new ultimate game
  const startUltimateGame = async () => {
    const game = await createUltimateGame();
    setSubBoards(game.subBoards);
    setMainBoard(game.mainBoard);
    setIsXNext(game.isXNext);
    setUltimateWinner(game.winner);
    setActiveSubBoard(game.activeSubBoard);
    setBlindMode(game.blindMode);
  };
  // make request to server to make a move in ultimate game, validates it, cheks for winner and updates the board
  // backend increments score if winner is found so fetch score if there is winner
  const makeUltimateMoveClick = async (subBoardIndex, cellIndex) => {
    const gameUpdate = await makeUltimateMove(subBoardIndex, cellIndex, null);
    if(ultimateWinner) return;
    setSubBoards(gameUpdate.subBoards);
    setMainBoard(gameUpdate.mainBoard);
    setIsXNext(gameUpdate.isXNext);
    setActiveSubBoard(gameUpdate.activeSubBoard);
    setBlindMode(gameUpdate.blindMode);
    setUltimateWinner(gameUpdate.winner);
    if(gameUpdate.winner) {
      fetchScore();
    }
  };
  // make request to server to fetch score and update it 
  const fetchScore = async () => {
    const currentScore = await getScore();
    setScoreState(currentScore);
  };
  // just toggles the visibility of the rules
  const toggleRulesVisibility = () => {
    setShowRules((prevShowRules) => !prevShowRules);
  };
  // make request to server to update score used for resetting score
  const updateScore = async (player, wins) => {
    const updatedScore = await setScore(player, wins);
    setScoreState(updatedScore);
  };
  // called on first render to fetch score and start ultimate game
  useEffect(() => {
    fetchScore();
    startUltimateGame();
  }, []);

  // render the main page of the game
  // show correct information on current states
  return (
    <div className="tic-tac-toe">
      <div className="tic-tac-toe-header">
        <HomeButton />
        <span
          className={!isClassicMode ? "active" : ""}
          onClick={() => toggleGameMode(false)}
        >
          Ultimate TicTacToe
        </span>
        <span
          className={isClassicMode ? "active" : ""}
          onClick={() => toggleGameMode(true)}
        >
          Classic TicTacToe
        </span>
      </div>
      {!isClassicMode && (
        <p className="tic-tac-toe-is-next">{isXNext ? "X" : "O"} Is on move</p>
      )}
      {isClassicMode && (
        <p className="tic-tac-toe-is-next">
          {classicIsXNext ? "X" : "O"} Is on move
        </p>
      )}
      <div className="tic-tac-toe-main">
        <div className="tic-tac-toe-filler">
          {showRules && !isClassicMode && <Rules />}
        </div>

        {classicWinner && isClassicMode && (
          <div className="tic-tac-toe-winner">
            Winner: {classicWinner}
            <RestartButton onClick={restartGame} />
          </div>
        )}

        {ultimateWinner && !isClassicMode && (
          <div className="tic-tac-toe-winner">
            Winner: {ultimateWinner}
            <RestartButton onClick={restartGame} />
          </div>
        )}

        <div className="tic-tac-toe-board">
          {isClassicMode ? (
            <ClassicBoard
              board={classicBoard}
              isXNext={classicIsXNext}
              onSquareClick={makeClassicMoveClick}
            />
          ) : (
            <MainBoard
              subBoards={subBoards}
              mainBoard={mainBoard}
              onSquareClick={makeUltimateMoveClick}
              activeSubBoard={activeSubBoard}
              blindModeActive={blindMode}
              isUltimateWinner={ultimateWinner}
            />
          )}
        </div>
        <div className="tic-tac-toe-menu">
          <div className="tic-tac-toe-menu-top">
            <RestartButton onClick={restartGame} />
            {!isClassicMode ? (
              <BlindModeButton onClick={toggleBlindMode} />
            ) : null}
            <ResetScoreButton onClick={resetScore} />
            {!isClassicMode ? (
              <InfoButton onToggleRules={toggleRulesVisibility} />
            ) : null}
            <p className="tic-tac-toe-blind-show">
              {!isClassicMode && blindMode ? "Blind Mode is On" : ""}
            </p>
          </div>
          <div className="tic-tac-toe-menu-separator"></div>
          <div className="tic-tac-toe-menu-bottom">
            <p className="tic-tac-toe-score">Score</p>
            <div className="tic-tac-toe-score-container">
              <p className="tic-tac-toe-score">X: {score.X}</p>
              <p className="tic-tac-toe-score">O: {score.O}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;