import { LoaderFunctionArgs, json } from '@remix-run/node';
import { bot } from '~/lib/telegram';

export const action = async ({ request }: LoaderFunctionArgs) => {
  const message = await request.json();
  await bot.handleUpdate(message);
  return json({ status: 'ok' });
};
