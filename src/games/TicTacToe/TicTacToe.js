import React, { useState, useEffect } from "react";
import MainBoard from "./MainBoard";
import ClassicBoard from "./ClassicBoard"; 
import { createClassicGame, makeClassicMove, createUltimateGame, makeUltimateMove, getScore, setScore } from "./api";
import RestartButton from "./Buttons/RestartButton";
import ClassicTTTModeButton from "./Buttons/ClassicTTTModeButton";
import BlindModeButton from "./Buttons/BlindModeButton";
import ResetScoreButton from "./Buttons/ResetScoreButton";
import HomeButton from "./Buttons/HomeButton";
import InfoButton from "./Buttons/InfoButton";
import "./TicTacToe.css";

const TicTacToe = () => {
    const [isClassicMode, setIsClassicMode] = useState(false);

    const [classicBoard, setClassicBoard] = useState([]);
    const [classicIsXNext, setClassicIsXNext] = useState(null);
    const [classicWinner, setClassicWinner] = useState(null);

    const [subBoards, setSubBoards] = useState([]);
    const [mainBoard, setMainBoard] = useState([]);
    const [isXNext, setIsXNext] = useState(null);
    const [activeSubBoard, setActiveSubBoard] = useState(null);
    const [ultimateWinner, setUltimateWinner] = useState(null);
    const [blindMode, setBlindMode] = useState(null);

    const [showRules, setShowRules] = useState(false);

    const [score, setScoreState] = useState([]);

    const toggleGameMode = () => {
        setIsClassicMode(!isClassicMode);
        if (classicIsXNext == null) {
            startClassicGame();
        }
    };

    const toggleBlindMode = async () => {
        const gameUpdate = await makeUltimateMove(null, null, blindMode);
        setBlindMode(gameUpdate.blindMode);
    };

    const resetScore = () => {
        updateScore("X", 0);
        updateScore("O", 0);
    };

    const restartGame = () => {
        if (isClassicMode) {
            startClassicGame();
        } else {
            startUltimateGame();
        }
    };


    const startClassicGame = async () => {
        const game = await createClassicGame();
        setClassicBoard(game.board);
        setClassicIsXNext(game.isXNext);
        setClassicWinner(game.winner);
    };

    const makeClassicMoveClick = async (cellIndex) => {
        const gameUpdate = await makeClassicMove(cellIndex);
        if(classicWinner) return;
        setClassicBoard(gameUpdate.board);
        setClassicIsXNext(gameUpdate.isXNext);
        setClassicWinner(gameUpdate.winner);
        fetchScore();
    };

    const startUltimateGame = async () => {
        const game = await createUltimateGame();
        setSubBoards(game.subBoards);
        setMainBoard(game.mainBoard);
        setIsXNext(game.isXNext);
        setActiveSubBoard(game.activeSubBoard);
        setBlindMode(game.blindMode);
    };

    const makeUltimateMoveClick = async (subBoardIndex, cellIndex) => {
        const gameUpdate = await makeUltimateMove(subBoardIndex, cellIndex, null);
        if(ultimateWinner) return;
        setSubBoards(gameUpdate.subBoards);
        setMainBoard(gameUpdate.mainBoard);
        setIsXNext(gameUpdate.isXNext);
        setActiveSubBoard(gameUpdate.activeSubBoard);
        setBlindMode(gameUpdate.blindMode);
        setUltimateWinner(gameUpdate.winner);
        fetchScore();
    };

    const fetchScore = async () => {
        const currentScore = await getScore();
        setScoreState(currentScore);
    };

    const toggleRulesVisibility = () => {
        setShowRules((prevShowRules) => !prevShowRules);
    };

    const updateScore = async (player, wins) => {
        const updatedScore = await setScore(player, wins);
        setScoreState(updatedScore);
    };

    useEffect(() => {
        fetchScore();
        startUltimateGame();
    }, []);

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
          {!isClassicMode && <p className="tic-tac-toe-is-next">{isXNext ? "X" : "O"} Is on move</p>}
          {isClassicMode && <p className="tic-tac-toe-is-next">{classicIsXNext ? "X" : "O"} Is on move</p>}
          <div className="tic-tac-toe-main">
            <div className="tic-tac-toe-filler">
              {showRules && !isClassicMode && (
                <div className="tic-tac-toe-rules">
                 <p>
                <strong>Rules of Ultimate Tic Tac Toe:</strong>
                </p>

                <ul>
                <li>
                    <strong>Game Plan:</strong>
                    The game board consists of 9 smaller 3x3 grids, forming a larger 3x3 grid (a total of 81 cells). 
                    Each smaller grid is a "mini-board," and winning on a mini-board marks it as won by that player.
                </li>

                <li>
                    <strong>Turns and Moves:</strong>
                    Players take turns placing their marks (X or O) in an empty cell. The position of the move on the mini-board 
                    determines which mini-board the next player must play in. For example, if you place your mark in the top-right 
                    cell of a mini-board, the next player must play in the top-right mini-board.
                </li>

                <li>
                    <strong>Forced Moves:</strong>
                    If the required mini-board (based on the previous move) is already won or full, the next player may choose any 
                    empty cell on any available mini-board.
                </li>

                <li>
                    <strong>Winning a Mini-Board:</strong>
                    A player wins a mini-board by placing 3 of their marks in a row (horizontally, vertically, or diagonally) 
                    within that mini-board.
                </li>

                <li>
                    <strong>Winning the Game:</strong>
                    The overall game is won by claiming 3 mini-boards in a row (horizontally, vertically, or diagonally) on the larger 3x3 grid.
                </li>

                <li>
                    <strong>Game End:</strong>
                    The game ends when one player wins 3 mini-boards in a row, or when all mini-boards are full. If no player has 3 
                    mini-boards in a row and the entire board is full, the game ends in a draw.
                </li>
                </ul>

                </div>
              )}
            </div>
            {/* {ultimateWinner && !isClassicMode && <p className="winner">Winner: {ultimateWinner}</p>}
            {classicWinner && isClassicMode && <p className="winner">Winner: {classicWinner}</p>} */}
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
                />
              )}
            </div>
            <div className="tic-tac-toe-menu">
              <div className="tic-tac-toe-menu-top">
                <RestartButton onClick={restartGame} />
                {!isClassicMode ? <BlindModeButton onClick={toggleBlindMode} /> : null}
                <ResetScoreButton onClick={resetScore} />
                {!isClassicMode ? <InfoButton onToggleRules={toggleRulesVisibility} /> : null}
                <p className="tic-tac-toe-blind-show">{!isClassicMode && blindMode ? "Blind Mode is On" : ""}</p>
              </div>
              <div className="tic-tac-toe-menu-separator"></div>
              <div className="tic-tac-toe-menu-bottom">
                <p className="score-TicTacToe">Score</p>
                <p className="score-TicTacToe">
                  X: {score.X} ---------- O: {score.O}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
};

export default TicTacToe;