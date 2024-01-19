import Telegraf from 'telegraf';
import { sendNewCode, REQUEST_CODE_MSG } from './auth';
import { joinGroup } from './groups';

export const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.start(async (ctx) => {
  ctx.reply(
    `Здравствуйте, ${ctx.message?.from?.first_name} ${ctx.message?.from?.last_name}.`
  );
  await sendNewCode(ctx);
});

bot.help(async (ctx) => {
  sendNewCode(ctx);
});

bot.command('code', async (ctx) => {
  sendNewCode(ctx);
});

bot.command('join', async (ctx) => {
  if (ctx.chat) {
    joinGroup(bot, ctx.chat?.id);
  }
});

bot.on('message', async (ctx) => {
  switch (ctx.message?.text) {
    case REQUEST_CODE_MSG:
      sendNewCode(ctx);
      break;

    default:
      break;
  }
});
