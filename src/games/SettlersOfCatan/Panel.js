// author: Jaroslav Synek <xsynekj00>
// project: Games Hub
// game: Settlers of Catan

import React, { useState, useEffect } from 'react';
import './Panel.css';
import PanelResources from './panel/PanelResources';
import PanelPlayers from './panel/PanelPlayers';
import axios from 'axios';

export default function Panel(props) {
    // state hooks
    const [panel, setPanel] = useState('resources');
    const [playerCards, setPlayerCards] = useState(null);
    const [hexColors, setHexColors] = useState(null);
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

        const fetchHexColors = async () => {
            try {
                const response = await axios.get('http://localhost:3001/catan/state');
                setHexColors(response.data.hexColors);
            } catch (error) {
                console.error('Error fetching hex colors:', error);
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
            await fetchHexColors();
            await fetchExtraPoints();
        };

        fetchData();

        // fetch in 1 second intervals
        const intervalId = setInterval(fetchData, 1000);

        return () => clearInterval(intervalId);
    }, []);

    // settlers + VPs + roads + army
    const calculateTotalPoints = (color) => {
        if (hexColors === null || playerCards === null || extraPoints === null) {
            return 0;
        }
        const settlerCount = Object.entries(hexColors)
            .filter(([key, value]) => key.includes('settler') && value === color)
            .map(([key]) => key).length;

        const vpCount = playerCards[color]?.development?.victory_point || 0;

        let sum = settlerCount + vpCount;

        if (extraPoints?.roads.most_roads === color) {
            sum += 2;
        }

        if (extraPoints?.army.largest_army === color) {
            sum += 2;
        }

        return sum;
    };

    // define player order for styling
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
