import React from 'react';
import { useParams } from 'react-router-dom';
import Blackjack from '../games/Blackjack/Blackjack';

const games = {
    blackjack: Blackjack,
};

function GameLoader() {
    const { gameId } = useParams();

    const GameComponent = games[gameId];

    return GameComponent ? <GameComponent /> : <p>Game not found</p>;
}

export default GameLoader;
