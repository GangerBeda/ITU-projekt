import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './components/Menu';
import GameLoader from './components/GameLoader';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Menu />} />
                <Route path="/game/:gameId" element={<GameLoader />} />
            </Routes>
        </Router>
    );
}

export default App;
