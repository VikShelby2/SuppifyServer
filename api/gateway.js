const express = require('express');

const storeData = {}; // In-memory storage

// Server to send/store the store ID (port 8080)
const sendApp = express();
sendApp.use(express.json());

sendApp.post('/sendStoreId', (req, res) => {
    const { location, storeId } = req.body;

    if (!location || !storeId) {
        return res.status(400).json({ error: "Both location and storeId are required" });
    }

    storeData[location] = storeId; // Store the data
    res.json({ message: `Stored storeId ${storeId} for location ${location}` });
});

sendApp.listen(8080, () => {
    console.log("Send Server running on port 8080...");
});

// Server to get the store ID (port 5001)
const getApp = express();

getApp.get('/getStoreId/:location', (req, res) => {
    const location = req.params.location;
    const storeId = storeData[location];

    if (!storeId) {
        return res.status(404).json({ error: "Store ID not found for this location" });
    }

    res.json({ location, storeId });
});

getApp.listen(5001, () => {
    console.log("Get Server running on port 5001...");
});
