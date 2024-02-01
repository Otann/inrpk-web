import {
  Link,
  Stack,
  StructuredListBody,
  StructuredListCell,
  StructuredListHead,
  StructuredListRow,
  StructuredListWrapper,
} from '@carbon/react';
import { ActionFunction, MetaFunction, json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import CarbonContentPage from '~/components/CarbonContentPage';
import CarbonDataPage from '~/components/CarbonDataPage';
import { db } from '~/lib/db';
import { bot } from '~/lib/telegram';
import styles from './styles.module.css';

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
        `https://inrpk-admin.ru/api/telegram/X4rmkvFBmnZaFtywaPmx`
      );
      return json({ ok: 'webhook set' });
    }
  }

  return json({ ok: true });
};

export default function Profile() {
  const { groups } = useLoaderData<typeof loader>();

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
                {' '}
              </StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            {groups.map((group) => (
              <StructuredListRow key={group.id}>
                <StructuredListCell noWrap>{group.title}</StructuredListCell>
                <StructuredListCell>
                  <Link>Отправить тестовое сообщение</Link>
                </StructuredListCell>
              </StructuredListRow>
            ))}
          </StructuredListBody>
        </StructuredListWrapper>
      </Stack>
    </CarbonDataPage>
  );
}
