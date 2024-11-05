import React from 'react';
import { useParams } from 'react-router-dom';
import Blackjack from '../games/Blackjack/Blackjack';
import Catan from '../games/SettlersOfCatan/Catan';
import Chess from '../games/Chess/Chess';
import FourInARow from "../games/FourInARow/FourInARow";

const games = {
    blackjack: Blackjack,
    catan: Catan,
    chess: Chess,
    fourinarow: FourInARow,
};

function GameLoader() {
    const { gameId } = useParams();

    const GameComponent = games[gameId];

    return GameComponent ? <GameComponent /> : <p>Game not found</p>;
}

export default GameLoader;
