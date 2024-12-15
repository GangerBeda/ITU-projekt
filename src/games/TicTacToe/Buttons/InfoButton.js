/* author: Martin Vrablec
*  rendering rules button
*/
import React, { useState } from "react";
import "./MenuButtons.css";

// button used to toggle the rules
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