import React from "react";
import { useNavigate } from "react-router-dom";
import "./MenuButtons.css";

const HomeButton = () => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/");
    };

    return (
        <div className="tic-tac-toe-menu-button" onClick={handleClick}>
            HOME
        </div>
    );
};

export default HomeButton;