require('dotenv').config();

// Include Telegraf module
const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');
// Create a bot using TOKEN provided as environment variable
const bot = new Telegraf(process.env.TELEGRAM_API_KEY);

const replies = require('./replies');

// /help command - will send all the triggers defined in replies.js.
// bot.command('help', ctx => {
//   ctx.reply(
//     'Available triggers:\n\n' +
//     Object.keys(replies).join('\n')
//   )
// })

bot.start((ctx) => ctx.reply(`Welcome ${ctx.from.first_name}`))

bot.startPolling();