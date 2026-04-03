// Combined cron handler — calls cron-check and cron-forecast as separate HTTP requests
// to avoid the double-response bug that occurs when handlers share the same res object.
const axios = require('axios');
const { formatUrl } = require('../utils/helpers');

module.exports = async (req, res) => {
    // Security check
    const secret = process.env.CRON_SECRET;
    if (req.headers['authorization'] !== `Bearer ${secret}`) return res.status(401).send('Unauthorized');

    const baseUrl = formatUrl(process.env.DOMAIN);
    const headers = { Authorization: `Bearer ${secret}` };

    try {
        console.log('Running combined cron job...');

        // Call each endpoint independently so each gets its own request/response cycle
        const [checkRes, forecastRes] = await Promise.allSettled([
            axios.get(`${baseUrl}/api/cron-check`, { headers }),
            axios.get(`${baseUrl}/api/cron-forecast`, { headers })
        ]);

        const checkStatus = checkRes.status === 'fulfilled' ? checkRes.value.data : checkRes.reason?.message;
        const forecastStatus = forecastRes.status === 'fulfilled' ? forecastRes.value.data : forecastRes.reason?.message;

        console.log('cron-check:', checkStatus);
        console.log('cron-forecast:', forecastStatus);

        res.status(200).json({ check: checkStatus, forecast: forecastStatus });
    } catch (error) {
        console.error('Combined Cron Error:', error.message);
        res.status(500).send('Internal Server Error');
    }
}

