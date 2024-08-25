require("dotenv").config(); // получаем доступ к переменной окружения
const {
  Bot,
  GrammyError,
  HttpError,
  Keyboard,
  InlineKeyboard,
} = require("grammy");

const bot = new Bot(process.env.BOT_API_KEY);

bot.api.setMyCommands([
  {
    command: "start",
    description: "Запуск бота",
  },
  {
    command: "get_user",
    description: "get data of user from jsonplaceholder",
  },
  {
    command: "share",
    description: "share with bot geolocation, phone number or create a poll",
  },
  {
    command: "inline_keyboard",
    description: "replies with inline keyboard",
  },
]);

// команда "/start"
bot.command("start", async (ctx) => {
  await ctx.reply("logging info from ctx [link](www.youtube.com)", {
    parse_mode: "MarkdownV2",
    disable_web_page_preview: true,
  });
  await ctx.react("🔥");
});

bot.command("mood", async (ctx) => {
  const moodKeyboard = new Keyboard()
    .text("good")
    .row()
    .text("normal")
    .row()
    .text("bad")
    .resized();
  await ctx.reply("How do you feel?", {
    reply_markup: moodKeyboard,
  });
});

bot.command("share", async (ctx) => {
  const shareKeyboard = new Keyboard()
    .requestLocation("Geolocation")
    .requestContact("Contact")
    .requestPoll("Poll")
    .placeholder("share data")
    .resized();

  await ctx.reply("what do you want to share?", {
    reply_markup: shareKeyboard,
  });
});

bot.command("inline_keyboard", async (ctx) => {
  const inlineKeyboard = new InlineKeyboard()
    .text("1", "button-1")
    .text("2", "button-2")
    .text("3", "button-3");

  await ctx.reply("pick a number", {
    reply_markup: inlineKeyboard,
  });
});

bot.hears("good", async (ctx) => {
  await ctx.reply("ok", {
    reply_markup: { remove_keyboard: true },
  });
});

bot.on(":contact", async (ctx) => {
  await ctx.reply("thx for contact!");
});

// можно добавить регулярку (bot.hears)
bot.command(["ID"], async (ctx) => {
  await ctx.reply(
    `${ctx.from.first_name} id is:  <span class="tg-spoiler">${ctx.from.id}</span>`,
    {
      reply_parameters: { message_id: ctx.msg.message_id },
      parse_mode: "HTML",
    }
  );
});

bot.command(["say_something", "get_user"], async (ctx) => {
  const replyMessage = await fetch(
    "https://jsonplaceholder.typicode.com/users/2"
  )
    .then((res) => res.json())
    .then((json) => json.name + json.email + " " + json.address.street);

  await ctx.reply(`<i>${replyMessage}</i>`, {
    parse_mode: "HTML",
  });
});

// ответ на любое другое сообщение (можно указать тип сообщения)
bot.on("::url", async (ctx) => {
  await ctx.reply("got another link");
});

// обработчик ошибок (из документации)
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
