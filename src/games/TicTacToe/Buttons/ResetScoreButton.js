import React from "react";
import "./MenuButtons.css";

// button used to reset the score
const ResetScoreButton = ({ onClick }) => {
    return (
        <div className="tic-tac-toe-menu-button" onClick={onClick}>
            Reset Score
        </div>
    );
};

export default ResetScoreButton;