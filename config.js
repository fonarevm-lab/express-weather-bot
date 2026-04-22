// Конфигурация бота для мессенджера eXpress

module.exports = {
    // ID бота
    botId: '02d7e033-77b1-5a35-8a12-eb06e1a9e6da',
    
    // Секретный ключ бота
    secretKey: '1508a005299203f288e54a824f94d267',
    
    // URL API бота
    apiUrl: process.env.API_URL ||  'https://bot-hostname.com/api/v1/botx_trello',
    
    // Порт для вебхука (можно изменить при необходимости)
    port: process.env.PORT || 3000,
    
    // Хост для вебхука
    host: '0.0.0.0',
	openWeatherApiKey: process.env.OPENWEATHER_API_KEY || '7f51631b20322cf5ac3fe7e67dc82cf2'
};