import { TelegrafContext } from 'telegraf/typings/context';
import { db } from '~/lib/db';
import { totp } from '~/lib/db/schema';

export const REQUEST_CODE_MSG = 'Получить новый код';

export async function sendNewCode(ctx: TelegrafContext) {
  const code = (Math.floor(Math.random() * 90000) + 10000).toString();

  if (!ctx.message || !ctx.message.from || !ctx.message.from.id) {
    return;
  }

  const telegramUser = ctx.message.from;
  const telegramId = telegramUser?.id;
  const createdAt = new Date();

  await db
    .insert(totp)
    .values({ code, telegramUser, createdAt, telegramId })
    .onConflictDoUpdate({
      target: totp.telegramId,
      set: { code, telegramUser, wasUsed: false },
    });

  ctx.reply(
    `Ваш код: \`${code}\` \\(нажмите на число, чтобы его скопировать\\)`,
    {
      parse_mode: 'MarkdownV2',
      reply_markup: { keyboard: [[{ text: REQUEST_CODE_MSG }]] },
    }
  );
}
