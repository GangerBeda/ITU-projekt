const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/', (req, res) => {
    res.send('Got a POST request');
});

app.post('/api/gameObj', (req, res) => {
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

app.get('/api/gameObj', (req, res) => {
    fs.readFile('db/gameObj.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file', err);
            return res.status(500).json({ message: 'Failed to read gameObj' });
        }

        res.status(200).json(JSON.parse(data));
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
