require("dotenv").config(); // получаем доступ к переменной окружения
const { Bot } = require("grammy");

const bot = new Bot(process.env.BOT_API_KEY);

// команда "/start"
bot.command("start", async (ctx) => {
  await ctx.reply("test first message from bot");
});

// ответ на любое другое сообщение
bot.on("message", async (ctx) => {
  await ctx.reply("got another message");
});

bot.start();
