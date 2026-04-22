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
        console.log('📥 Получен запрос от eXpress:', JSON.stringify(body, null, 2));

        const text = body?.command?.body?.trim();

        if (!text) {
            console.log('❌ Нет текста в команде');
            return res.status(400).json({ error: 'No message text found in command.body' });
        }

        const message = {
            text: text,
            userId: body.from?.user_huid,
            username: body.from?.username
        };

        console.log('📝 Обрабатываем команду:', text);

        const responseText = await bot.handleMessage(message);

        // Формируем ответ
        const botResponse = typeof responseText === 'object' && responseText.text
            ? responseText.text
            : responseText;

        const keyboard = (typeof responseText === 'object' && responseText.keyboard)
            ? responseText.keyboard
            : undefined;

        const finalResponse = {
            text: botResponse,
            ...(keyboard && { keyboard })
        };

        const wrappedResponse = {
            status: "success",
            message: botResponse,
            response: finalResponse,
            data: finalResponse
        };

        console.log('📤 Отправляем ОБЕРНУТЫЙ ответ:', JSON.stringify(wrappedResponse, null, 2));

        res.status(200)
          .setHeader('Content-Type', 'application/json; charset=utf-8')
          .send(wrappedResponse);

    } catch (error) {
        console.error('❌ Ошибка сервера:', error.stack);
        res.status(500).json({
            status: "error",
            error: 'Internal server error'
        });
    }
});

// РЕЗЕРВНЫЙ ЭНДПОИНТ — на случай, если eXpress шлёт на корень
app.post('/', async (req, res) => {
    console.log('⚠️ Получен POST на / — перенаправляем как /webhook');
    // Просто вызываем тот же обработчик
    return app.routes['/webhook'].stack[0].handle(req, res); // ← не совсем точно, поэтому дублируем
});

// Но безопаснее — дублировать логику
app.post('/', async (req, res) => {
    try {
        const body = req.body;
        console.log('📥 [ROOT] Получен запрос:', JSON.stringify(body, null, 2));

        const text = body?.command?.body?.trim();
        if (!text) {
            return res.status(400).json({ error: 'No message text' });
        }

        const message = { text };
        const responseText = await bot.handleMessage(message);
        const finalResponse = typeof responseText === 'object' && responseText.text
            ? responseText
            : { text: responseText };

        console.log('📤 [ROOT] Ответ:', JSON.stringify(finalResponse, null, 2));
        res
            .status(200)
            .setHeader('Content-Type', 'application/json; charset=utf-8')
            .send(finalResponse);

    } catch (error) {
        console.error('❌ [ROOT] Ошибка:', error.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Маршрут для проверки работоспособности
app.get('/', (req, res) => {
    res.send('Weather Bot is running!');
});

// Тестовый эндпоинт
app.get('/test', (req, res) => {
    res.json({ text: "Тест работает!" });
});

// Запуск сервера
app.listen(config.port, config.host, () => {
    console.log(`Weather bot server is running on http://${config.host}:${config.port}`);
    console.log(`Webhook URL: ${config.apiUrl}/webhook`);
    console.log(`Test URL: ${config.apiUrl}/test`);
});

// Экспорт приложения для тестирования
module.exports = app;