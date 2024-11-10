import React, { useState } from "react";
import "./RestartButton.css";

const RestartButton = () => {
    return (
        <div className="restart-button">
            <div onClick={() => window.location.reload()}>Restart</div>
        </div>
    );
};

export default RestartButton;