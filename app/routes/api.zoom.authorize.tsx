import { LoaderFunction, json } from '@remix-run/node';
import { getAccessToken, whoAmI, REDIRECT_URL } from '~/lib/api/zoom.server';
import { db } from '~/lib/db/index.server';
import { zoomCredentials } from '~/lib/db/schema.server';
import { eq } from 'drizzle-orm';
import { isAxiosError } from 'axios';

export const loader: LoaderFunction = async ({ request }) => {
  const params = new URL(request.url).searchParams;
  const code = params.get('code');
  console.log('params: ', params);
  try {
    const credentials = await getAccessToken(code!);
    console.log('got access token');
    const user = await whoAmI(credentials.access_token);
    console.log('got user information');

    // TODO: seems like a candidate for upsert
    const existing = await db.query.zoomCredentials.findFirst({
      where: eq(zoomCredentials.zoomUserId, user.id),
    });

    if (existing) {
      await db
        .update(zoomCredentials)
        .set({
          zoomUser: user,
          credentials,
        })
        .where(eq(zoomCredentials.zoomUserId, user.id));
    } else {
      await db.insert(zoomCredentials).values({
        zoomUser: user,
        zoomUserId: user.id,
        credentials: existing,
      });
    }

    return json({ user });
  } catch (err) {
    if (isAxiosError(err)) {
      return json({ error: err.response?.data, code, REDIRECT_URL });
    } else {
      return json({ unknown: `${err}` });
    }
  }
};
