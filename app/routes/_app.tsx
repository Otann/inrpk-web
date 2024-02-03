import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { loginUrl, authenticator } from '~/lib/auth.server';
import Shell from '~/components/Shell';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: loginUrl(),
  });
  if (user === null || user.roles === null || user.roles.length === 0) {
    return redirect(loginUrl('unauthorized'));
  }
  return json({ user });
};

export default function App() {
  return (
    <Shell>
      <Outlet />
    </Shell>
  );
}
