import React from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';

import Blackjack from '../games/Blackjack/Blackjack';
import Catan from '../games/SettlersOfCatan/Catan';
import Chess from '../games/Chess/Chess';
import FourInARow from '../games/FourInARow/controllers/FourInARowController';

const games = [
    { id: 'blackjack', name: 'Blackjack', component: Blackjack },
    { id: 'tic-tac-toe', name: 'Tic Tac Toe' },
    { id: 'catan', name: 'Settlers of Catan', component: Catan },
    { id: 'chess', name: 'Chess', component: Chess },
    { id: 'fourinarow', name: 'FourInARow', component: FourInARow },
];

function Menu() {
    return (
        <div className='menu-container'>
            <h1>Game Hub</h1>
            {games.map((game) => (
                <Link key={game.id} to={`/game/${game.id}`}>
                    <button className='menu-button'>{game.name}</button>
                </Link>
            ))}
        </div>
    );
}

export default Menu;
