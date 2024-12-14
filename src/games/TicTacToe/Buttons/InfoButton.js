import React from "react";
import "./MenuButtons.css";

const InfoButton = () => {
    
    const handleClick = () => {
        alert("INFO");
    };

    return (
        <div className="tic-tac-toe-menu-button" onClick={handleClick}>
            INFO
        </div>
    );
};

export default InfoButton;