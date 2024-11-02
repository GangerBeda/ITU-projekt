import React from 'react';
import { useParams } from 'react-router-dom';
import Blackjack from '../games/Blackjack/Blackjack';
import Catan from '../games/SettlersOfCatan/Catan';

const games = {
    blackjack: Blackjack,
    catan: Catan,
};

function GameLoader() {
    const { gameId } = useParams();

    const GameComponent = games[gameId];

    return GameComponent ? <GameComponent /> : <p>Game not found</p>;
}

export default GameLoader;
