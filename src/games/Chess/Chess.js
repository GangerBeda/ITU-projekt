import React from 'react';
import { Routes, Route, useMatch, useNavigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import GamePage from './components/GamePage';
import Settings from './components/Settings';

const Chess = () => {
    // Get the base path for chess routes
    const match = useMatch('/game/chess/*');
    const navigate = useNavigate();
  
    // Create a wrapper for navigation that prepends the base path
    const chessNavigate = (path) => {
      navigate(`/game/chess${path}`);
    };
  
    // Create a context to provide the navigation wrapper to child components
    const navigationContext = {
      navigate: chessNavigate
    };
  
    return (
      <div className="chess-app">
        <Routes>
          <Route 
            index 
            element={
              <HomePage 
                navigate={chessNavigate} 
              />
            } 
          />
          <Route 
            path="play" 
            element={
              <GamePage 
                navigate={chessNavigate}
              />
            } 
          />
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
