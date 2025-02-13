import { SendAlt, TrashCan } from '@carbon/icons-react';
import {
  Button,
  DataTable,
  Stack,
  StructuredListBody,
  StructuredListCell,
  StructuredListHead,
  StructuredListRow,
  StructuredListWrapper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableExpandHeader,
  TableExpandRow,
  TableExpandedRow,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarAction,
  TableToolbarContent,
  TableToolbarMenu,
  TableToolbarSearch,
} from '@carbon/react';
import { ActionFunction, MetaFunction, json } from '@remix-run/node';
import { useLoaderData, useSubmit } from '@remix-run/react';
import { eq } from 'drizzle-orm';
import CarbonDataPage from '~/components/CarbonDataPage';
import { db } from '~/lib/db/index.server';
import {
  StudyGroupWithTg,
  TelegramGroup,
  studyGroup,
  telegramGroup,
} from '~/lib/db/schema.server';
import { bot } from '~/lib/telegram';
import { AddNewGroupButton } from './AddNewGroupButton';
import { EditGroupButton } from './EditGroupButton';
import styles from './styles.module.css';
import React from 'react';

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

    case 'test': {
      const chatId = parseInt(form.get('chatId') as string);
      try {
        const message = bot.telegram.sendMessage(
          chatId,
          'Проверка связи бота с группой'
        );
        return json({ ok: message });
      } catch (err) {
        console.log(err);
        return json({ ok: err });
      }
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
                <StructuredListCell></StructuredListCell>
              </StructuredListRow>
            ))}
          </StructuredListBody>
        </StructuredListWrapper>
        <GroupsDataTable
          groups={groups as StudyGroupWithTg[]}
          tgGroups={tgGroups as TelegramGroup[]}
        />
      </Stack>
    </CarbonDataPage>
  );
}

interface GroupsDataTableProps {
  groups: StudyGroupWithTg[];
  tgGroups: TelegramGroup[];
}

interface TableRow {
  id: string;
}

function GroupActions({
  group,
  tgGroups,
  usedIds,
}: {
  group: StudyGroupWithTg;
  tgGroups: TelegramGroup[];
  usedIds: Set<number>;
}) {
  const submit = useSubmit();
  return (
    <>
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
      <Button
        size="sm"
        kind="ghost"
        hasIconOnly
        renderIcon={SendAlt}
        iconDescription="Тест"
        onClick={() => {
          submit(
            {
              action: 'test',
              chatId: group.telegramChatId,
            },
            { method: 'post' }
          );
        }}
      />
    </>
  );
}

function GroupsDataTable({ groups, tgGroups }: GroupsDataTableProps) {
  const usedIds: Set<number> = new Set(groups.map((g) => g.telegramChatId!));

  const headers = [
    {
      key: 'name',
      header: 'Название потока',
    },
    {
      key: 'telegram',
      header: 'Группа в телеграме',
    },
    {
      key: 'actions',
      header: 'Быстрые действия',
    },
  ];
  const rows = groups.map((group) => ({
    id: group.id.toString(),
    key: group.id,
    name: group.name,
    telegram: group.telegramGroup?.title || <em>группа не выбрана</em>,
    actions: (
      <GroupActions group={group} tgGroups={tgGroups} usedIds={usedIds} />
    ),
  }));
  return (
    <DataTable rows={rows} headers={headers}>
      {({
        rows,
        headers,
        getHeaderProps,
        getRowProps,
        getExpandedRowProps,
        getTableProps,
        getTableContainerProps,
      }) => (
        <TableContainer
          title="Учебные потоки"
          // description="Список учебных потоков"
          {...getTableContainerProps()}
        >
          <TableToolbar>
            <TableToolbarContent>
              {/* pass in `onInputChange` change here to make filtering work */}
              <TableToolbarSearch
                onChange={(e) => console.log(e)}
                id="search"
              />
              <TableToolbarMenu>
                <TableToolbarAction onClick={() => alert('Action 1 Click')}>
                  Action 1
                </TableToolbarAction>
                <TableToolbarAction onClick={() => alert('Action 2 Click')}>
                  Action 2
                </TableToolbarAction>
                <TableToolbarAction onClick={() => alert('Action 3 Click')}>
                  Action 3
                </TableToolbarAction>
              </TableToolbarMenu>
              <Button onClick={() => alert('Button click')}>
                Добавить группу
              </Button>
            </TableToolbarContent>
          </TableToolbar>
          <Table {...getTableProps()} aria-label="sample table">
            <TableHead>
              <TableRow>
                <TableExpandHeader aria-label="expand row" />
                {headers.map((header, i) => (
                  <TableHeader
                    key={i}
                    {...getHeaderProps({
                      header,
                    })}
                  >
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableExpandRow
                    aria-controls=""
                    {...getRowProps({
                      row,
                    })}
                  >
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableExpandRow>
                  <TableExpandedRow
                    colSpan={headers.length + 1}
                    className="demo-expanded-td"
                    {...getExpandedRowProps({
                      row,
                    })}
                  >
                    <h6>Expandable row content</h6>
                    <div>Description here</div>
                  </TableExpandedRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DataTable>
  );
}
