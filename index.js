require('dotenv').config();

const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Markup = require('telegraf/markup');
const Scene = require('telegraf/scenes/base');

const { enter, leave } = Stage;
const bus = require('./api/bus-timing');
const joke = require('./api/joke-api');

// Create a bot using TOKEN provided as environment variable
const bot = new Telegraf(process.env.BOT_TOKEN);

const gitLink = 'https://github.com/ahhhfiq/WTBus/issues';
const botLink = 't.me/WTBUS_BOT';

// Setup for the start command
bot.start(ctx => {
  ctx.reply(
    `Hi how can I help you ${ctx.from.first_name}?`,

    Markup.keyboard([
      ['🚍🚏 Get bus stop timings', '😂 Joke'], // Row1 with 2 buttons
      ['👥 Share', '📞 Feedback'] // Row2 with 2 buttons
    ])
      .resize()
      .extra()
  );
});

const getBusCode = new Scene('get-bus-code');
getBusCode.enter(ctx => {
  ctx.reply('Please give me your bus stop code number');
});
getBusCode.on('text', ctx => {
  ctx.session.busCode = ctx.message.text;

  bus.getBusStopTimings(ctx.session.busCode).then(res => {
    ctx.reply(res.join('\n'));
  });
});
getBusCode.hears(/🚍1\)/, ctx => {
  console.log('enter');
  getBusCode.leave(ctx => {
    bus.getBusStopTimings(ctx.session.busCode).then(response => {
      console.log(response);
    });
  });
});
getBusCode.leave(ctx => ctx.reply('exiting echo scene'));
getBusCode.command('back', ctx => ctx.scene.leave());

bot.hears(/(feedback)/i, ctx => {
  ctx.reply(`For any feedback or feature requests click this link: ${gitLink}`);
});
bot.hears('👥 Share', ctx => {
  ctx.reply(
    `Just copy this link to share this bot with your friends ${botLink}`
  );
});

bot.hears(/(joke)/i, ctx => {
  let jokeResponse = joke.getJoke();
  jokeResponse
    .then(res => {
      ctx.reply(res);
    })
    .catch(err => {
      console.log(err);
    });
});

const stage = new Stage();

stage.register(getBusCode);

bot.use(session());
bot.use(stage.middleware());
bot.hears(/(🚍🚏)/i, enter('get-bus-code'));

bot.launch();
