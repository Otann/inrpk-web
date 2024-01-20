import { Stack } from '@carbon/react';
import { MetaFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import CarbonContentPage from '~/components/CarbonContentPage';
import { db } from '~/lib/db';

export const meta: MetaFunction = () => {
  return [{ title: 'ИНРПК: Телеграм' }];
};

export const loader = async () => {
  const groups = await db.query.telegramGroup.findMany();
  return json({ groups });
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
      </Stack>
    </CarbonContentPage>
  );
}
