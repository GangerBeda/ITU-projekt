import React, { useState } from "react";
import SubBoard from "./SubBoard";
import "./MainBoard.css";

const MainBoard = ({ subBoards, mainBoard, onSquareClick, activeSubBoard, blindModeActive }) => {
    
    const [hoveredSquare, setHoveredSquare] = useState(null);

    return (
        <div className="main-board">
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