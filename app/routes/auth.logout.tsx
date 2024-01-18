import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/lib/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticator.logout(request, { redirectTo: "/auth/login" });
};

export default function Index() {
  useLoaderData<typeof loader>();
}
