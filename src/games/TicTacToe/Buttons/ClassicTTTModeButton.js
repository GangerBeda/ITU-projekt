/* author: Martin Vrablec
*  rendering button for changin mode of the game 
*/
import React from "react";
import "./MenuButtons.css";

// button used to start classic tic tac toe mode
const ClassicTTTModeButton = ({ onClick }) => {
    return (
        <div className="tic-tac-toe-menu-button" onClick={onClick}>
            Classic Tic Tac Toe
        </div>
    );
};

export default ClassicTTTModeButton;