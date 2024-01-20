import { Stack } from '@carbon/react';
import { ActionFunction, MetaFunction, json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import CarbonContentPage from '~/components/CarbonContentPage';
import { db } from '~/lib/db';
import { bot } from '~/lib/telegram';

export const meta: MetaFunction = () => {
  return [{ title: 'ИНРПК: Телеграм' }];
};

export const loader = async () => {
  const groups = await db.query.telegramGroup.findMany();
  return json({ groups });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get('action');

  switch (action) {
    case 'webhook': {
      await bot.telegram.setWebhook(
        `https://inrpk.letoved.ru/telegram/X4rmkvFBmnZaFtywaPmx`
      );
      return json({ ok: 'webhook set' });
    }
  }

  return json({ ok: true });
};

export default function Profile() {
  const { groups } = useLoaderData<typeof loader>();

  return (
    <CarbonContentPage>
      <Stack gap={7}>
        <h1>Записанные Группы</h1>
        <ul>
          {groups.map((group) => (
            <li key={group.id}>{group.title}</li>
          ))}
        </ul>
        <Form method="post">
          <button type="submit" name="action" value="webhook">
            Set Prod Webhook
          </button>
        </Form>
      </Stack>
    </CarbonContentPage>
  );
}
