const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());


// Middleware
app.use(bodyParser.json());

let localData = {
    moisture: null,
    temperature: null,
    humidity: null,
};

let sensorRanges = {
    moisture: { min: '0', max: '100' },
    temperature: { min: '0', max: '100' },
    humidity: { min: '0', max: '100' },
};

// Route to handle GET requests
app.get('/sensor-data', (req, res) => {
    const { moisture, temperature, humidity } = req.query;

    if (moisture || temperature || humidity) {
        // Update localData if parameters are provided
        if (moisture) localData.moisture = parseFloat(moisture);
        if (temperature) localData.temperature = parseFloat(temperature);
        if (humidity) localData.humidity = parseFloat(humidity);

        console.log("Data updated:", localData);

        res.json({ message: 'Data updated successfully', updatedData: localData });
    } else {
        // Return the most recent values if no parameters are provided
        console.log("Returning most recent data:", localData);
        res.json( localData );
    }
});
  
// Endpoint for React Native app to update sensor ranges
app.post('/update-sensor-ranges', (req, res) => {
    const { moisture, temperature, humidity } = req.body;

    if (!moisture || !temperature || !humidity) {
        return res.status(400).send(
            { error: 'All sensor ranges are required (moisture, temperature, humidity)' });
    }

    sensorRanges = { moisture, temperature, humidity };
    res.status(200).send({ message: 'Sensor ranges updated successfully' });
});

// Endpoint for ESP32 to fetch sensor ranges
app.get('/sensor-ranges', (req, res) => {
    res.status(200).json(sensorRanges);
});


// Listen on 0.0.0.0 to accept requests from other devices on the same network
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
