// author: Jaroslav Synek <xsynekj00>
// project: Games Hub
// game: Settlers of Catan

import React, { useState, useEffect } from 'react';
import Board from './Board';
import Panel from './Panel';
import axios from 'axios';

export default function Catan() {
    // state hooks
    const [activePlayerColor, setActivePlayerColor] = useState('#f00');
    const [gameState, setGameState] = useState({ text: 'Placing settler', phase: -1 });
    const [roll1, setRoll1] = useState(1);
    const [roll2, setRoll2] = useState(1);

    // fetch when there ís different state of the game
    useEffect(() => {
        const fetchGameState = async () => {
            await axios.post('http://localhost:3001/catan/gameState', gameState);
        };

        if (gameState.phase != -1) {
            fetchGameState();
        }
    }, [gameState]);

    // fetch when component mounts
    useEffect(() => {
        const fetchGameState = async () => {
            try {
                const response = await axios.get('http://localhost:3001/catan/gameState');
                setGameState(response.data);
            } catch (err) {
                try {
                    await axios.post('http://localhost:3001/catan/init', {});

                    const response = await axios.get('http://localhost:3001/catan/gameState');
                    setGameState(response.data);
                } catch (initErr) {
                    console.error('Initialization failed:', initErr);
                }
            }
        };

        fetchGameState();
    }, []);

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
                <Board activePlayerColor={activePlayerColor} roll1={roll1} roll2={roll2} gameState={gameState} setGameState={setGameState} />

                <Panel
                    setRoll1={setRoll1}
                    setRoll2={setRoll2}
                    activePlayerColor={activePlayerColor}
                    setActivePlayerColor={setActivePlayerColor}
                    gameState={gameState}
                    setGameState={setGameState}
                />
            </div>
        </>
    );
}
