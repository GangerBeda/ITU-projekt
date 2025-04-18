// author: Jaroslav Synek <xsynekj00>
// project: Games Hub
// game: Settlers of Catan

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export default function PanelPlayers(props) {
    // state hooks
    const [playerCards, setPlayerCards] = useState(null);
    const [extraPoints, setExtraPoints] = useState(null);

    // fetch when component mounts
    useEffect(() => {
        const fetchPlayerCards = async () => {
            try {
                const response = await axios.get('http://localhost:3001/catan/player');
                setPlayerCards(response.data.playerCards);
            } catch (error) {
                console.error('Error fetching player cards:', error);
            }
        };

        const fetchExtraPoints = async () => {
            try {
                const response = await axios.get('http://localhost:3001/catan/extraPoints');
                setExtraPoints(response.data);
            } catch (error) {
                console.error('Error fetching extra points:', error);
            }
        };

        const fetchData = async () => {
            await fetchPlayerCards();
            await fetchExtraPoints();
        };

        fetchData();

        // fetch in 1 second intervals
        const intervalId = setInterval(fetchData, 1000);

        return () => clearInterval(intervalId);
    }, []);

    // calculate total resources from player card data
    const calculateTotalResources = (resources) => {
        return Object.values(resources).reduce((total, count) => total + count, 0);
    };

    // calculate total developments from player card data
    const calculateTotalDevelopments = (developments) => {
        return Object.values(developments).reduce((total, count) => total + count, 0);
    };

    // loading state if data is not yet fetched
    if (!playerCards || !extraPoints) {
        return <div>Loading...</div>;
    }

    // define player order for styling
    const playerOrder = ['#f00', '#0f0', '#00f', '#ff0'];

    return (
        <>
            <div className='icon-container'>
                <FontAwesomeIcon
                    icon={faTimes}
                    className='x-icon'
                    style={{
                        cursor: 'pointer',
                    }}
                    onClick={() => props.setPanel('resources')}
                />
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
                    <div key={color} className='card' style={{ backgroundColor: '#333', color: '#fff' }}>
                        {calculateTotalDevelopments(playerCards[color].development)}
                    </div>
                ))}
            </div>
            <div className='separator' />
            <p>Largest Army</p>
            <div className='card-container'>
                {playerOrder.map((color) => (
                    <div key={color} className='card'>
                        <div
                            className='circle'
                            style={{
                                backgroundColor: extraPoints.army.largest_army === color ? color : '#ccc',
                                color: '#fff',
                            }}
                        >
                            {extraPoints.army[color]}
                        </div>
                    </div>
                ))}
            </div>
            <div className='separator' />
            <p>Most Roads</p>
            <div className='card-container'>
                {playerOrder.map((color) => (
                    <div key={color} className='card'>
                        <div
                            className='circle'
                            style={{
                                backgroundColor: extraPoints.roads.most_roads === color ? color : '#ccc',
                                color: '#fff',
                            }}
                        >
                            {extraPoints.roads[color]}
                        </div>
                    </div>
                ))}
            </div>
            <div className='separator' />
        </>
    );
}
