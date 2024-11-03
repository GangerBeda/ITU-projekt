import React, { useState } from 'react';
import { HexGrid, Layout, Hexagon, GridGenerator, Pattern } from 'react-hexgrid';
import './Board.css';

const INVALID_HEXES_MATERIALS = [0, 1, 2, 3, 4, 8, 9, 14, 15, 21, 22, 27, 28, 32, 33, 34, 35, 36];
const INVALID_HEXES_SETTLERS = [
    0, 1, 4, 5, 6, 9, 12, 15, 18, 22, 25, 28, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 62, 65, 68, 72, 75, 78, 81, 84, 85, 86, 89, 90,
];
const INVALID_HEXES_PATHS = [7, 9, 11, 22, 24, 26, 28, 41, 43, 45, 47, 49, 62, 64, 66, 68, 79, 81, 83];

const hexClicked = (grid, hexId) => {
    let element = document.getElementById(`${grid}-${hexId}`);
    console.log(element);
};

const convertToColor = (materialType) => {
    switch (materialType) {
        case 'wood':
            return '#060';
        case 'brick':
            return '#900';
        case 'sheep':
            return '#0c0';
        case 'wheat':
            return '#990';
        case 'ore':
            return '#999';
        default:
            return '#000';
    }
};

const convertToHoverColor = (materialType) => {
    switch (materialType) {
        case 'wood':
            return '#090';
        case 'brick':
            return '#c00';
        case 'sheep':
            return '#0f0';
        case 'wheat':
            return '#cc0';
        case 'ore':
            return '#ccc';
        default:
            return '#333';
    }
};

export default function Board(props) {
    const [hoveredHex, setHoveredHex] = useState(null);
    const renderHexGrid = (grid, size, spacing, flat, invalidHexes, hexRadius) => {
        let j = 0;
        return (
            <HexGrid width={800} height={800} viewBox='-50 -50 100 100'>
                <Layout size={size} spacing={spacing} flat={flat}>
                    {GridGenerator.hexagon(hexRadius).map((hex, i) =>
                        invalidHexes.includes(i) ? (
                            grid === 'material' ? (
                                <Hexagon id={`${grid}-${i}`} key={`${grid}-${i}`} q={hex.q} r={hex.r} s={hex.s} cellStyle={{ fill: '#09f' }} />
                            ) : null
                        ) : (
                            <Hexagon
                                id={`${grid}-${i}`}
                                key={`${grid}-${i}`}
                                q={hex.q}
                                r={hex.r}
                                s={hex.s}
                                onClick={() => hexClicked(grid, i)}
                                onMouseEnter={() => setHoveredHex(`${grid}-${i}`)}
                                onMouseLeave={() => setHoveredHex(null)}
                                cellStyle={{
                                    fill:
                                        grid === 'material'
                                            ? hoveredHex === `${grid}-${i}`
                                                ? convertToHoverColor(props.materialTypes[j])
                                                : convertToColor(props.materialTypes[j])
                                            : hoveredHex === `${grid}-${i}`
                                            ? '#555'
                                            : '#222',

                                    stroke: '#000',
                                    strokeWidth: 0.2,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                className={`hexagon hexagon-${grid}`}
                            >
                                {grid === 'material' ? (
                                    <text x='0' y='0' fill='black' fontSize='5px'>
                                        {props.numberTokens[j++]}
                                    </text>
                                ) : null}
                            </Hexagon>
                        )
                    )}
                </Layout>
            </HexGrid>
        );
    };

    return (
        <div className='container'>
            {renderHexGrid('path', { x: 4, y: 4 }, 1.375, false, INVALID_HEXES_PATHS, 5)}
            {renderHexGrid('material', { x: 10, y: 10 }, 1.1, false, INVALID_HEXES_MATERIALS, 3)}
            {renderHexGrid('settler', { x: 2, y: 2 }, 3.175, true, INVALID_HEXES_SETTLERS, 5)}
        </div>
    );
}
