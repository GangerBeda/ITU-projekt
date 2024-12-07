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

    const [score, setScoreState] = useState([]);

    const toggleGameMode = () => {
        setIsClassicMode(!isClassicMode);
        if (!isClassicMode) {
            startClassicGame();
        } else {
            startUltimateGame();
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
            <h1>{isClassicMode ? "Classic Tic-Tac-Toe" : "Ultimate Tic-Tac-Toe"}</h1>
            <div className="buttons-board">
                <HomeButton />
                <RestartButton onClick={restartGame}/>
                <ClassicTTTModeButton onClick={toggleGameMode} />
                {!isClassicMode ? <BlindModeButton onClick={toggleBlindMode} /> : null}
                <ResetScoreButton onClick={resetScore}/>
                <InfoButton />
            </div>
            <h1>{!isClassicMode && blindMode ? "Blind Mode is On" : ""}</h1>
            <p className="score-TicTacToe" > {isXNext ? "X" : "O"} Is on move</p>
            {isClassicMode ? (
                <ClassicBoard
                    board={classicBoard}
                    isXNext={classicIsXNext}
                    onSquareClick={makeClassicMoveClick}
                />
            ) : (
                <div>
                <MainBoard
                    subBoards={subBoards}
                    mainBoard={mainBoard}
                    onSquareClick={makeUltimateMoveClick}
                    activeSubBoard={activeSubBoard}
                    blindModeActive={blindMode}
                />
                </div>
            )}
            <p className="score-TicTacToe">Score</p>
            <p className="score-TicTacToe">X: {score.X} ---------- O: {score.O}</p>
            {ultimateWinner && !isClassicMode && <p className="winner">Winner: {ultimateWinner}</p>}
            {classicWinner && isClassicMode && <p className="winner">Winner: {classicWinner}</p>}
        </div>
    );
};

export default TicTacToe;