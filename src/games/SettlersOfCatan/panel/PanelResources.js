import React from 'react';

export default function PanelResources(props) {
    const setRolls = (event) => {
        event.preventDefault();
        props.setRoll1(Math.floor((Math.random() * 10000) % 6) + 1);
        props.setRoll2(Math.floor((Math.random() * 10000) % 6) + 1);
    };

    const endTurn = (event) => {
        event.preventDefault();
        props.setActivePlayerColor((prevColor) => {
            switch (prevColor) {
                case '#f00':
                    return '#00f';
                case '#00f':
                    return '#0f0';
                case '#0f0':
                    return '#ff0';
                case '#ff0':
                    return '#f00';
                default:
                    return '#f00';
            }
        });
    };

    return (
        <>
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
            <button onClick={(event) => setRolls(event)}>Roll</button>
            <br />
            <button onClick={(event) => endTurn(event)}>End Turn</button>
            <div className='separator' />
            <button onClick={() => props.setPanel('leaderboard')}>Leaderboard</button>
        </>
    );
}
