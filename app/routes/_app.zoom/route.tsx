import { Button, Stack } from '@carbon/react';
import { ActionFunction, MetaFunction, json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import CarbonContentPage from '~/components/CarbonContentPage';
import {
  getAuthorizeUrl,
  refreshAccessToken,
  createMeeting,
} from '~/lib/api/zoom.server';
import { db } from '~/lib/db';

export const meta: MetaFunction = () => {
  return [{ title: 'ИНРПК: Зум' }];
};

export const loader = async () => {
  const zoomCredentials = await db.query.zoomCredentials.findMany();
  const authorizationUrl = getAuthorizeUrl();

  return json({ zoomCredentials, authorizationUrl });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get('action');

  switch (action) {
    case 'start_meeting': {
      const zoomCredentials = await db.query.zoomCredentials.findFirst();
      // const refreshedToken = await refreshAccessToken(
      //   zoomCredentials!.credentials.access_token
      // );
      const token = zoomCredentials?.credentials?.access_token as string;
      const meeting = await createMeeting(token, 'me', {
        type: 1,
        topic: 'this is a test',
        agenda: 'hallo friend',
      });

      return json({ meeting });
    }
  }

  return json({ ok: true });
};

export default function Profile() {
  const { zoomCredentials, authorizationUrl } = useLoaderData<typeof loader>();

  return (
    <CarbonContentPage>
      <Stack gap={7}>
        <h1>Зарегистрированные аккаунты</h1>
        <ul>
          {zoomCredentials.map((row) => (
            <li key={row.id}>{row.zoomUser?.display_name}</li>
          ))}
        </ul>
        <Form method="post">
          <Button type="submit" name="action" value="start_meeting">
            Запустить конференцию
          </Button>
        </Form>
        <Button href={authorizationUrl}>Добавить зум-аккаунт</Button>
      </Stack>
    </CarbonContentPage>
  );
}
