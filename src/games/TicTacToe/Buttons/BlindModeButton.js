import React, { useState } from "react";
import "./BlindModeButton.css";

const BlindModeButton = ({onClick}) => {
    return (
        <div className="blind-button" onClick={onClick}>
            Blind Mode
        </div>
    );
};

export default BlindModeButton;