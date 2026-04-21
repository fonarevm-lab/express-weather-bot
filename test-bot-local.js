// test-bot-local.js — тест логики бота без сервера
const WeatherBot = require('./bot');

async function runTests() {
    const bot = new WeatherBot();

    console.log('Тест 1: /start');
    console.log(await bot.handleMessage({ text: '/start' }));

    console.log('\nТест 2: привет');
    console.log(await bot.handleMessage({ text: 'привет' }));

    console.log('\nТест 3: погода Екатеринбург');
    console.log(await bot.handleMessage({ text: 'погода Екатеринбург' }));

    console.log('\nТест 4: help');
    console.log(await bot.handleMessage({ text: 'help' }));
}

runTests().catch(console.error);