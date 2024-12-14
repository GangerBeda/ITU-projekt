import React, { useState } from "react";
import "./MenuButtons.css";

const InfoButton = ({ onToggleRules }) => {
    return (
      <div
        className="tic-tac-toe-menu-button"
        onClick={onToggleRules}
        style={{
          cursor: "pointer",
          padding: "10px 20px",
          backgroundColor: "#1a1a1a",
          color: "white",
          borderRadius: "10px",
          textAlign: "center",
          userSelect: "none",
        }}
      >
        INFO
      </div>
    );
  };

export default InfoButton;