import { LoaderFunctionArgs, json } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { authenticator } from '~/lib/auth.server';
import Shell from '~/components/Shell';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth/login',
  });
  return json({ user });
};

export default function App() {
  return (
    <Shell>
      <Outlet />
    </Shell>
  );
}
