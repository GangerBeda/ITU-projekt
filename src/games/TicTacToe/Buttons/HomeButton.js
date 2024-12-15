/* author: Martin Vrablec
*  rendering home button
*/
import React from "react";
import { useNavigate } from "react-router-dom";
import "./MenuButtons.css";

// button used to navigate to the home page
const HomeButton = () => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/");
    };

    return (
        <div className="tic-tac-toe-menu-button-home" onClick={handleClick}>
        </div>
    );
};

export default HomeButton;