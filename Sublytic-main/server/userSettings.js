// userSettings.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('./middleware/authMiddleware'); // Assuming this exists

// This is a simple in-memory store. Replace this with your database logic.
const userSettingsStore = {};

// GET /api/user/settings - Fetch user notification settings
router.get('/settings', authMiddleware, (req, res) => {
    const username = req.user.username;
    // Retrieve settings from the store or a database
    const settings = userSettingsStore[username] || {
        notifyBeforeRenewal: false,
        notifyOnAddRemove: false,
        notifyOnCostIncrease: false,
        sendMonthlySummary: false
    };
    res.json(settings);
});

// PUT /api/user/settings - Update user notification settings
router.put('/settings', authMiddleware, (req, res) => {
    const username = req.user.username;
    const {
        notifyBeforeRenewal,
        notifyOnAddRemove,
        notifyOnCostIncrease,
        sendMonthlySummary
    } = req.body;

    // Update the settings in the store or a database
    userSettingsStore[username] = {
        notifyBeforeRenewal,
        notifyOnAddRemove,
        notifyOnCostIncrease,
        sendMonthlySummary
    };

    console.log(`User ${username} updated notification settings.`);
    res.status(200).json({ message: 'Settings saved successfully' });
});

module.exports = router;