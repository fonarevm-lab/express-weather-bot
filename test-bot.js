// Тестовый скрипт для отправки сообщения боту

const axios = require('axios');
const config = require('./config');

// Функция для отправки тестового сообщения
async function sendTestMessage() {
    try {
        // Пример сообщения от пользователя
        const message = {
            text: 'погода Екатеринбург',
            userId: 'test_user_123',
            timestamp: new Date().toISOString()
        };

        console.log('Отправка тестового сообщения:', message.text);
        
        // Отправка POST запроса на вебхук бота
        const response = await axios.post(`http://${config.host}:${config.port}/webhook`, message);
        
        console.log('Ответ от бота:', response.data.text);
        
    } catch (error) {
        if (error.response) {
            console.error('Ошибка от сервера:', error.response.status, error.response.data);
        } else if (error.request) {
            console.error('Нет ответа от сервера. Убедитесь, что бот запущен.');
            console.error('Запустите бота командой: npm start');
        } else {
            console.error('Ошибка:', error.message);
        }
    }
}

// Запуск теста
sendTestMessage();