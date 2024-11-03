import React from 'react';
import Board from './Board';

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
    shuffle();
    return <Board materialTypes={materialTypes} numberTokens={numberTokens} />;
}
