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
        // Здесь должна быть интеграция с API погоды
        // Пока используем заглушку с примером данных
        const weatherData = {
            'Екатеринбург': '🌤 Температура: +18°C, без осадков',
            'Самара': '⛅ Температура: +20°C, переменная облачность',
            'Саратов': '☀️ Температура: +22°C, ясно',
            'Нижний Новгород': '🌦 Температура: +16°C, возможен дождь',
            'Оренбург': '🌤 Температура: +19°C, малооблачно',
            'Уральск': '⛅ Температура: +17°C, облачно'
        };
        
        return `Погода в ${city}: ${weatherData[city] || 'данные недоступны'}`;
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