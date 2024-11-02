import React from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';

import Blackjack from '../games/Blackjack/Blackjack';
import Catan from '../games/SettlersOfCatan/Catan';

const games = [
    { id: 'blackjack', name: 'Blackjack', component: Blackjack },
    { id: 'tic-tac-toe', name: 'Tic Tac Toe' },
    { id: 'catan', name: 'Settlers of Catan', component: Catan },
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
