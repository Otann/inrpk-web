import { ActionFunctionArgs, json } from "@remix-run/node";
import { bot } from "~/lib/telegram";

export const action = async ({ request }: ActionFunctionArgs) => {
  const message = await request.json();
  await bot.handleUpdate(message);
  return json({ status: "ok" });
};

export const loader = async () => {
  await bot.telegram.setWebhook(
    `https://inrpk-admin.ru/api/telegram/X4rmkvFBmnZaFtywaPmx`
  );
  return json({
    ok: `Webhook set to https://inrpk-admin.ru/api/telegram/X4rmkvFBmnZaFtywaPmx`,
  });
};
