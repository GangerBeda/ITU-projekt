import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomeButton.css";

const HomeButton = () => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/");
    };

    return (
        <div className="home-button" onClick={handleClick}>
            HOME
        </div>
    );
};

export default HomeButton;