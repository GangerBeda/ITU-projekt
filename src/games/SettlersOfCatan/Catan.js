import React from 'react';
import { HexGrid, Layout, Hexagon, GridGenerator } from 'react-hexgrid';
import './Catan.css';

const INVALID_HEXES = [0, 1, 4, 5, 6, 9, 12, 15, 18, 22, 25, 28, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 62, 65, 68, 72, 75, 78, 81, 84, 85, 86, 89, 90];

const hexClicked = (grid, hexId) => {
    let element = document.getElementById(`${grid}-${hexId}`);
    console.log(element);
};

export default function Catan() {
    return (
        <div className='container'>
            <HexGrid width={800} height={800} viewBox='-50 -50 100 100'>
                <Layout size={{ x: 10, y: 10 }} spacing={1.1} flat={false}>
                    {GridGenerator.hexagon(2).map((hex, i) => (
                        <Hexagon
                            id={`grid1-${i}`}
                            key={`grid1-${i}`}
                            q={hex.q}
                            r={hex.r}
                            s={hex.s}
                            onClick={() => hexClicked('grid1', i)}
                            className={'hexagon hexagon-grid1'}
                        />
                    ))}
                </Layout>
            </HexGrid>
            <HexGrid width={800} height={800} viewBox='-50 -50 100 100'>
                <Layout size={{ x: 2, y: 2 }} spacing={3.2} flat={true}>
                    {GridGenerator.hexagon(5).map((hex, i) =>
                        INVALID_HEXES.includes(i) ? null : (
                            <Hexagon
                                id={`grid2-${i}`}
                                key={`grid2-${i}`}
                                q={hex.q}
                                r={hex.r}
                                s={hex.s}
                                onClick={() => hexClicked('grid2', i)}
                                className={'hexagon hexagon-grid2'}
                            />
                        )
                    )}
                </Layout>
            </HexGrid>
        </div>
    );
}
