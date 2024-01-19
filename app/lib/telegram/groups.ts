import { Chat } from 'telegraf/typings/telegram-types';
import { db } from '~/lib/db';
import { telegramGroup } from '../db/schema';
import { eq } from 'drizzle-orm';
import { TelegrafContext } from 'telegraf/typings/context';
import Telegraf from 'telegraf';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isGroupChat(value: any): value is Chat.GroupGetChat {
  return value.type === 'group';
}

export async function joinGroup(
  bot: Telegraf<TelegrafContext>,
  chatId: number
) {
  const chatInfo = await bot.telegram.getChat(chatId);
  console.log('chat info', chatInfo);

  if (!isGroupChat(chatInfo)) {
    bot.telegram.sendMessage(
      chatId,
      'Это не групповой чат, не могу такой записать'
    );
    return;
  }
  if (chatInfo.photo) {
    const fileInfo = await bot.telegram.getFile(chatInfo.photo?.small_file_id);
    console.log('fileInfo', fileInfo);
  }

  const existing = await db.query.telegramGroup.findFirst({
    where: eq(telegramGroup.telegramId, chatId),
  });

  if (existing) {
    bot.telegram.sendMessage(chatId, 'Обновил информацию о группе');
  } else {
    await db.insert(telegramGroup).values({
      telegramId: chatId,
      title: chatInfo.title,
      photoId: chatInfo.photo?.small_file_id,
      createdAt: new Date(),
    });
    bot.telegram.sendMessage(chatId, 'Записал информацию о группе');
  }
}
