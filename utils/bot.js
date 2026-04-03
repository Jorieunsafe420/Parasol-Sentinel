const { Telegraf } = require('telegraf');

/**
 * Creates and returns a Telegraf bot instance.
 * Centralized here to handle missing tokens gracefully and avoid duplicate initialization code.
 */
const getBot = () => {
    const token = process.env.TG_TOKEN;
    if (!token) {
        console.warn('WARNING: TG_TOKEN is missing. Bot functionality will be disabled.');
        // Return a mock-like object or just let Telegraf handle it, 
        // but we'll use a guard in the handlers.
        return new Telegraf('dummy_token'); 
    }
    return new Telegraf(token);
};

module.exports = getBot;
