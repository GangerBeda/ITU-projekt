import React, { useState, useEffect } from 'react';
import './Panel.css';
import PanelResources from './panel/PanelResources';
import PanelPlayers from './panel/PanelPlayers';
import axios from 'axios';

export default function Panel(props) {
    const [panel, setPanel] = useState('resources');
    const [playerCards, setPlayerCards] = useState(null);
    const [hexColors, setHexColors] = useState(null);

    useEffect(() => {
        const fetchPlayerCards = async () => {
            try {
                const response = await axios.get('http://localhost:3001/catan/player');
                setPlayerCards(response.data.playerCards);
            } catch (error) {
                console.error('Error fetching player cards:', error);
            }
        };

        const fetchHexColors = async () => {
            try {
                const response = await axios.get('http://localhost:3001/catan/state');
                setHexColors(response.data.hexColors);
            } catch (error) {
                console.error('Error fetching hex colors:', error);
            }
        };

        const fetchData = async () => {
            await fetchPlayerCards();
            await fetchHexColors();
        };

        fetchData();

        const intervalId = setInterval(fetchData, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const calculateTotalPoints = (color) => {
        if (hexColors === null || playerCards === null) {
            return 0;
        }
        const settlerCount = Object.entries(hexColors)
            .filter(([key, value]) => key.includes('settler') && value === color)
            .map(([key]) => key).length;

        const vpCount = playerCards[color]?.development?.victory_point || 0;

        return settlerCount + vpCount;
    };

    const playerOrder = ['#f00', '#0f0', '#00f', '#ff0'];

    return (
        <div className='panel'>
            {panel === 'resources' ? (
                <PanelResources
                    setPanel={setPanel}
                    setRoll1={props.setRoll1}
                    setRoll2={props.setRoll2}
                    activePlayerColor={props.activePlayerColor}
                    setActivePlayerColor={props.setActivePlayerColor}
                    gameState={props.gameState}
                    setGameState={props.setGameState}
                />
            ) : (
                <PanelPlayers setPanel={setPanel} />
            )}
            <div className='card-container'>
                {playerOrder.map((color) => (
                    <div key={color} className='card' style={{ backgroundColor: color }}>
                        {calculateTotalPoints(color)}
                    </div>
                ))}
            </div>
        </div>
    );
}
