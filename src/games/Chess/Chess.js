/*
 * ITU Games Hub
 * @brief Main Chess application component handling routing and navigation
 * @author Da Costa Menezes Kristián || xdacos01
 */

import React from 'react';
import { Routes, Route, useMatch, useNavigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import GamePage from './components/GamePage';
import Settings from './components/Settings';

/**
 * Chess Component
 * 
 * Serves as the main application component for the Chess game.
 * Manages routing between the HomePage, GamePage, and Settings components.
 * Provides a navigation function to handle route changes within the chess section.
 * 
 * @returns {JSX.Element} The rendered Chess component with defined routes
 */
const Chess = () => {
    const match = useMatch('/game/chess/*'); // Match for nested routes under /game/chess
    const navigate = useNavigate(); // Hook to navigate programmatically

    /**
     * Custom navigate function scoped to the chess routes.
     * 
     * @param {string} path - The path to navigate to within the chess routes
     */
    const chessNavigate = (path) => {
        navigate(`/game/chess${path}`);
    };

    // Context object for navigation (currently unused but can be extended)
    const navigationContext = {
        navigate: chessNavigate
    };

    return (
        <div className="chess-app">
            {/* Define application routes */}
            <Routes>
                {/* Home Page Route */}
                <Route
                    index
                    element={
                        <HomePage
                            navigate={chessNavigate}
                        />
                    }
                />
                {/* Game Page Route */}
                <Route
                    path="play"
                    element={
                        <GamePage
                            navigate={chessNavigate}
                        />
                    }
                />
                {/* Settings Page Route */}
                <Route
                    path="settings"
                    element={
                        <Settings
                            navigate={chessNavigate}
                        />
                    }
                />
            </Routes>
        </div>
    );
};

export default Chess;
