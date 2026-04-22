// Бот для мессенджера eXpress
// Обработчик команд для погоды и помощи

class WeatherBot {
    constructor() {
        this.commands = {
            'погода': this.getWeather.bind(this),
            'help': this.showHelp.bind(this),
            'команды': this.showCommands.bind(this)
        };
        
        // Города, для которых доступна информация о погоде
        this.cities = [
            'Екатеринбург',
            'Самара', 
            'Саратов',
            'Нижний Новгород',
            'Оренбург',
            'Уральск'
        ];
    }

    // Основной метод обработки сообщений
    async handleMessage(message) {
        const text = message.text.trim().toLowerCase();
        
        // Поиск соответствующей команды
        for (const [command, handler] of Object.entries(this.commands)) {
            if (text.includes(command.toLowerCase())) {
                return await handler(message);
            }
        }
        
        return this.getDefaultResponse();
    }

    // Обработчик для команды погоды
    async getWeather(message) {
        const text = message.text;
        
        // Поиск города в сообщении
        for (const city of this.cities) {
            if (text.includes(city)) {
                return await this.fetchWeather(city);
            }
        }
        
        return `Я могу показать погоду в следующих городах: ${this.cities.join(', ')}\nПример: "погода Екатеринбург"`;
    }

    // Метод для получения погоды (заглушка - в реальности нужно интегрировать с API погоды)
    async fetchWeather(city) {
    const apiKey = require('./config').openWeatherApiKey;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=ru&units=metric`;

    try {
        const axios = require('axios');
        const response = await axios.get(url);

        const data = response.data;
        const temp = Math.round(data.main.temp);
        const feelsLike = Math.round(data.main.feels_like);
        const description = data.weather[0].description;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;

        return (
            `Погода в ${city}:\n` +
            `🌡 Температура: ${temp}°C (ощущается как ${feelsLike}°C)\n` +
            `📝 ${description.charAt(0).toUpperCase() + description.slice(1)}\n` +
            `💧 Влажность: ${humidity}%\n` +
            `💨 Ветер: ${windSpeed} м/с`
        );
    } catch (error) {
        if (error.response?.status === 404) {
            return `❌ Город "${city}" не найден. Проверьте название.`;
        }
        console.error('OpenWeather API error:', error.message);
        return `⚠️ Не удалось получить данные о погоде. Попробуйте позже.`;
    }
}

    // Обработчик команды помощи
    async showHelp() {
        return this.getHelpText();
    }

    // Обработчик команды списков всех команд
    async showCommands() {
        return this.getHelpText();
    }

    // Текст помощи
    getHelpText() {
        return `Доступные команды бота:\n\n` +
               `• погода [город] - узнать погоду в городе\n` +
               `• help - показать это сообщение\n` +
               `• команды - показать список всех команд\n\n` +
               `Доступные города: ${this.cities.join(', ')}`;
    }

    // Ответ по умолчанию
    getDefaultResponse() {
        return `Я не понял вашу команду. Напишите 'help' для получения списка доступных команд.`;
    }
}

module.exports = WeatherBot;