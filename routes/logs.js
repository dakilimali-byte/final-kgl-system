const express = require('express');
const router = express.Router();
const Log = require('../models/log');

// This gets the latest 50 logs for the dashboard
router.get('/', async (req, res) => {
    try {
        const logs = await Log.find().sort({ timestamp: -1 }).limit(50);
        res.status(200).json(logs);
    } catch (err) {
        res.status(500).json({ message: "Error fetching logs" });
    }
});

module.exports = router;