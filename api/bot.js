const { Telegraf } = require('telegraf');
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

const connectDB = require('../utils/db');

if (!process.env.TG_TOKEN) {
    console.error('CRITICAL ERROR: TG_TOKEN is missing in environment variables!');
}

const bot = new Telegraf(process.env.TG_TOKEN || 'dummy-token');

const dict = {
    uk: {
        welcome: "👋 Вітаю! Мене звати **Парасоль**.\n\nЯ буду моніторити погоду у твоєму місті та надсилатиму сповіщення про різкі зміни.\n\nНапиши назву свого міста (англійською або кирилицею):",
        select: "🔎 Оберіть правильний варіант з переліку:",
        notFound: "❌ Не можу знайти таке місто. Спробуйте уточнити (наприклад, додайте область).",
        errorSearch: "❌ Сталася помилка при пошуку. Спробуйте пізніше.",
        citySet: "Місто {city} встановлено!",
        citySetFull: "✅ **Місто встановлено:** {city}\n🌐 Координати: {lat}, {lon}\n🌡️ Поточна температура: {temp}°C",
        dashboard: "📊 Мій Дашборд",
        saveError: "❌ Не вдалося зберегти вибір. Перевірте конфігурацію сервера."
    },
    en: {
        welcome: "👋 Hello! My name is **Parasol**.\n\nI will monitor the weather in your city and send alerts about sudden changes.\n\nPlease type the name of your city:",
        select: "🔎 Choose the correct option from the list:",
        notFound: "❌ Cannot find this city. Please try to be more specific (e.g. add region/state).",
        errorSearch: "❌ Search error occurred. Please try again later.",
        citySet: "City {city} is set!",
        citySetFull: "✅ **City set:** {city}\n🌐 Coordinates: {lat}, {lon}\n🌡️ Current temperature: {temp}°C",
        dashboard: "📊 My Dashboard",
        saveError: "❌ Failed to save. Please check server configuration."
    }
};

const getLang = (ctx) => (ctx.from?.language_code === 'uk' || ctx.from?.language_code === 'ru') ? 'uk' : 'en';

// Bot Logic (Webhook handler)
module.exports = async (req, res) => {
    try {
        if (!process.env.TG_TOKEN) {
            return res.status(500).send('TG_TOKEN is missing');
        }

        await connectDB();

        // Handle Webhook request
        if (req.method === 'POST') {
            console.log('--- Incoming Telegram Update ---');
            console.log(JSON.stringify(req.body, null, 2));
            await bot.handleUpdate(req.body);
            res.status(200).send('OK');
        } else {
            console.log('GET request received on bot API');
            res.status(200).send('Bot is running...');
        }
    } catch (e) {
        console.error('Handler Error:', e.message);
        console.error(e.stack);
        res.status(500).send(`Error: ${e.message}`);
    }
}

// /start command
bot.start(async (ctx) => {
    console.log('Start command from:', ctx.from.id);
    const lang = getLang(ctx);
    await ctx.replyWithMarkdown(dict[lang].welcome);
});

// Handle text messages (City search)
bot.on('text', async (ctx) => {
    const query = ctx.message.text.trim();
    if (query.startsWith('/')) return;
    const lang = getLang(ctx);

    try {
        console.log(`Searching for: ${query}`);
        // Using Nominatim for better search with multiple results
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&accept-language=${lang}`;
        const response = await axios.get(nominatimUrl, {
            headers: { 'User-Agent': 'WeatherSentinelBot/1.0' }
        });

        if (response.data && response.data.length > 0) {
            const buttons = response.data.map(item => {
                const name = item.display_name.split(',').slice(0, 3).join(',');
                // Store coordinates and city name in callback data (limited to 64 chars)
                // We'll use a short format: lat|lon|city_name
                const callbackData = `set|${item.lat}|${item.lon}|${item.address.city || item.address.town || item.address.village || query.slice(0, 15)}`;
                return [{ text: name, callback_data: callbackData.slice(0, 64) }];
            });

            await ctx.reply(dict[lang].select, {
                reply_markup: { inline_keyboard: buttons }
            });
        } else {
            await ctx.reply(dict[lang].notFound);
        }
    } catch (error) {
        console.error('Search Error:', error.message);
        await ctx.reply(dict[lang].errorSearch);
    }
});

// Handle button clicks
bot.on('callback_query', async (ctx) => {
    const data = ctx.callbackQuery.data.split('|');
    if (data[0] === 'set') {
        const [_, lat, lon, cityName] = data;
        const lang = getLang(ctx);

        try {
            await connectDB();

            // Validate and get initial weather from Weatherbit using coordinates
            const weatherbitUrl = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${process.env.WEATHERBIT_KEY}`;
            const weatherRes = await axios.get(weatherbitUrl);
            const weather = weatherRes.data.data[0];

            await User.findOneAndUpdate(
                { telegramId: ctx.from.id },
                {
                    username: ctx.from.username,
                    city: weather.city_name,
                    lat: parseFloat(lat),
                    lon: parseFloat(lon),
                    timezone: weather.timezone,
                    lastState: {
                        temp: weather.temp,
                        weatherCode: weather.weather.code,
                        updatedAt: new Date()
                    }
                },
                { upsert: true, new: true }
            );

            const domain = process.env.DOMAIN || 'localhost';
            const dashboardUrl = `${domain.startsWith('http') ? '' : 'https://'}${domain}/?user=${ctx.from.id}`;

            await ctx.answerCbQuery(dict[lang].citySet.replace('{city}', weather.city_name));
            await ctx.editMessageText(dict[lang].citySetFull.replace('{city}', weather.city_name).replace('{lat}', lat).replace('{lon}', lon).replace('{temp}', weather.temp), {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: dict[lang].dashboard, url: dashboardUrl }]
                    ]
                }
            });
        } catch (error) {
            console.error('Save Error:', error.message);
            await ctx.reply(dict[lang].saveError);
        }
    }
});
