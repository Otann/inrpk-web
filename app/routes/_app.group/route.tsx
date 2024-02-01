import { TrashCan } from '@carbon/icons-react';
import {
  Button,
  Stack,
  StructuredListBody,
  StructuredListCell,
  StructuredListHead,
  StructuredListRow,
  StructuredListWrapper,
} from '@carbon/react';
import { ActionFunction, MetaFunction, json } from '@remix-run/node';
import { useLoaderData, useSubmit } from '@remix-run/react';
import { eq } from 'drizzle-orm';
import CarbonDataPage from '~/components/CarbonDataPage';
import { db } from '~/lib/db';
import {
  StudyGroupWithTg,
  TelegramGroup,
  studyGroup,
  telegramGroup,
} from '~/lib/db/schema';
import { AddNewGroupButton } from './AddNewGroupButton';
import { EditGroupButton } from './EditGroupButton';
import styles from './styles.module.css';

export const meta: MetaFunction = () => {
  return [{ title: 'ИНРПК: Группы' }];
};

export const loader = async () => {
  const groups = await db.query.studyGroup.findMany({
    orderBy: [studyGroup.name],
    with: {
      telegramGroup: true,
    },
  });
  const tgGroups = await db.query.telegramGroup.findMany({
    orderBy: telegramGroup.title,
  });
  return json({ groups, tgGroups });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get('action');

  switch (action) {
    case 'add': {
      const name = form.get('name') as string;
      const result = await db.insert(studyGroup).values({
        name,
      });
      return json({ ok: result });
    }

    case 'edit': {
      const id = parseInt(form.get('id') as string);
      const name = form.get('name') as string;
      const telegramChatId =
        form.get('chatId') !== 'NaN' && form.get('chatId') !== 'null'
          ? parseInt(form.get('chatId') as string)
          : null;

      console.log('tg group', form.get('chatId'));
      console.log('tg group', typeof form.get('chatId'));
      console.log('tg group', telegramChatId);

      const result = await db
        .update(studyGroup)
        .set({
          name,
          telegramChatId,
        })
        .where(eq(studyGroup.id, id));
      return json({ ok: result });
    }

    case 'remove': {
      const id = parseInt(form.get('id') as string);
      console.log('removing study group', form.get('id') as string, id);
      const result = await db
        .delete(studyGroup)
        .where(eq(studyGroup.id, id))
        .returning();
      return json({ ok: result });
    }
  }

  return json({ ok: true });
};

export default function Profile() {
  const { groups, tgGroups } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const usedIds: Set<number> = new Set(groups.map((g) => g.telegramChatId!));

  return (
    <CarbonDataPage>
      <Stack gap={7}>
        <Stack orientation="horizontal" className={styles.title}>
          <h1>Учебные группы</h1>
          <AddNewGroupButton />
        </Stack>

        <StructuredListWrapper
          selection={false}
          className={styles.groups_table}
        >
          <StructuredListHead>
            <StructuredListRow head>
              <StructuredListCell head className={styles.name}>
                Название
              </StructuredListCell>
              <StructuredListCell head className={styles.telegram}>
                Группа в телеграме
              </StructuredListCell>
              <StructuredListCell head className={styles.next_lesson}>
                Ближайшее занятие
              </StructuredListCell>
              <StructuredListCell head className={styles.actions}>
                Действия
              </StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            {groups.map((group) => (
              <StructuredListRow key={group.id}>
                <StructuredListCell noWrap>{group.name}</StructuredListCell>
                <StructuredListCell>
                  {group.telegramGroup?.title || <em>группа не выбрана</em>}
                </StructuredListCell>
                <StructuredListCell>...</StructuredListCell>
                <StructuredListCell>
                  <EditGroupButton
                    group={group as StudyGroupWithTg}
                    tgGroups={tgGroups as TelegramGroup[]}
                    usedGroups={usedIds}
                  />
                  <Button
                    size="sm"
                    kind="ghost"
                    hasIconOnly
                    renderIcon={TrashCan}
                    iconDescription="УДАЛИТЬ"
                    onClick={() => {
                      submit(
                        {
                          action: 'remove',
                          id: group.id,
                        },
                        { method: 'post' }
                      );
                    }}
                  />
                </StructuredListCell>
              </StructuredListRow>
            ))}
          </StructuredListBody>
        </StructuredListWrapper>
      </Stack>
    </CarbonDataPage>
  );
}
