import { Button, Stack } from '@carbon/react';
import { LoaderFunctionArgs, MetaFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { authenticator } from '~/lib/auth.server';
import CarbonContentPage from '~/components/CarbonContentPage';

export const meta: MetaFunction = () => {
  return [{ title: 'ИНРПК: Профиль' }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth/login',
  });
  return json({ user });
};

export default function Profile() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <CarbonContentPage>
      <Stack gap={7}>
        <h1>
          Добро пожаловать, {user.firstName} {user.lastName}
        </h1>
        <Button kind="danger" href="/auth/logout">
          Выйти из системы
        </Button>
      </Stack>
    </CarbonContentPage>
  );
}
