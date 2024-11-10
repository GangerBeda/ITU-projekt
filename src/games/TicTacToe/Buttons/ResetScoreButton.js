import React from "react";
import "./ResetScoreButton.css";

const ResetScoreButton = ({ onClick }) => {
    return (
        <div className="reset-score-button" onClick={onClick}>
            Reset Score
        </div>
    );
};

export default ResetScoreButton;