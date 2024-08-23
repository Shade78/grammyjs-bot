require("dotenv").config(); // получаем доступ к переменной окружения
const { Bot, GrammyError, HttpError } = require("grammy");

const bot = new Bot(process.env.BOT_API_KEY);

// команда "/start"
bot.command("start", async (ctx) => {
  await ctx.reply("test first message from bot");
});

// ответ на любое другое сообщение
bot.on("message", async (ctx) => {
  await ctx.reply("got another message");
});

// обработчик ошибок
bot.catch((err) => {
  const ctx = err.ctx;
  console.log(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknows error:", e);
  }
});

bot.start();
