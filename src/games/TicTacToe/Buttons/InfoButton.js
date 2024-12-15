import React, { useState } from "react";
import "./MenuButtons.css";

const InfoButton = ({ onToggleRules }) => {
    return (
      <div
        className="tic-tac-toe-menu-button"
        onClick={onToggleRules}
      >
        Rules
      </div>
    );
  };

export default InfoButton;