import React from "react";
import "./MenuButtons.css";

const ResetScoreButton = ({ onClick }) => {
    return (
        <div className="tic-tac-toe-menu-button" onClick={onClick}>
            Reset Score
        </div>
    );
};

export default ResetScoreButton;