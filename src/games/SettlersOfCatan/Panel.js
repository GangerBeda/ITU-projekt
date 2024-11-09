import React from 'react';
import './Panel.css';

export default function Panel() {
    return (
        <div className='panel'>
            <div className='separator' />
            <h1>Cards</h1>
            <div className='separator' />
            <div className='card-container'>
                <div className='card'>0</div>
                <div className='card'>0</div>
                <div className='card'>0</div>
                <div className='card'>0</div>
                <div className='card'>0</div>
            </div>
            <div className='card-container'>
                <div className='card'>0</div>
                <div className='card'>0</div>
                <div className='card'>0</div>
                <div className='card'>0</div>
                <div className='card'>0</div>
            </div>
            <div className='separator' />
            <button>Buy development card</button>
            <button>Trade</button>
            <div className='separator' />
            <button>Roll</button>
            <br />
            <button>End Turn</button>
            <div className='separator' />
            <button>Leaderboard</button>
            <div className='card-container'>
                <div className='card'>0</div>
                <div className='card'>0</div>
                <div className='card'>0</div>
                <div className='card'>0</div>
            </div>
        </div>
    );
}
