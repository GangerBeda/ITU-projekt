import React from "react";
import "./InfoButton.css";

const InfoButton = () => {
    
    const handleClick = () => {
        alert("INFO");
    };

    return (
        <div className="info-button" onClick={handleClick}>
            INFO
        </div>
    );
};

export default InfoButton;