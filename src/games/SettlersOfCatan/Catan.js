import React, { useState } from 'react';
import Board from './Board';
import Panel from './Panel';

const materialTypes = [
    'desert',
    'wood',
    'wood',
    'wood',
    'wood',
    'brick',
    'brick',
    'brick',
    'sheep',
    'sheep',
    'sheep',
    'sheep',
    'wheat',
    'wheat',
    'wheat',
    'wheat',
    'ore',
    'ore',
    'ore',
];

const numberTokens = [' ', 2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];

const shuffle = () => {
    for (let i = materialTypes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [materialTypes[i], materialTypes[j]] = [materialTypes[j], materialTypes[i]];
    }
    for (let i = numberTokens.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numberTokens[i], numberTokens[j]] = [numberTokens[j], numberTokens[i]];
    }

    const desertIndex = materialTypes.indexOf('desert');
    const desertMaterial = materialTypes[desertIndex];
    materialTypes[desertIndex] = materialTypes[numberTokens.indexOf(' ')];
    materialTypes[numberTokens.indexOf(' ')] = desertMaterial;
};

export default function Catan() {
    const [activePlayerColor, setActivePlayerColor] = useState('#f00');
    const [roll1, setRoll1] = useState(1);
    const [roll2, setRoll2] = useState(1);
    useState(() => {
        shuffle();
    });
    return (
        <>
            {/*<select value={activePlayerColor} onChange={(e) => setActivePlayerColor(e.target.value)}>
                <option value='#f00'>Red</option>
                <option value='#00f'>Blue</option>
                <option value='#0f0'>Green</option>
                <option value='#ff0'>Yellow</option>
            </select>*/}
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Board materialTypes={materialTypes} numberTokens={numberTokens} activePlayerColor={activePlayerColor} roll1={roll1} roll2={roll2} />

                <Panel setRoll1={setRoll1} setRoll2={setRoll2} setActivePlayerColor={setActivePlayerColor} />
            </div>
        </>
    );
}
