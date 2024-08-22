require("dotenv").config(); // получаем доступ к переменной окружения
const { Bot } = require("grammy");

const bot = new Bot(process.env.BOT_API_KEY);

bot.start();
