import React, { useState } from "react";
import SubBoard from "./SubBoard";
import "./MainBoard.css";

// main board component, displays subboards and content of subboards
const MainBoard = ({ subBoards, mainBoard, onSquareClick, isUltimateWinner, activeSubBoard, blindModeActive }) => {
    
    // sets hovered square
    const [hoveredSquare, setHoveredSquare] = useState(null);

    // renders subboards based on parsed information
    return (
        <div className= {`tic-tac-toe-main-board ${isUltimateWinner ? "won" : ""}`}>
            {subBoards.map((subBoard, index) => (
                <SubBoard
                    key={index}
                    board={subBoard}
                    isActive={activeSubBoard === null || activeSubBoard === index}
                    winner={mainBoard[index]}
                    onSquareClick={(cellIndex) => onSquareClick(index, cellIndex)}
                    onHoverSquare={setHoveredSquare}
                    hoveredSquare={hoveredSquare === index}
                    blindModeActive={blindModeActive}
                />
            ))}
        </div>
    );
};

export default MainBoard;