/* author: Martin Vrablec
*  rendering restart button
*/
import React from "react";
import "./MenuButtons.css";

// button used to restart the game
const RestartButton = ({onClick}) => {
    return (
        <div className="tic-tac-toe-menu-button" onClick={onClick}>
            Restart
        </div>
    );
};

export default RestartButton;