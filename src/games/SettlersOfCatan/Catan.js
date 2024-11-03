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

export default function Catan() {
    return <Board materialTypes={materialTypes} numberTokens={numberTokens} />;
}
