require('dotenv').config();
const connectDB = require('../utils/db');
const User = require('../models/User');
const { generateSignature } = require('../utils/helpers');

/**
 * PATCH /api/settings?user=ID&sig=SIG
 * Body: { wind: 'ms'|'kmh', pressure: 'mmhg'|'hpa' }
 * 
 * Saves unit preferences for a user. Called from the website settings panel.
 * Protected by the same HMAC signature as weather-data.js.
 */
module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'PATCH' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await connectDB();

        const { user: userId, sig } = req.query;
        const SECRET = process.env.CRON_SECRET;

        if (!userId) {
            return res.status(400).json({ error: 'Missing user parameter' });
        }

        // Verify signature
        const expectedSig = generateSignature(userId, SECRET);
        if (!sig || sig !== expectedSig) {
            return res.status(401).json({ error: 'Unauthorized: invalid signature' });
        }

        const { wind, pressure } = req.body || {};

        // Validate values
        const validWind = ['ms', 'kmh'];
        const validPressure = ['mmhg', 'hpa'];

        const updateFields = {};
        if (wind && validWind.includes(wind)) updateFields['units.wind'] = wind;
        if (pressure && validPressure.includes(pressure)) updateFields['units.pressure'] = pressure;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: 'No valid settings provided' });
        }

        await User.updateOne(
            { telegramId: Number(userId) },
            { $set: updateFields }
        );

        return res.status(200).json({ ok: true, updated: updateFields });
    } catch (error) {
        console.error('Settings Error:', error.message);
        return res.status(500).json({ error: 'Failed to save settings' });
    }
};
