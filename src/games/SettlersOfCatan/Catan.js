import React from 'react';
import { HexGrid, Layout, Hexagon, GridGenerator } from 'react-hexgrid';
import './Catan.css';

const INVALID_HEXES_SETTLERS = [
    0, 1, 4, 5, 6, 9, 12, 15, 18, 22, 25, 28, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 62, 65, 68, 72, 75, 78, 81, 84, 85, 86, 89, 90,
];
const INVALID_HEXES_PATHS = [7, 9, 11, 22, 24, 26, 28, 41, 43, 45, 47, 49, 62, 64, 66, 68, 79, 81, 83];

const hexClicked = (grid, hexId) => {
    let element = document.getElementById(`${grid}-${hexId}`);
    console.log(element);
};
const renderHexGrid = (grid, size, spacing, flat, invalidHexes, hexRadius) => {
    return (
        <HexGrid width={800} height={800} viewBox='-50 -50 100 100'>
            <Layout size={size} spacing={spacing} flat={flat}>
                {GridGenerator.hexagon(hexRadius).map((hex, i) =>
                    invalidHexes.includes(i) ? null : (
                        <Hexagon
                            id={`${grid}-${i}`}
                            key={`${grid}-${i}`}
                            q={hex.q}
                            r={hex.r}
                            s={hex.s}
                            onClick={() => hexClicked(grid, i)}
                            className={`hexagon hexagon-${grid}`}
                        />
                    )
                )}
            </Layout>
        </HexGrid>
    );
};

export default function Catan() {
    return (
        <div className='container'>
            {renderHexGrid('material', { x: 10, y: 10 }, 1.1, false, [], 2)}
            {renderHexGrid('settler', { x: 2, y: 2 }, 3.175, true, INVALID_HEXES_SETTLERS, 5)}
            {renderHexGrid('path', { x: 2, y: 2 }, 2.75, false, INVALID_HEXES_PATHS, 5)}
        </div>
    );
}
