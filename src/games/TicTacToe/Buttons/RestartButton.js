import React from "react";
import "./MenuButtons.css";

const RestartButton = ({onClick}) => {
    return (
        <div className="tic-tac-toe-menu-button" onClick={onClick}>
            Restart
        </div>
    );
};

export default RestartButton;