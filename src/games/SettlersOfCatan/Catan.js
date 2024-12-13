import React, { useState, useEffect } from 'react';
import Board from './Board';
import Panel from './Panel';

export default function Catan() {
    const [activePlayerColor, setActivePlayerColor] = useState('#f00');
    const [gameState, setGameState] = useState({ text: 'Placing settler', phase: 0 });

    const [roll1, setRoll1] = useState(1);
    const [roll2, setRoll2] = useState(1);

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
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
