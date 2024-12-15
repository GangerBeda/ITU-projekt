const express = require('express');
const cors = require('cors');
const fs = require('fs');

const bodyParser = require('body-parser');
const { Chess } = require('chess.js');
const ClassicTicTacToe = require('./models/ClassicTicTacToe');
const UltimateTicTacToe = require('./models/UltimateTicTacToe');
const Score = require('./models/Score');

const { FourInARowModel } = require('../src/games/FourInARow/models/FourInARowModel');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/', (req, res) => {
    res.send('Got a POST request');
});

// settlers of catan
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

app.post('/catan/build', (req, res) => {
    const receivedObject = req.body;

    fs.writeFile('db/gameObj.json', JSON.stringify(receivedObject, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file', err);
            return res.status(500).json({ message: 'Failed to save gameObj' });
        }

        res.status(201).json({
            message: 'Object received and saved successfully',
            data: receivedObject,
        });
    });
});

app.get('/catan/state', (req, res) => {
    fs.readFile('db/gameObj.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file', err);
            return res.status(500).json({ message: 'Failed to read gameObj' });
        }

        res.status(200).json(JSON.parse(data));
    });
});

app.post('/catan/init', (req, res) => {
    shuffle();
    let json =
        '{"hexColors":{"path-0":"#222","material-0":"#222","settler-0":"#222","path-1":"#222","material-1":"#222","settler-1":"#222","path-2":"#222","material-2":"#222","settler-2":"#222","path-3":"#222","material-3":"#222","settler-3":"#222","path-4":"#222","material-4":"#222","settler-4":"#222","path-5":"#222","material-5":"#222","settler-5":"#222","path-6":"#222","material-6":"#222","settler-6":"#222","path-7":"#222","material-7":"#222","settler-7":"#222","path-8":"#222","material-8":"#222","settler-8":"#222","path-9":"#222","material-9":"#222","settler-9":"#222","path-10":"#222","material-10":"#222","settler-10":"#222","path-11":"#222","material-11":"#222","settler-11":"#222","path-12":"#222","material-12":"#222","settler-12":"#222","path-13":"#222","material-13":"#222","settler-13":"#222","path-14":"#222","material-14":"#222","settler-14":"#222","path-15":"#222","material-15":"#222","settler-15":"#222","path-16":"#222","material-16":"#222","settler-16":"#222","path-17":"#222","material-17":"#222","settler-17":"#222","path-18":"#222","material-18":"#222","settler-18":"#222","path-19":"#222","material-19":"#222","settler-19":"#222","path-20":"#222","material-20":"#222","settler-20":"#222","path-21":"#222","material-21":"#222","settler-21":"#222","path-22":"#222","material-22":"#222","settler-22":"#222","path-23":"#222","material-23":"#222","settler-23":"#222","path-24":"#222","material-24":"#222","settler-24":"#222","path-25":"#222","material-25":"#222","settler-25":"#222","path-26":"#222","material-26":"#222","settler-26":"#222","path-27":"#222","material-27":"#222","settler-27":"#222","path-28":"#222","material-28":"#222","settler-28":"#222","path-29":"#222","material-29":"#222","settler-29":"#222","path-30":"#222","material-30":"#222","settler-30":"#222","path-31":"#222","material-31":"#222","settler-31":"#222","path-32":"#222","material-32":"#222","settler-32":"#222","path-33":"#222","material-33":"#222","settler-33":"#222","path-34":"#222","material-34":"#222","settler-34":"#222","path-35":"#222","material-35":"#222","settler-35":"#222","path-36":"#222","material-36":"#222","settler-36":"#222","path-37":"#222","material-37":"#222","settler-37":"#222","path-38":"#222","material-38":"#222","settler-38":"#222","path-39":"#222","material-39":"#222","settler-39":"#222","path-40":"#222","material-40":"#222","settler-40":"#222","path-41":"#222","material-41":"#222","settler-41":"#222","path-42":"#222","material-42":"#222","settler-42":"#222","path-43":"#222","material-43":"#222","settler-43":"#222","path-44":"#222","material-44":"#222","settler-44":"#222","path-45":"#222","material-45":"#222","settler-45":"#222","path-46":"#222","material-46":"#222","settler-46":"#222","path-47":"#222","material-47":"#222","settler-47":"#222","path-48":"#222","material-48":"#222","settler-48":"#222","path-49":"#222","material-49":"#222","settler-49":"#222","path-50":"#222","material-50":"#222","settler-50":"#222","path-51":"#222","material-51":"#222","settler-51":"#222","path-52":"#222","material-52":"#222","settler-52":"#222","path-53":"#222","material-53":"#222","settler-53":"#222","path-54":"#222","material-54":"#222","settler-54":"#222","path-55":"#222","material-55":"#222","settler-55":"#222","path-56":"#222","material-56":"#222","settler-56":"#222","path-57":"#222","material-57":"#222","settler-57":"#222","path-58":"#222","material-58":"#222","settler-58":"#222","path-59":"#222","material-59":"#222","settler-59":"#222","path-60":"#222","material-60":"#222","settler-60":"#222","path-61":"#222","material-61":"#222","settler-61":"#222","path-62":"#222","material-62":"#222","settler-62":"#222","path-63":"#222","material-63":"#222","settler-63":"#222","path-64":"#222","material-64":"#222","settler-64":"#222","path-65":"#222","material-65":"#222","settler-65":"#222","path-66":"#222","material-66":"#222","settler-66":"#222","path-67":"#222","material-67":"#222","settler-67":"#222","path-68":"#222","material-68":"#222","settler-68":"#222","path-69":"#222","material-69":"#222","settler-69":"#222","path-70":"#222","material-70":"#222","settler-70":"#222","path-71":"#222","material-71":"#222","settler-71":"#222","path-72":"#222","material-72":"#222","settler-72":"#222","path-73":"#222","material-73":"#222","settler-73":"#222","path-74":"#222","material-74":"#222","settler-74":"#222","path-75":"#222","material-75":"#222","settler-75":"#222","path-76":"#222","material-76":"#222","settler-76":"#222","path-77":"#222","material-77":"#222","settler-77":"#222","path-78":"#222","material-78":"#222","settler-78":"#222","path-79":"#222","material-79":"#222","settler-79":"#222","path-80":"#222","material-80":"#222","settler-80":"#222","path-81":"#222","material-81":"#222","settler-81":"#222","path-82":"#222","material-82":"#222","settler-82":"#222","path-83":"#222","material-83":"#222","settler-83":"#222","path-84":"#222","material-84":"#222","settler-84":"#222","path-85":"#222","material-85":"#222","settler-85":"#222","path-86":"#222","material-86":"#222","settler-86":"#222","path-87":"#222","material-87":"#222","settler-87":"#222","path-88":"#222","material-88":"#222","settler-88":"#222","path-89":"#222","material-89":"#222","settler-89":"#222","path-90":"#222","material-90":"#222","settler-90":"#222","path-91":"#222","material-91":"#222","settler-91":"#222","path-92":"#222","material-92":"#222","settler-92":"#222","path-93":"#222","material-93":"#222","settler-93":"#222","path-94":"#222","material-94":"#222","settler-94":"#222","path-95":"#222","material-95":"#222","settler-95":"#222","path-96":"#222","material-96":"#222","settler-96":"#222","path-97":"#222","material-97":"#222","settler-97":"#222","path-98":"#222","material-98":"#222","settler-98":"#222","path-99":"#222","material-99":"#222","settler-99":"#222"},"hexHoverColors":{"path-0":"#555","material-0":"#555","settler-0":"#555","path-1":"#555","material-1":"#555","settler-1":"#555","path-2":"#555","material-2":"#555","settler-2":"#555","path-3":"#555","material-3":"#555","settler-3":"#555","path-4":"#555","material-4":"#555","settler-4":"#555","path-5":"#555","material-5":"#555","settler-5":"#555","path-6":"#555","material-6":"#555","settler-6":"#555","path-7":"#555","material-7":"#555","settler-7":"#555","path-8":"#555","material-8":"#555","settler-8":"#555","path-9":"#555","material-9":"#555","settler-9":"#555","path-10":"#555","material-10":"#555","settler-10":"#555","path-11":"#555","material-11":"#555","settler-11":"#555","path-12":"#555","material-12":"#555","settler-12":"#555","path-13":"#555","material-13":"#555","settler-13":"#555","path-14":"#555","material-14":"#555","settler-14":"#555","path-15":"#555","material-15":"#555","settler-15":"#555","path-16":"#555","material-16":"#555","settler-16":"#555","path-17":"#555","material-17":"#555","settler-17":"#555","path-18":"#555","material-18":"#555","settler-18":"#555","path-19":"#555","material-19":"#555","settler-19":"#555","path-20":"#555","material-20":"#555","settler-20":"#555","path-21":"#555","material-21":"#555","settler-21":"#555","path-22":"#555","material-22":"#555","settler-22":"#555","path-23":"#555","material-23":"#555","settler-23":"#555","path-24":"#555","material-24":"#555","settler-24":"#555","path-25":"#555","material-25":"#555","settler-25":"#555","path-26":"#555","material-26":"#555","settler-26":"#555","path-27":"#555","material-27":"#555","settler-27":"#555","path-28":"#555","material-28":"#555","settler-28":"#555","path-29":"#555","material-29":"#555","settler-29":"#555","path-30":"#555","material-30":"#555","settler-30":"#555","path-31":"#555","material-31":"#555","settler-31":"#555","path-32":"#555","material-32":"#555","settler-32":"#555","path-33":"#555","material-33":"#555","settler-33":"#555","path-34":"#555","material-34":"#555","settler-34":"#555","path-35":"#555","material-35":"#555","settler-35":"#555","path-36":"#555","material-36":"#555","settler-36":"#555","path-37":"#555","material-37":"#555","settler-37":"#555","path-38":"#555","material-38":"#555","settler-38":"#555","path-39":"#555","material-39":"#555","settler-39":"#555","path-40":"#555","material-40":"#555","settler-40":"#555","path-41":"#555","material-41":"#555","settler-41":"#555","path-42":"#555","material-42":"#555","settler-42":"#555","path-43":"#555","material-43":"#555","settler-43":"#555","path-44":"#555","material-44":"#555","settler-44":"#555","path-45":"#555","material-45":"#555","settler-45":"#555","path-46":"#555","material-46":"#555","settler-46":"#555","path-47":"#555","material-47":"#555","settler-47":"#555","path-48":"#555","material-48":"#555","settler-48":"#555","path-49":"#555","material-49":"#555","settler-49":"#555","path-50":"#555","material-50":"#555","settler-50":"#555","path-51":"#555","material-51":"#555","settler-51":"#555","path-52":"#555","material-52":"#555","settler-52":"#555","path-53":"#555","material-53":"#555","settler-53":"#555","path-54":"#555","material-54":"#555","settler-54":"#555","path-55":"#555","material-55":"#555","settler-55":"#555","path-56":"#555","material-56":"#555","settler-56":"#555","path-57":"#555","material-57":"#555","settler-57":"#555","path-58":"#555","material-58":"#555","settler-58":"#555","path-59":"#555","material-59":"#555","settler-59":"#555","path-60":"#555","material-60":"#555","settler-60":"#555","path-61":"#555","material-61":"#555","settler-61":"#555","path-62":"#555","material-62":"#555","settler-62":"#555","path-63":"#555","material-63":"#555","settler-63":"#555","path-64":"#555","material-64":"#555","settler-64":"#555","path-65":"#555","material-65":"#555","settler-65":"#555","path-66":"#555","material-66":"#555","settler-66":"#555","path-67":"#555","material-67":"#555","settler-67":"#555","path-68":"#555","material-68":"#555","settler-68":"#555","path-69":"#555","material-69":"#555","settler-69":"#555","path-70":"#555","material-70":"#555","settler-70":"#555","path-71":"#555","material-71":"#555","settler-71":"#555","path-72":"#555","material-72":"#555","settler-72":"#555","path-73":"#555","material-73":"#555","settler-73":"#555","path-74":"#555","material-74":"#555","settler-74":"#555","path-75":"#555","material-75":"#555","settler-75":"#555","path-76":"#555","material-76":"#555","settler-76":"#555","path-77":"#555","material-77":"#555","settler-77":"#555","path-78":"#555","material-78":"#555","settler-78":"#555","path-79":"#555","material-79":"#555","settler-79":"#555","path-80":"#555","material-80":"#555","settler-80":"#555","path-81":"#555","material-81":"#555","settler-81":"#555","path-82":"#555","material-82":"#555","settler-82":"#555","path-83":"#555","material-83":"#555","settler-83":"#555","path-84":"#555","material-84":"#555","settler-84":"#555","path-85":"#555","material-85":"#555","settler-85":"#555","path-86":"#555","material-86":"#555","settler-86":"#555","path-87":"#555","material-87":"#555","settler-87":"#555","path-88":"#555","material-88":"#555","settler-88":"#555","path-89":"#555","material-89":"#555","settler-89":"#555","path-90":"#555","material-90":"#555","settler-90":"#555","path-91":"#555","material-91":"#555","settler-91":"#555","path-92":"#555","material-92":"#555","settler-92":"#555","path-93":"#555","material-93":"#555","settler-93":"#555","path-94":"#555","material-94":"#555","settler-94":"#555","path-95":"#555","material-95":"#555","settler-95":"#555","path-96":"#555","material-96":"#555","settler-96":"#555","path-97":"#555","material-97":"#555","settler-97":"#555","path-98":"#555","material-98":"#555","settler-98":"#555","path-99":"#555","material-99":"#555","settler-99":"#555"}}';
    let jsonObject = JSON.parse(json);
    jsonObject.materialTypes = materialTypes;
    jsonObject.numberTokens = numberTokens;

    fs.writeFile('db/gameObj.json', JSON.stringify(jsonObject, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file', err);
            return res.status(500).json({ message: 'Failed to save gameObj' });
        }
    });

    fs.writeFile(
        'db/playerObj.json',
        `{"playerCards":{"#f00":{"resource":{"wood":0,"brick":0,"sheep":0,"wheat":0,"ore":0},"development":{"knight":0,"road_building":0,"year_of_plenty":0,"monopoly":0,"victory_point":0}},"#00f":{"resource":{"wood":0,"brick":0,"sheep":0,"wheat":0,"ore":0},"development":{"knight":0,"road_building":0,"year_of_plenty":0,"monopoly":0,"victory_point":0}},"#0f0":{"resource":{"wood":0,"brick":0,"sheep":0,"wheat":0,"ore":0},"development":{"knight":0,"road_building":0,"year_of_plenty":0,"monopoly":0,"victory_point":0}},"#ff0":{"resource":{"wood":0,"brick":0,"sheep":0,"wheat":0,"ore":0},"development":{"knight":0,"road_building":0,"year_of_plenty":0,"monopoly":0,"victory_point":0}}},"activePlayerColor":"#f00"}`,
        (err) => {
            if (err) {
                console.error('Error writing to file', err);
                return res.status(500).json({ message: 'Failed to save playerObj' });
            }
        }
    );

    fs.writeFile('db/gameState.json', '{"gameState": { "text": "Placing settler", "phase": 0 }}', (err) => {
        if (err) {
            console.error('Error writing to file', err);
            return res.status(500).json({ message: 'Failed to save gameState' });
        }
    });

    fs.writeFile(
        'db/extraPoints.json',
        '{"roads": {"most_roads": null,"#f00": 2,"#0f0": 2,"#00f": 2,"#ff0": 2},"army": {"largest_army": null,"#f00": 0,"#0f0": 0,"#00f": 0,"#ff0": 0}}',
        (err) => {
            if (err) {
                console.error('Error writing to file', err);
                return res.status(500).json({ message: 'Failed to save gameState' });
            }
        }
    );

    res.status(201).json({
        message: 'Init successful',
    });
});

app.post('/catan/updatePlayer', (req, res) => {
    const playerData = req.body;

    if (!playerData.playerCards) {
        fs.readFile('db/playerObj.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file', err);
                return res.status(500).json({ message: 'Failed to read playerObj' });
            }

            const existingData = JSON.parse(data);
            playerData.playerCards = existingData.playerCards;

            fs.writeFile('db/playerObj.json', JSON.stringify(playerData, null, 2), (err) => {
                if (err) {
                    console.error('Error writing to file', err);
                    return res.status(500).json({ message: 'Failed to save playerObj' });
                }

                res.status(201).json({
                    message: 'Player object received and saved successfully',
                    data: playerData,
                });
            });
        });
    } else {
        fs.writeFile('db/playerObj.json', JSON.stringify(playerData, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file', err);
                return res.status(500).json({ message: 'Failed to save playerObj' });
            }

            res.status(201).json({
                message: 'Player object received and saved successfully',
                data: playerData,
            });
        });
    }
});

app.get('/catan/player', (req, res) => {
    fs.readFile('db/playerObj.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file', err);
            return res.status(500).json({ message: 'Failed to read playerObj' });
        }

        res.status(200).json(JSON.parse(data));
    });
});

app.post('/catan/buildRoad', (req, res) => {
    fs.readFile('db/playerObj.json', 'utf8', (err, playerData) => {
        if (err) {
            console.error('Error reading playerObj:', err);
            return res.status(500).json({ message: 'Failed to read playerObj' });
        }

        try {
            const playerObj = JSON.parse(playerData);
            const activePlayerColor = playerObj.activePlayerColor;

            if (!activePlayerColor || !playerObj.playerCards[activePlayerColor]) {
                return res.status(404).json({ message: 'Active player not found' });
            }

            const activePlayer = playerObj.playerCards[activePlayerColor];

            if (activePlayer.resource.brick < 1 || activePlayer.resource.wood < 1) {
                return res.status(400).json({ message: 'Not enough resources to build a road' });
            }

            activePlayer.resource.brick -= 1;
            activePlayer.resource.wood -= 1;

            playerObj.playerCards[activePlayerColor] = activePlayer;

            fs.writeFile('db/playerObj.json', JSON.stringify(playerObj, null, 2), (err) => {
                if (err) {
                    console.error('Error writing playerObj:', err);
                    return res.status(500).json({ message: 'Failed to save playerObj' });
                }

                fs.readFile('db/extraPoints.json', 'utf8', (err, extraPointsData) => {
                    if (err) {
                        console.error('Error reading extraPoints:', err);
                        return res.status(500).json({ message: 'Failed to read extraPoints' });
                    }

                    try {
                        const extraPoints = JSON.parse(extraPointsData);

                        if (extraPoints.roads && extraPoints.roads[activePlayerColor] !== undefined) {
                            extraPoints.roads[activePlayerColor] += 1;
                        } else {
                            return res.status(404).json({ message: 'Roads data for active player not found' });
                        }

                        // Calculate longest road
                        let maxRoads = -1;
                        let longestRoadPlayer = extraPoints.roads.most_roads;

                        for (const [color, count] of Object.entries(extraPoints.roads)) {
                            if (color === 'most_roads') continue;

                            if (count > maxRoads) {
                                maxRoads = count;
                                longestRoadPlayer = color;
                            } else if (count === maxRoads && longestRoadPlayer === color) {
                                // Preserve current most_roads if there's a tie
                                longestRoadPlayer = extraPoints.roads.most_roads;
                            }
                        }

                        extraPoints.roads.most_roads = longestRoadPlayer;

                        fs.writeFile('db/extraPoints.json', JSON.stringify(extraPoints, null, 2), (err) => {
                            if (err) {
                                console.error('Error writing extraPoints:', err);
                                return res.status(500).json({ message: 'Failed to save extraPoints' });
                            }

                            res.status(201).json({
                                message: 'Road built successfully',
                                player: activePlayer,
                                roads: extraPoints.roads[activePlayerColor],
                                longestRoad: extraPoints.roads.most_roads,
                            });
                        });
                    } catch (parseError) {
                        console.error('Error parsing extraPoints:', parseError);
                        return res.status(500).json({ message: 'Failed to parse extraPoints' });
                    }
                });
            });
        } catch (parseError) {
            console.error('Error parsing playerObj:', parseError);
            return res.status(500).json({ message: 'Failed to parse playerObj' });
        }
    });
});

app.post('/catan/buildSettleman', (req, res) => {
    fs.readFile('db/playerObj.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ message: 'Failed to read playerObj' });
        }

        try {
            const playerData = JSON.parse(data);

            const activePlayerColor = playerData.activePlayerColor;
            if (!activePlayerColor || !playerData.playerCards[activePlayerColor]) {
                return res.status(404).json({ message: 'Active player not found' });
            }

            const activePlayer = playerData.playerCards[activePlayerColor];

            if (activePlayer.resource.brick < 1 || activePlayer.resource.wood < 1 || activePlayer.resource.wheat < 1 || activePlayer.resource.sheep < 1) {
                return res.status(400).json({ message: 'Not enough resources to build a settleman' });
            }

            activePlayer.resource.brick -= 1;
            activePlayer.resource.wood -= 1;
            activePlayer.resource.wheat -= 1;
            activePlayer.resource.sheep -= 1;

            playerData.playerCards[activePlayerColor] = activePlayer;

            fs.writeFile('db/playerObj.json', JSON.stringify(playerData, null, 2), (err) => {
                if (err) {
                    console.error('Error writing to file:', err);
                    return res.status(500).json({ message: 'Failed to save playerObj' });
                }

                res.status(201).json({
                    message: 'Settleman built successfully',
                    player: activePlayer,
                });
            });
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).json({ message: 'Failed to parse playerObj' });
        }
    });
});

app.post('/catan/gameState', (req, res) => {
    const receivedObject = req.body;

    fs.writeFile('db/gameState.json', JSON.stringify(receivedObject, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file', err);
            return res.status(500).json({ message: 'Failed to save gameState' });
        }

        res.status(201).json({
            message: 'Object received and saved successfully',
            data: receivedObject,
        });
    });
});

app.get('/catan/gameState', (req, res) => {
    fs.readFile('db/gameState.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file', err);
            return res.status(500).json({ message: 'Failed to read gameState' });
        }

        res.status(200).json(JSON.parse(data));
    });
});

app.get('/catan/extraPoints', (req, res) => {
    fs.readFile('db/extraPoints.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file', err);
            return res.status(500).json({ message: 'Failed to read extraPoints' });
        }

        res.status(200).json(JSON.parse(data));
    });
});

app.post('/catan/moveRobber', (req, res) => {
    const { color } = req.body;

    if (!color) {
        return res.status(400).json({ message: 'Color is required in the request body.' });
    }

    fs.readFile('db/extraPoints.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading extraPoints.json:', err);
            return res.status(500).json({ message: 'Failed to read extraPoints.json' });
        }

        try {
            const extraPoints = JSON.parse(data);

            if (!extraPoints.army || extraPoints.army[color] === undefined) {
                return res.status(404).json({ message: `Color ${color} not found in army.` });
            }

            extraPoints.army[color] += 1;

            const armyCounts = Object.entries(extraPoints.army).filter(([key]) => key !== 'largest_army');
            let maxArmy = -1;
            let largestArmyColor = extraPoints.army.largest_army;

            for (const [playerColor, count] of armyCounts) {
                if (count > maxArmy) {
                    maxArmy = count;
                    largestArmyColor = playerColor;
                } else if (count === maxArmy && largestArmyColor === playerColor) {
                    largestArmyColor = extraPoints.army.largest_army;
                }
            }

            extraPoints.army.largest_army = largestArmyColor;

            fs.writeFile('db/extraPoints.json', JSON.stringify(extraPoints, null, 2), (err) => {
                if (err) {
                    console.error('Error writing to extraPoints.json:', err);
                    return res.status(500).json({ message: 'Failed to save extraPoints.json' });
                }

                res.status(200).json({
                    message: 'Robber moved successfully',
                    updatedArmy: extraPoints.army,
                });
            });
        } catch (parseError) {
            console.error('Error parsing extraPoints.json:', parseError);
            return res.status(500).json({ message: 'Failed to parse extraPoints.json' });
        }
    });
});

app.post('/catan/roadBuilding', (req, res) => {
    fs.readFile('db/playerObj.json', 'utf8', (err, playerData) => {
        if (err) {
            console.error('Error reading playerObj:', err);
            return res.status(500).json({ message: 'Failed to read playerObj' });
        }

        try {
            const playerObj = JSON.parse(playerData);
            const activePlayerColor = playerObj.activePlayerColor;

            if (!activePlayerColor || !playerObj.playerCards[activePlayerColor]) {
                return res.status(404).json({ message: 'Active player not found' });
            }

            fs.readFile('db/extraPoints.json', 'utf8', (err, extraPointsData) => {
                if (err) {
                    console.error('Error reading extraPoints:', err);
                    return res.status(500).json({ message: 'Failed to read extraPoints' });
                }

                try {
                    const extraPoints = JSON.parse(extraPointsData);

                    if (extraPoints.roads && extraPoints.roads[activePlayerColor] !== undefined) {
                        extraPoints.roads[activePlayerColor] += 2;
                    } else {
                        return res.status(404).json({ message: 'Roads data for active player not found' });
                    }

                    let maxRoads = -1;
                    let longestRoadPlayer = extraPoints.roads.most_roads;

                    for (const [color, count] of Object.entries(extraPoints.roads)) {
                        if (color === 'most_roads') continue;

                        if (count > maxRoads) {
                            maxRoads = count;
                            longestRoadPlayer = color;
                        } else if (count === maxRoads && longestRoadPlayer === color) {
                            longestRoadPlayer = extraPoints.roads.most_roads;
                        }
                    }

                    extraPoints.roads.most_roads = longestRoadPlayer;

                    fs.writeFile('db/extraPoints.json', JSON.stringify(extraPoints, null, 2), (err) => {
                        if (err) {
                            console.error('Error writing extraPoints:', err);
                            return res.status(500).json({ message: 'Failed to save extraPoints' });
                        }

                        res.status(201).json({
                            message: 'Road building successful',
                            roads: extraPoints.roads[activePlayerColor],
                            longestRoad: extraPoints.roads.most_roads,
                        });
                    });
                } catch (parseError) {
                    console.error('Error parsing extraPoints:', parseError);
                    return res.status(500).json({ message: 'Failed to parse extraPoints' });
                }
            });
        } catch (parseError) {
            console.error('Error parsing playerObj:', parseError);
            return res.status(500).json({ message: 'Failed to parse playerObj' });
        }
    });
});

// CHESS
/*
 * In-memory storage for active chess game.
 * Key: gameId (string)
 * Value: ChessGameState instance
 */
const chessGame = new Map();

/**
 * GameState Class for Chess
 *
 * Represents the state of a single chess game, including the chess instance,
 * game mode (timed or untimed), time limits, move history, and game status.
 */
class ChessGameState {
    /**
     * Constructs a new ChessGameState instance.
     *
     * @param {string} mode - The game mode ('timed' or 'untimed')
     * @param {number|null} timeLimit - The time limit per player in minutes (if timed)
     */
    constructor(mode, timeLimit = null) {
        this.chess = new Chess(); // Initialize chess.js instance
        this.gameMode = mode; // Set game mode
        this.timeLimit = timeLimit; // Set time limit
        this.moveHistory = []; // Initialize move history
        this.startTime = Date.now(); // Record game start time
        this.remainingTimeWhite = timeLimit ? timeLimit * 60 * 1000 : null; // Remaining time for White
        this.remainingTimeBlack = timeLimit ? timeLimit * 60 * 1000 : null; // Remaining time for Black
        this.lastMoveTime = null; // Initialize as null to indicate game hasn't started
        this.gameStarted = false; // Flag to track if game has started
        this.winner = null; // Track game winner
        this.gameOver = false; // Flag to indicate if the game is over
    }

    /**
     * Updates the remaining time for the current player based on elapsed time.
     * If time runs out, sets the winner accordingly and marks the game as over.
     */
    updateTime() {
        if (this.gameMode === 'timed' && this.gameStarted) {
            const currentTime = Date.now();

            // Only update time if last move time exists (game has started)
            if (this.lastMoveTime) {
                const timePassed = currentTime - this.lastMoveTime;

                if (this.chess.turn() === 'w') {
                    this.remainingTimeWhite = Math.max(0, this.remainingTimeWhite - timePassed);
                    if (this.remainingTimeWhite === 0) {
                        this.winner = 'black'; // Black wins if White runs out of time
                        this.gameOver = true;
                    }
                } else {
                    this.remainingTimeBlack = Math.max(0, this.remainingTimeBlack - timePassed);
                    if (this.remainingTimeBlack === 0) {
                        this.winner = 'white'; // White wins if Black runs out of time
                        this.gameOver = true;
                    }
                }
            }

            this.lastMoveTime = currentTime; // Update the last move time to current
        }
    }

    /**
     * Checks if the chess game has ended due to checkmate, draw, stalemate, or insufficient material.
     * Updates the game state accordingly.
     */
    checkGameEnd() {
        if (this.chess.isCheckmate()) {
            this.winner = this.chess.turn() === 'w' ? 'black' : 'white'; // Opposite player wins
            this.gameOver = true;
        } else if (this.chess.isDraw() || this.chess.isStalemate() || this.chess.isInsufficientMaterial()) {
            this.winner = 'draw'; // Game is a draw
            this.gameOver = true;
        }
    }
}

/* ============================
   Chess Game Routes
   ============================ */

/**
 * Route: POST /chess/start
 *
 * Starts a new chess game by creating a new ChessGameState instance and storing it.
 *
 * Request Body:
 * - mode: 'timed' or 'untimed'
 * - timeLimit: number (minutes) or null
 *
 * Response:
 * - gameId: string
 * - fen: string (Forsyth-Edwards Notation)
 * - turn: 'w' or 'b'
 * - gameMode: string
 * - remainingTimeWhite: number|null (milliseconds)
 * - remainingTimeBlack: number|null (milliseconds)
 */
app.post('/chess/start', (req, res) => {
    const { mode, timeLimit } = req.body; // Extract mode and timeLimit from request
    const gameId = Date.now().toString(); // Generate a unique gameId based on current timestamp
    const game = new ChessGameState(mode, timeLimit); // Create a new ChessGameState instance
    chessGame.set(gameId, game); // Store the game in the in-memory Map

    // Respond with initial game state
    res.json({
        gameId,
        fen: game.chess.fen(),
        turn: game.chess.turn(),
        gameMode: game.gameMode,
        remainingTimeWhite: game.remainingTimeWhite,
        remainingTimeBlack: game.remainingTimeBlack,
    });
});

/**
 * Route: POST /chess/move
 *
 * Processes a move made by a player in a specific chess game.
 *
 * Request Body:
 * - gameId: string
 * - from: string (source square, e.g., 'e2')
 * - to: string (target square, e.g., 'e4')
 * - promotion: string|null (piece to promote to, e.g., 'q')
 *
 * Response:
 * - fen: string (updated FEN)
 * - turn: 'w' or 'b'
 * - isCheck: boolean
 * - isCheckmate: boolean
 * - isDraw: boolean
 * - moveHistory: array of move objects
 * - remainingTimeWhite: number|null (milliseconds)
 * - remainingTimeBlack: number|null (milliseconds)
 * - winner: string|null ('white', 'black', 'draw')
 * - gameStarted: boolean
 * - gameOver: boolean
 */
app.post('/chess/move', (req, res) => {
    const { gameId, from, to, promotion } = req.body; // Extract move details from request

    const game = chessGame.get(gameId); // Retrieve the game state

    if (!game) {
        return res.status(404).json({ error: 'Game not found' }); // Handle invalid gameId
    }

    if (game.gameOver) {
        return res.status(400).json({ error: 'Game is already over' }); // Prevent moves if game is over
    }

    if (!game.gameStarted) {
        game.gameStarted = true; // Mark game as started on first move
    }

    game.updateTime(); // Update remaining time based on elapsed time
    if (game.gameOver) {
        return res.status(400).json({ error: `Game over: ${game.winner} wins` }); // Handle game over after time update
    }

    try {
        let move;

        if (promotion) {
            move = game.chess.move({ from, to, promotion }); // Handle pawn promotion
        } else {
            move = game.chess.move({ from, to }); // Handle regular move
        }

        if (!game.gameStarted && game.chess.turn() === 'b') {
            game.gameStarted = true; // Ensure gameStarted is true after first move
            game.lastMoveTime = Date.now(); // Set lastMoveTime to current timestamp
        }

        game.moveHistory.push(move); // Add move to history
        game.checkGameEnd(); // Check if the move ended the game

        // Prepare response with updated game state
        const response = {
            fen: game.chess.fen(),
            turn: game.chess.turn(),
            isCheck: game.chess.isCheck(),
            isCheckmate: game.chess.isCheckmate(),
            isDraw: game.chess.isDraw(),
            moveHistory: game.moveHistory,
            remainingTimeWhite: game.remainingTimeWhite,
            remainingTimeBlack: game.remainingTimeBlack,
            winner: game.winner,
            gameStarted: game.gameStarted,
            gameOver: game.gameOver,
        };

        res.json(response); // Send response to the client
    } catch (error) {
        res.status(400).json({ error: 'Illegal move. Try again.' }); // Handle invalid moves
    }
});

/**
 * Route: POST /chess/save
 *
 * Saves the current state of a chess game.
 *
 * Request Body:
 * - gameId: string
 *
 * Response:
 * - savedState: object containing the game's FEN, mode, time limits, move history, and remaining times
 */
app.post('/chess/save', (req, res) => {
    const { gameId } = req.body; // Extract gameId from request
    const game = chessGame.get(gameId); // Retrieve the game state

    if (!game) {
        return res.status(404).json({ error: 'Game not found' }); // Handle invalid gameId
    }

    const savedState = {
        fen: game.chess.fen(), // Current board state in FEN
        gameMode: game.gameMode, // Game mode ('timed' or 'untimed')
        timeLimit: game.timeLimit, // Time limit per player (if timed)
        moveHistory: game.moveHistory, // History of moves made
        remainingTimeWhite: game.remainingTimeWhite, // Remaining time for White
        remainingTimeBlack: game.remainingTimeBlack, // Remaining time for Black
    };

    res.json({ savedState }); // Send saved state to the client
});

/**
 * Route: POST /chess/load
 *
 * Loads a previously saved chess game state.
 *
 * Request Body:
 * - savedState: object containing the game's FEN, mode, time limits, move history, and remaining times
 *
 * Response:
 * - gameId: string
 * - fen: string (Forsyth-Edwards Notation)
 * - turn: 'w' or 'b'
 * - gameMode: string
 * - moveHistory: array of move objects
 * - remainingTimeWhite: number|null (milliseconds)
 * - remainingTimeBlack: number|null (milliseconds)
 */
app.post('/chess/load', (req, res) => {
    const { savedState } = req.body; // Extract savedState from request
    const gameId = Date.now().toString(); // Generate a unique gameId based on current timestamp
    const game = new ChessGameState(savedState.gameMode, savedState.timeLimit); // Create a new ChessGameState instance with saved settings

    game.chess.load(savedState.fen); // Load the FEN into the chess.js instance
    game.moveHistory = savedState.moveHistory; // Restore move history
    game.remainingTimeWhite = savedState.remainingTimeWhite; // Restore White's remaining time
    game.remainingTimeBlack = savedState.remainingTimeBlack; // Restore Black's remaining time

    chessGame.set(gameId, game); // Store the loaded game in the in-memory Map

    // Respond with the loaded game state
    res.json({
        gameId,
        fen: game.chess.fen(),
        turn: game.chess.turn(),
        gameMode: game.gameMode,
        moveHistory: game.moveHistory,
        remainingTimeWhite: game.remainingTimeWhite,
        remainingTimeBlack: game.remainingTimeBlack,
    });
});

/**
 * Route: POST /chess/exit
 *
 * Exits and removes a chess game from the server.
 *
 * Request Body:
 * - gameId: string
 *
 * Response:
 * - success: boolean
 */
app.post('/chess/exit', (req, res) => {
    const { gameId } = req.body; // Extract gameId from request
    chessGame.delete(gameId); // Remove the game from the in-memory Map
    res.json({ success: true }); // Confirm successful deletion
});

// ======================================== TIC TAC TOE START ========================================

const score = new Score();
const gamesTTT = {
    classic: null,
    ultimate: null,
};

function calculateWinner(board) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (const [a, b, c] of winningCombinations) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function validateClassicMove(game, cellIndex) {
    return !game.winner && !game.board[cellIndex];
}

function validateUltimateMove(game, subBoardIndex, cellIndex) {
    return !game.mainBoard[subBoardIndex] && !game.subBoards[subBoardIndex][cellIndex];
}

app.post('/tictactoe/new-classic-game', (req, res) => {
    gamesTTT.classic = new ClassicTicTacToe();
    res.json({ board: gamesTTT.classic.board, isXNext: gamesTTT.classic.isXNext });
});

app.post('/tictactoe/classic-game/move', (req, res) => {
    const { cellIndex } = req.body;
    const game = gamesTTT.classic;

    if (!game || !validateClassicMove(game, cellIndex)) {
        return res.json({
            board: game.board,
            isXNext: game.isXNext,
            winner: game.winner,
        });
    }

    game.board[cellIndex] = game.isXNext ? 'X' : 'O';
    game.isXNext = !game.isXNext;
    game.winner = calculateWinner(game.board);

    if (game.winner) {
        score.scores[game.winner]++;
    }

    res.json({
        board: game.board,
        isXNext: game.isXNext,
        winner: game.winner,
    });
});

app.post('/tictactoe/new-ultimate-game', (req, res) => {
    gamesTTT.ultimate = new UltimateTicTacToe();
    res.json({
        subBoards: gamesTTT.ultimate.subBoards,
        mainBoard: gamesTTT.ultimate.mainBoard,
        isXNext: gamesTTT.ultimate.isXNext,
        blindMode: gamesTTT.ultimate.blindMode,
        activeSubBoard: gamesTTT.ultimate.activeSubBoard,
    });
});

app.post('/tictactoe/ultimate-game/move', (req, res) => {
    const { subBoardIndex, cellIndex, blindMode } = req.body;
    const game = gamesTTT.ultimate;

    if (blindMode !== null) {
        if (subBoardIndex === null && cellIndex === null) {
            game.blindMode = !blindMode;
            return res.json({
                subBoards: game.subBoards,
                mainBoard: game.mainBoard,
                isXNext: game.isXNext,
                activeSubBoard: game.activeSubBoard,
                blindMode: game.blindMode,
                winner: game.winner,
            });
        }
    }

    if (!game || !validateUltimateMove(game, subBoardIndex, cellIndex)) {
        console.log('INVALID');
        return res.json({
            subBoards: game.subBoards,
            mainBoard: game.mainBoard,
            isXNext: game.isXNext,
            activeSubBoard: game.activeSubBoard,
            blindMode: game.blindMode,
            winner: game.winner,
        });
    }

    game.subBoards[subBoardIndex][cellIndex] = game.isXNext ? 'X' : 'O';
    game.isXNext = !game.isXNext;


    const subBoardWinner = calculateWinner(game.subBoards[subBoardIndex]);
    if (subBoardWinner) {
        game.mainBoard[subBoardIndex] = subBoardWinner;
    }

    game.winner = calculateWinner(game.mainBoard);
    game.activeSubBoard = subBoardWinner ? null : cellIndex;

    if (game.mainBoard[cellIndex] != null) {
        console.log('ACTIVE SUB');
        return res.json({
            subBoards: game.subBoards,
            mainBoard: game.mainBoard,
            isXNext: game.isXNext,
            activeSubBoard: null,
            blindMode: game.blindMode,
            winner: game.winner,
        });
    }


    if (game.winner) {
        score.scores[game.winner]++;
    }

    res.json({
        subBoards: game.subBoards,
        mainBoard: game.mainBoard,
        isXNext: game.isXNext,
        activeSubBoard: game.activeSubBoard,
        blindMode: game.blindMode,
        winner: game.winner,
    });
});

app.get('/tictactoe/get-score', (req, res) => {
    res.json(score.scores);
});

app.post('/tictactoe/set-score', (req, res) => {
    const { player, wins } = req.body;

    if ((player !== 'X' && player !== 'O') || wins < 0) return res.status(400).send('Invalid input');

    score.scores[player] = wins;
    res.json(score.scores);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
// ======================================== TIC TAC TOE END ========================================
// 4 in a Row
const gameModel = new FourInARowModel(); // vytvoření instance modelu

//  ADDED vrací aktuální stav hry, po refreshi
app.get('/fourinarow/current-state', (req, res) => {
    res.status(200).json(gameModel.getState());
});

app.post('/fourinarow/makeMove', (req, res) => {
    const { column } = req.body;

    if (typeof column !== 'number' || column < 0 || column > 6) {
        return res.status(400).json({ message: 'Invalid column' });
    }

    const moveResult = gameModel.makeMove(column);
    if (moveResult) {
        res.status(200).json(gameModel.getState());
    } else {
        res.status(400).json({ message: 'Column is full or game is over' });
    }
});
app.post('/fourinarow/new-game', (req, res) => {
    gameModel.resetGame(); // volá resetovací metodu ve vašem modelu
    res.status(200).json(gameModel.getState()); // vrátí aktualizovaný stav hry
});
app.post('/fourinarow/reset', (req, res) => {
    gameModel.resetGame(); // volá resetovací metodu ve vašem modelu
    res.status(200).json(gameModel.getState()); // vrátí aktualizovaný stav hry
});
app.post('/fourinarow/undo', (req, res) => {
    gameModel.undo();
    res.status(200).json(gameModel.getState());
});
app.post('/fourinarow/settings', (req, res) => {
    const options = req.body;
    gameModel.settings(options);
    res.status(200).json(gameModel.getState());
});
app.post('/fourinarow/set-time', (req, res) => {
    const { timeLimit } = req.body;

    if (typeof timeLimit !== 'number' || timeLimit <= 0) {
        console.error('Invalid time limit:', timeLimit); // Přidejte log
        return res.status(400).json({ message: 'Invalid time limit' });
    }

    try {
        gameModel.setTimeLimit(timeLimit);
        console.log('Server updated time limit:', gameModel.getState());
        res.status(200).json(gameModel.getState());
    } catch (error) {
        console.error('Error setting time limit on server:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
//ADDED TO
app.post('/fourinarow/timer-toggle', (req, res) => {
    gameModel.timerToggle(); // Call the method on the server-side model
    res.status(200).json(gameModel.getState());
});

// ======================================== BLACKJACK START ========================================

function initializeDeck() {
    const suits = ['♠', '♣', '♥', '♦'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    return shuffleDeck(deck);
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function calculateHandValue(hand) {
    let value = 0;
    let aceCount = 0;

    for (let card of hand) {
        if (card.value === 'A') {
            aceCount++;
            value += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            value += 10;
        } else {
            value += parseInt(card.value);
        }
    }

    while (value > 21 && aceCount > 0) {
        value -= 10;
        aceCount--;
    }

    return value;
}

app.post('/blackjack/start', (req, res) => {
    const deck = initializeDeck();
    const playerHand = [deck.pop(), deck.pop()];
    const dealerHand = [deck.pop(), deck.pop()];
    
    const dealerValue = calculateHandValue(dealerHand);
    const playerValue = calculateHandValue(playerHand);

    res.json({ deck, playerHand, dealerHand, playerValue, dealerValue });
});

console.log('test 2');

app.post('/blackjack/hit', (req, res) => {
    const { deck, playerHand } = req.body;

    if (deck.length > 0) {
        playerHand.push(deck.pop());
        const playerValue = calculateHandValue(playerHand);

        if (playerValue > 21) {
            return res.json({ playerHand, deck, playerValue, message: 'Player busts! Dealer wins.', gameOver: true });
        }
        
        res.json({ playerHand, deck, playerValue });
    } else {
        res.status(400).json({ message: 'No cards left in deck' });
    }
});

app.post('/blackjack/stand', (req, res) => {
    const { deck, dealerHand, playerHand } = req.body;

    while (calculateHandValue(dealerHand) < 17 && deck.length > 0) {
        dealerHand.push(deck.pop());
    }

    const dealerValue = calculateHandValue(dealerHand);
    const playerValue = calculateHandValue(playerHand);
    let result;

    if (dealerValue > 21 || playerValue > dealerValue) {
        result = 'Player wins!';
    } else if (dealerValue === playerValue) {
        result = "It's a tie!";
    } else {
        result = 'Dealer wins!';
    }

    res.json({ dealerHand, deck, message: result, gameOver: true , playerValue, dealerValue});
});

// ======================================== BLACKJACK END ========================================
