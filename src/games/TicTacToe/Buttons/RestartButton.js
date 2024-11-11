import React from "react";
import "./RestartButton.css";

const RestartButton = ({onClick}) => {
    return (
        <div className="restart-button" onClick={onClick}>
            Restart
        </div>
    );
};

export default RestartButton;