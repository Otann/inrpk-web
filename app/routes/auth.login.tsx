import type {
  ActionFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { LoginPage } from "~/components/LoginPage";
import { authenticator, loginUrl } from "~/lib/auth.server";
import { Account } from "~/lib/db/schema.server";
import { commitSession, getSession } from "~/lib/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "ИНРПК Бот" },
    { name: "description", content: "Управление ботом" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {});
  const session = await getSession(request.headers.get("cookie"));
  const error = session.get(authenticator.sessionErrorKey);
  return json(
    { error, user },
    {
      headers: {
        "Set-Cookie": await commitSession(session), // You must commit the session whenever you read a flash
      },
    }
  );
};

export const action: ActionFunction = async ({ request }) => {
  try {
    return authenticator.authenticate("code", request, {
      successRedirect: "/",
      failureRedirect: loginUrl(),
    });
  } catch (error) {
    return json({ error });
  }
};

export default function LoginLandingPage() {
  const { error, user } = useLoaderData<typeof loader>();
  return <LoginPage error={error} user={user as Account} />;
}
