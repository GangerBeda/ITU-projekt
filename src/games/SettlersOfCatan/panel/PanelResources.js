import React, { useState } from 'react';
import axios from 'axios';

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

const INVALID_HEXES_MATERIALS = [0, 1, 2, 3, 4, 8, 9, 14, 15, 21, 22, 27, 28, 32, 33, 34, 35, 36];

const getMaterialsForSettler = (settlerId) => {
    const materials = [];
    for (const materialId in NEIGHBORS) {
        if (NEIGHBORS[materialId].includes(settlerId)) {
            materials.push(Number(materialId));
        }
    }
    return materials;
};

const getSettlersForMaterial = (materialId) => {
    return NEIGHBORS[materialId] || [];
};

export default function PanelResources(props) {
    const [playerCards, setPlayerCards] = useState({
        '#f00': {
            resource: {
                wood: 0,
                brick: 0,
                sheep: 0,
                wheat: 0,
                ore: 0,
            },
            development: {
                knight: 0,
                road_building: 0,
                year_of_plenty: 0,
                monopoly: 0,
                victory_point: 0,
            },
        },
        '#00f': {
            resource: {
                wood: 0,
                brick: 0,
                sheep: 0,
                wheat: 0,
                ore: 0,
            },
            development: {
                knight: 0,
                road_building: 0,
                year_of_plenty: 0,
                monopoly: 0,
                victory_point: 0,
            },
        },
        '#0f0': {
            resource: {
                wood: 0,
                brick: 0,
                sheep: 0,
                wheat: 0,
                ore: 0,
            },
            development: {
                knight: 0,
                road_building: 0,
                year_of_plenty: 0,
                monopoly: 0,
                victory_point: 0,
            },
        },
        '#ff0': {
            resource: {
                wood: 0,
                brick: 0,
                sheep: 0,
                wheat: 0,
                ore: 0,
            },
            development: {
                knight: 0,
                road_building: 0,
                year_of_plenty: 0,
                monopoly: 0,
                victory_point: 0,
            },
        },
    });

    const onRoll = (event) => {
        event.preventDefault();
        let roll1 = Math.floor((Math.random() * 10000) % 6) + 1;
        let roll2 = Math.floor((Math.random() * 10000) % 6) + 1;
        props.setRoll1(roll1);
        props.setRoll2(roll2);

        let roll = roll1 + roll2;

        axios
            .get('http://localhost:3001/catan/state')
            .then((response) => {
                let j = 0;

                for (let i = 0; i < 32; i++) {
                    if (INVALID_HEXES_MATERIALS.includes(i)) {
                        continue;
                    }

                    if (response.data.numberTokens[j] == roll) {
                        let material = response.data.materialTypes[j];
                        let indices = NEIGHBORS[i];

                        indices.forEach((index) => {
                            let color = response.data.hexColors[`settler-${index}`];

                            if (color !== '#222') {
                                setPlayerCards((prevPlayerCards) => {
                                    const updatedPlayerData = {
                                        ...prevPlayerCards[color],
                                        resource: {
                                            ...prevPlayerCards[color].resource,
                                            [material]: prevPlayerCards[color].resource[material] + 1,
                                        },
                                    };

                                    return {
                                        ...prevPlayerCards,
                                        [color]: updatedPlayerData,
                                    };
                                });
                            }
                        });
                    }
                    j++;
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const endTurn = (event) => {
        event.preventDefault();
        props.setActivePlayerColor((prevColor) => {
            switch (prevColor) {
                case '#f00':
                    return '#00f';
                case '#00f':
                    return '#0f0';
                case '#0f0':
                    return '#ff0';
                case '#ff0':
                    return '#f00';
                default:
                    return '#f00';
            }
        });
    };

    return (
        <>
            <div className='separator' />
            <h1>Cards</h1>
            <div className='separator' />
            <div className='card-container'>
                {['#060', '#900', '#0c0', '#990', '#999'].map((color, index) => (
                    <div
                        key={index}
                        className='card'
                        style={{
                            backgroundColor: color,
                            color: 'white',
                        }}
                    >
                        {Object.values(playerCards[props.activePlayerColor].resource)[index]}
                    </div>
                ))}
            </div>
            <div className='card-container'>
                <div className='card'>0</div>
                <div className='card'>0</div>
                <div className='card'>0</div>
                <div className='card'>0</div>
                <div className='card'>0</div>
            </div>
            <div className='separator' />
            <button>Buy development card</button>
            <button>Trade</button>
            <div className='separator' />
            <button onClick={(event) => onRoll(event)}>Roll</button>
            <br />
            <button onClick={(event) => endTurn(event)}>End Turn</button>
            <div className='separator' />
            <button onClick={() => props.setPanel('leaderboard')}>Leaderboard</button>
        </>
    );
}
