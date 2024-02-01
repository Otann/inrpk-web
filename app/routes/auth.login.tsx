import type {
  ActionFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { json, useLoaderData } from '@remix-run/react';
import { loginUrl, authenticator } from '~/lib/auth.server';
import { commitSession, getSession } from '~/lib/session.server';
import LoginForm from '~/components/LoginForm';

export const meta: MetaFunction = () => {
  return [
    { title: 'ИНРПК Бот' },
    { name: 'description', content: 'Управление ботом' },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  });
  const session = await getSession(request.headers.get('cookie'));
  const error = session.get(authenticator.sessionErrorKey);
  return json(
    { error },
    {
      headers: {
        'Set-Cookie': await commitSession(session), // You must commit the session whenever you read a flash
      },
    }
  );
};

export const action: ActionFunction = async ({ request }) => {
  try {
    return authenticator.authenticate('code', request, {
      successRedirect: '/',
      failureRedirect: loginUrl(),
    });
  } catch (error) {
    return json({ error });
  }
};

export default function LoginPage() {
  const { error } = useLoaderData<typeof loader>();
  return <LoginForm error={error} />;
}
