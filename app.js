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
        const body = req.body;
        console.log('📥 Получен полный запрос:', body);

        const text = body?.command?.body?.trim();

        if (!text) {
            console.log('❌ Нет текста в запросе');
            return res.status(400).json({ error: 'No message text found' });
        }

        const message = {
            text: text,
            userId: body.from?.user_huid,
            username: body.from?.username
        };

        console.log('📝 Обрабатываем команду:', text);

        const responseText = await bot.handleMessage(message);

        let response;
        if (typeof responseText === 'object' && responseText.text) {
            response = responseText;
        } else {
            response = { text: responseText };
        }

        console.log('📤 Отправляем ответ:', response);
		res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.json(response);

    } catch (error) {
        console.error('❌ Ошибка сервера:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Маршрут для проверки работоспособности
app.get('/test', (req, res) => {
    res.json({ text: "Тест работает!" });
});

// Запуск сервера
app.listen(config.port, config.host, () => {
    console.log(`Weather bot server is running on http://${config.host}:${config.port}`);
    console.log(`Webhook URL: ${config.apiUrl}/webhook`);
});

// Экспорт приложения для тестирования
module.exports = app;