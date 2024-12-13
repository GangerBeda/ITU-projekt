import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/catan/player');
                setPlayerCards(response.data.playerCards);
                props.setActivePlayerColor(response.data.activePlayerColor);
            } catch (err) {
                try {
                    await axios.post('http://localhost:3001/catan/init', {});

                    const response = await axios.get('http://localhost:3001/catan/player');
                    setPlayerCards(response.data.playerCards);
                    props.setActivePlayerColor(response.data.activePlayerColor);
                } catch (initErr) {
                    console.error('Initialization failed:', initErr);
                }
            }
        };

        fetchPlayerData();
    }, [props.activePlayerColor, props.gameState]);

    const checkResources = async () => {
        try {
            const response = await axios.get('http://localhost:3001/catan/player');
            const resources = response.data.playerCards[response.data.activePlayerColor].resource;

            if (resources.sheep < 1 || resources.wheat < 1 || resources.ore < 1) {
                alert('Not enough resources, 1 sheep, 1 wheat & 1 ore required'); // TODO: change to something fancy
                return true;
            }

            setPlayerCards((prevPlayerCards) => {
                const updatedPlayerData = {
                    ...prevPlayerCards[props.activePlayerColor],
                    resource: {
                        ...prevPlayerCards[props.activePlayerColor].resource,
                        sheep: prevPlayerCards[props.activePlayerColor].resource.sheep - 1,
                        wheat: prevPlayerCards[props.activePlayerColor].resource.wheat - 1,
                        ore: prevPlayerCards[props.activePlayerColor].resource.ore - 1,
                    },
                };

                axios
                    .post('http://localhost:3001/catan/updatePlayer', {
                        playerCards: {
                            ...prevPlayerCards,
                            [props.activePlayerColor]: updatedPlayerData,
                        },
                        activePlayerColor: props.activePlayerColor,
                    })
                    .catch((error) => {
                        console.log(error);
                    });

                return {
                    ...prevPlayerCards,
                    [props.activePlayerColor]: updatedPlayerData,
                };
            });
        } catch (error) {
            console.error('Error fetching player data:', error);
        }
        return false;
    };

    const onBuy = (event) => {
        checkResources().then((ret) => {
            if (ret) {
                return;
            }

            let devCard = Math.floor((Math.random() * 10000) % 25);
            // 14x - knight         0-13
            // 5x - VP              14-18
            // 2x - road building   19-20
            // 2x - year of plenty  21-22
            // 2x - monopoly        23-24

            if (devCard < 14) {
                setPlayerCards((prevPlayerCards) => {
                    const updatedPlayerData = {
                        ...prevPlayerCards[props.activePlayerColor],
                        development: {
                            ...prevPlayerCards[props.activePlayerColor].development,
                            knight: prevPlayerCards[props.activePlayerColor].development.knight + 1,
                        },
                    };

                    axios
                        .post('http://localhost:3001/catan/updatePlayer', {
                            playerCards: {
                                ...prevPlayerCards,
                                [props.activePlayerColor]: updatedPlayerData,
                            },
                            activePlayerColor: props.activePlayerColor,
                        })
                        .catch((error) => {
                            console.log(error);
                        });

                    return {
                        ...prevPlayerCards,
                        [props.activePlayerColor]: updatedPlayerData,
                    };
                });
            } else if (devCard < 19) {
                setPlayerCards((prevPlayerCards) => {
                    const updatedPlayerData = {
                        ...prevPlayerCards[props.activePlayerColor],
                        development: {
                            ...prevPlayerCards[props.activePlayerColor].development,
                            road_building: prevPlayerCards[props.activePlayerColor].development.road_building + 1,
                        },
                    };

                    axios
                        .post('http://localhost:3001/catan/updatePlayer', {
                            playerCards: {
                                ...prevPlayerCards,
                                [props.activePlayerColor]: updatedPlayerData,
                            },
                            activePlayerColor: props.activePlayerColor,
                        })
                        .catch((error) => {
                            console.log(error);
                        });

                    return {
                        ...prevPlayerCards,
                        [props.activePlayerColor]: updatedPlayerData,
                    };
                });
            } else if (devCard < 21) {
                setPlayerCards((prevPlayerCards) => {
                    const updatedPlayerData = {
                        ...prevPlayerCards[props.activePlayerColor],
                        development: {
                            ...prevPlayerCards[props.activePlayerColor].development,
                            year_of_plenty: prevPlayerCards[props.activePlayerColor].development.year_of_plenty + 1,
                        },
                    };

                    axios
                        .post('http://localhost:3001/catan/updatePlayer', {
                            playerCards: {
                                ...prevPlayerCards,
                                [props.activePlayerColor]: updatedPlayerData,
                            },
                            activePlayerColor: props.activePlayerColor,
                        })
                        .catch((error) => {
                            console.log(error);
                        });

                    return {
                        ...prevPlayerCards,
                        [props.activePlayerColor]: updatedPlayerData,
                    };
                });
            } else if (devCard < 23) {
                setPlayerCards((prevPlayerCards) => {
                    const updatedPlayerData = {
                        ...prevPlayerCards[props.activePlayerColor],
                        development: {
                            ...prevPlayerCards[props.activePlayerColor].development,
                            monopoly: prevPlayerCards[props.activePlayerColor].development.monopoly + 1,
                        },
                    };

                    axios
                        .post('http://localhost:3001/catan/updatePlayer', {
                            playerCards: {
                                ...prevPlayerCards,
                                [props.activePlayerColor]: updatedPlayerData,
                            },
                            activePlayerColor: props.activePlayerColor,
                        })
                        .catch((error) => {
                            console.log(error);
                        });

                    return {
                        ...prevPlayerCards,
                        [props.activePlayerColor]: updatedPlayerData,
                    };
                });
            } else {
                setPlayerCards((prevPlayerCards) => {
                    const updatedPlayerData = {
                        ...prevPlayerCards[props.activePlayerColor],
                        development: {
                            ...prevPlayerCards[props.activePlayerColor].development,
                            victory_point: prevPlayerCards[props.activePlayerColor].development.victory_point + 1,
                        },
                    };

                    axios
                        .post('http://localhost:3001/catan/updatePlayer', {
                            playerCards: {
                                ...prevPlayerCards,
                                [props.activePlayerColor]: updatedPlayerData,
                            },
                            activePlayerColor: props.activePlayerColor,
                        })
                        .catch((error) => {
                            console.log(error);
                        });

                    return {
                        ...prevPlayerCards,
                        [props.activePlayerColor]: updatedPlayerData,
                    };
                });
            }
        });
    };

    const onRoll = (event) => {
        event.preventDefault();

        if (props.gameState.text !== 'Rolling dice') {
            return;
        }

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

                                    axios
                                        .post('http://localhost:3001/catan/updatePlayer', {
                                            playerCards: { ...prevPlayerCards, [color]: updatedPlayerData },
                                            activePlayerColor: props.activePlayerColor,
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        });

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

        props.setGameState({ text: 'Playing', phase: props.gameState.phase });
    };

    const endTurn = (event) => {
        event.preventDefault();

        if (props.gameState.text !== 'Ending turn' && props.gameState.text !== 'Playing') {
            return;
        }

        const nextColor = (prevColor) => {
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
        };

        const updatedColor = nextColor(props.activePlayerColor);

        props.setActivePlayerColor(updatedColor);

        axios
            .post('http://localhost:3001/catan/updatePlayer', {
                playerCards: playerCards,
                activePlayerColor: updatedColor,
            })
            .catch((error) => {
                console.log(error);
            });

        if (props.gameState.text === 'Ending turn') {
            if (props.gameState.phase === 1 && props.activePlayerColor === '#ff0') {
                props.setGameState({ text: 'Rolling dice', phase: props.activePlayerColor === '#ff0' ? props.gameState.phase + 1 : props.gameState.phase });
            } else if (props.gameState.phase < 2) {
                props.setGameState({ text: 'Placing settler', phase: props.activePlayerColor === '#ff0' ? props.gameState.phase + 1 : props.gameState.phase });
            } else {
                props.setGameState({ text: 'Rolling dice', phase: props.gameState.phase });
            }
        } else {
            props.setGameState({ text: 'Rolling dice', phase: props.gameState.phase });
        }
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
                <div className='card'>{playerCards[props.activePlayerColor].development.knight}</div>
                <div className='card'>{playerCards[props.activePlayerColor].development.road_building}</div>
                <div className='card'>{playerCards[props.activePlayerColor].development.year_of_plenty}</div>
                <div className='card'>{playerCards[props.activePlayerColor].development.monopoly}</div>
                <div className='card'>{playerCards[props.activePlayerColor].development.victory_point}</div>
            </div>
            <div className='separator' />
            <button onClick={(event) => onBuy(event)}>Buy development card</button>
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
