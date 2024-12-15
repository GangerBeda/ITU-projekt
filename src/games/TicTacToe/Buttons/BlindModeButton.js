/* author: Martin Vrablec
*  rendering blind button
*/
import React, { useState } from "react";
import "./MenuButtons.css";

// button used to toggle blind mode
const BlindModeButton = ({onClick}) => {
    return (
        <div className="tic-tac-toe-menu-button" onClick={onClick}>
            Blind Mode
        </div>
    );
};

export default BlindModeButton;