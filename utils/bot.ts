import 'dotenv/config';
import { bot } from '~/lib/telegram';

async function main() {
  bot.launch();
}

main();
