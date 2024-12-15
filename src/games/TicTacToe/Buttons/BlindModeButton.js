import React, { useState } from "react";
import "./MenuButtons.css";

const BlindModeButton = ({onClick}) => {
    return (
        <div className="tic-tac-toe-menu-button" onClick={onClick}>
            Blind Mode
        </div>
    );
};

export default BlindModeButton;