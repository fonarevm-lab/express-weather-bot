// Основное приложение для бота eXpress

const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const WeatherBot = require('./bot');

// Создание экземпляра бота
const bot = new WeatherBot();

// Создание Express приложения
const app = express();

// Middleware для парсинга JSON тела запросов
app.use(bodyParser.json());

// Эндпоинт для вебхука бота
app.post('/webhook', async (req, res) => {
    try {
        // Получение данных сообщения
        const message = req.body;
        
        // Проверка наличия текста сообщения
        if (!message || !message.text) {
            return res.status(400).json({ error: 'Invalid message format' });
        }
        
        // Обработка сообщения ботом
        const responseText = await bot.handleMessage(message);
        
        // Формирование ответа
        const response = {
            text: responseText,
            // Здесь могут быть дополнительные параметры в зависимости от API eXpress
        };
        
        // Отправка ответа
        res.json(response);
        
    } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Маршрут для проверки работоспособности
app.get('/', (req, res) => {
    res.send('Weather Bot is running!');
});

// Запуск сервера
app.listen(config.port, config.host, () => {
    console.log(`Weather bot server is running on http://${config.host}:${config.port}`);
    console.log(`Webhook URL: ${config.apiUrl}/webhook`);
});

// Экспорт приложения для тестирования
module.exports = app;