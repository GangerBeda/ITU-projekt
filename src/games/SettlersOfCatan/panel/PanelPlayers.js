import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export default function PanelPlayers(props) {
    const [playerCards, setPlayerCards] = useState(null);

    useEffect(() => {
        const fetchPlayerCards = async () => {
            try {
                const response = await axios.get('http://localhost:3001/catan/player');
                setPlayerCards(response.data.playerCards);
            } catch (error) {
                console.error('Error fetching player cards:', error);
            }
        };

        fetchPlayerCards();
    }, []);

    const calculateTotalResources = (resources) => {
        return Object.values(resources).reduce((total, count) => total + count, 0);
    };

    const calculateTotalDevelopments = (developments) => {
        return Object.values(developments).reduce((total, count) => total + count, 0);
    };

    if (!playerCards) {
        return <div>Loading...</div>;
    }

    const playerOrder = ['#f00', '#0f0', '#00f', '#ff0'];

    return (
        <>
            <div className='icon-container'>
                <FontAwesomeIcon icon={faTimes} className='x-icon' onClick={() => props.setPanel('resources')} />
            </div>
            <p>Total Cards</p>
            <div className='card-container'>
                {playerOrder.map((color) => (
                    <div key={color} className='card'>
                        {calculateTotalResources(playerCards[color].resource)}
                    </div>
                ))}
            </div>
            <div className='separator' />
            <p>Development Cards</p>
            <div className='card-container'>
                {playerOrder.map((color) => (
                    <div key={color} className='card'>
                        {calculateTotalDevelopments(playerCards[color].development)}
                    </div>
                ))}
            </div>
            <div className='separator' />
            <p>Largest Army</p>
            <div className='card-container'>
                <div className='card'>
                    <div className='circle'>0</div>
                </div>
                <div className='card'>
                    <div className='circle'>0</div>
                </div>
                <div className='card'>
                    <div className='circle'>0</div>
                </div>
                <div className='card'>
                    <div className='circle'>0</div>
                </div>
            </div>
            <div className='separator' />
            <p>Longest Road</p>
            <div className='card-container'>
                <div className='card'>
                    <div className='circle'>0</div>
                </div>
                <div className='card'>
                    <div className='circle'>0</div>
                </div>
                <div className='card'>
                    <div className='circle'>0</div>
                </div>
                <div className='card'>
                    <div className='circle'>0</div>
                </div>
            </div>
            <div className='separator' />
        </>
    );
}
