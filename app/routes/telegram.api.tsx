import { LoaderFunctionArgs, json } from "@remix-run/node";
import Telegraf from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { db } from "~/lib/db";
import { totp } from "~/lib/db/schema";

export const bot = new Telegraf(process.env.BOT_TOKEN!);

const REQUEST_CODE_MSG = "Получить новый код";

async function sendNewCode(ctx: TelegrafContext) {
  const code = (Math.floor(Math.random() * 90000) + 10000).toString();

  if (!ctx.message || !ctx.message.from || !ctx.message.from.id) {
    return;
  }  
  
  const telegramUser = ctx.message.from;
  const telegramId = `${telegramUser?.id}`;
  const createdAt = new Date();

  await db
    .insert(totp)
    .values({ code, telegramUser, createdAt, telegramId })
    .onConflictDoUpdate({
      target: totp.telegramId,
      set: { code, telegramUser },
    });

  ctx.reply(
    `Ваш код: \`${code}\` \\(нажмите на число, чтобы его скопировать\\)`,
    {
      parse_mode: "MarkdownV2",
      reply_markup: { keyboard: [[{ text: "Получить новый код" }]] },
    }
  );
}

bot.start(async (ctx) => {
  ctx.reply(
    `Здравствуйте, ${ctx.message?.from?.first_name} ${ctx.message?.from?.last_name}.`
  );
  await sendNewCode(ctx);
});

bot.help(async (ctx) => {
  sendNewCode(ctx);
});

bot.command("code", async (ctx) => {
  sendNewCode(ctx);
});

bot.on("message", async (ctx) => {
  switch (ctx.message?.text) {
    case REQUEST_CODE_MSG:
      sendNewCode(ctx);
      break;

    default:
      break;
  }
});

export const action = async ({ request }: LoaderFunctionArgs) => {
  const message = await request.json();
  await bot.handleUpdate(message);
  return json({ status: 'ok' });
};
