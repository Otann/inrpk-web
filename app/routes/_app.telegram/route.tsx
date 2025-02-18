import {
  Link,
  Stack,
  StructuredListBody,
  StructuredListCell,
  StructuredListHead,
  StructuredListRow,
  StructuredListWrapper,
} from "@carbon/react";
import { ActionFunction, MetaFunction, json } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import CarbonDataPage from "~/components/CarbonDataPage";
import { db } from "~/lib/db/index.server";
import { bot } from "~/lib/telegram";
import styles from "./styles.module.css";

export const meta: MetaFunction = () => {
  return [{ title: "ИНРПК: Телеграм" }];
};

export const loader = async () => {
  const groups = await db.query.telegramGroup.findMany();
  return json({ groups });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("action");

  switch (action) {
    case "webhook": {
      await bot.telegram.setWebhook(
        `https://inrpk-admin.ru/api/telegram/X4rmkvFBmnZaFtywaPmx`
      );
      return json({ ok: "webhook set" });
    }
    case "test": {
      const chatId = form.get("chatId") as string;
      await bot.telegram.sendMessage(chatId, `Тестовое сообщение`);
      return json({ ok: "message set" });
    }
  }

  return json({ ok: true });
};

export default function Profile() {
  const { groups } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  return (
    <CarbonDataPage>
      <Stack gap={7}>
        <h1>Записанные Группы</h1>
        <StructuredListWrapper className={styles.content_table}>
          <StructuredListHead>
            <StructuredListRow head>
              <StructuredListCell head className={styles.name}>
                Название группы
              </StructuredListCell>
              <StructuredListCell head className={styles.actions}>
                {" "}
              </StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            {groups.map((group) => (
              <StructuredListRow key={group.id}>
                <StructuredListCell noWrap>{group.title}</StructuredListCell>
                <StructuredListCell>
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      submit(
                        {
                          action: "test",
                          chatId: group.telegramId,
                        },
                        { method: "post" }
                      );
                    }}
                  >
                    Отправить тестовое сообщение
                  </Link>
                </StructuredListCell>
              </StructuredListRow>
            ))}
          </StructuredListBody>
        </StructuredListWrapper>
      </Stack>
    </CarbonDataPage>
  );
}
