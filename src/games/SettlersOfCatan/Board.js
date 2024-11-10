import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HexGrid, Layout, Hexagon, GridGenerator, Pattern } from 'react-hexgrid';
import './Board.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const INVALID_HEXES_MATERIALS = [0, 1, 2, 3, 4, 8, 9, 14, 15, 21, 22, 27, 28, 32, 33, 34, 35, 36];
const INVALID_HEXES_SETTLERS = [
    0, 1, 4, 5, 6, 9, 12, 15, 18, 22, 25, 28, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 62, 65, 68, 72, 75, 78, 81, 84, 85, 86, 89, 90,
];
const INVALID_HEXES_PATHS = [7, 9, 11, 22, 24, 26, 28, 41, 43, 45, 47, 49, 62, 64, 66, 68, 79, 81, 83];

const NEIGHBORS = {
    // MATERIAL: [SETTLERS],
    16: [13, 14, 23, 32, 31, 21],
    23: [31, 41, 52, 53, 43, 32],
    29: [52, 61, 70, 71, 63, 53],
    10: [7, 14, 23, 24, 16, 8],
    17: [23, 32, 43, 44, 34, 24],
    24: [43, 53, 63, 64, 55, 44],
    30: [63, 71, 79, 80, 73, 64],
    5: [2, 8, 16, 17, 10, 3],
    11: [16, 24, 34, 35, 26, 17],
    18: [34, 44, 55, 56, 46, 35],
    25: [55, 64, 73, 74, 66, 56],
    31: [73, 80, 87, 88, 82, 74],
    6: [10, 17, 26, 27, 19, 11],
    12: [26, 35, 46, 47, 37, 27],
    19: [46, 56, 66, 67, 58, 47],
    26: [66, 74, 82, 83, 76, 67],
    7: [27, 37, 38, 29, 20, 19],
    13: [37, 47, 58, 59, 49, 38],
    20: [58, 67, 76, 77, 69, 59],
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
    const [hexColors, setHexColors] = useState({});
    const [hexHoverColors, setHexHoverColors] = useState({});

    useEffect(() => {
        axios
            .get('http://localhost:3001/api/gameObj')
            .then((response) => {
                setHexColors(response.data.hexColors);
                setHexHoverColors(response.data.hexHoverColors);
            })
            .catch(() => {
                const initialColors = {};
                for (let i = 0; i < 100; i++) {
                    initialColors[`path-${i}`] = '#222';
                    initialColors[`material-${i}`] = '#222';
                    initialColors[`settler-${i}`] = '#222';
                }
                setHexColors(initialColors);

                const initialHoverColors = {};
                for (let i = 0; i < 100; i++) {
                    initialHoverColors[`path-${i}`] = '#555';
                    initialHoverColors[`material-${i}`] = '#555';
                    initialHoverColors[`settler-${i}`] = '#555';
                }
                setHexHoverColors(initialHoverColors);
            });
    }, []);

    const getHexColor = (grid, i) => {
        return hexColors[`${grid}-${i}`] || '#222';
    };

    const getHexHoverColor = (grid, i) => {
        return hexHoverColors[`${grid}-${i}`] || '#555';
    };

    const hexClicked = (grid, i) => {
        /*
        console.log(grid, i);
        return;
        */
        setHexColors((prevColors) => ({ ...prevColors, [`${grid}-${i}`]: props.activePlayerColor }));
        setHexHoverColors((prevColors) => ({ ...prevColors, [`${grid}-${i}`]: props.activePlayerColor.replace('f', '9') }));

        axios
            .post('http://localhost:3001/api/gameObj', {
                hexColors: { ...hexColors, [`${grid}-${i}`]: props.activePlayerColor },
                hexHoverColors: { ...hexHoverColors, [`${grid}-${i}`]: props.activePlayerColor.replace('f', '9') },
            })
            .catch((error) => {
                console.log('Request failed:', error);
            });
    };

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
                                            ? getHexHoverColor(grid, i)
                                            : getHexColor(grid, i, props.activePlayerColor),

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
            <div className='statebox'>
                <p>Game State</p>
            </div>
            <div className='dice-container'>
                <img className='dice' src={require(`./images/Dice/${props.roll1}.png`)} alt={`Dice showing ${props.roll1}`} width={100} height={100} />
                <img className='dice' src={require(`./images/Dice/${props.roll2}.png`)} alt={`Dice showing ${props.roll2}`} width={100} height={100} />
            </div>
            <Link key={''} to={'/'} className='home-icon-container'>
                <FontAwesomeIcon icon={faHome} className='home-icon' />
            </Link>
            <FontAwesomeIcon icon={faBookOpen} className='rules-icon' />
        </div>
    );
}
