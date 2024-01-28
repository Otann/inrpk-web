import { LoaderFunction, json } from '@remix-run/node';
import { getAccessToken, whoAmI, REDIRECT_URL } from '~/lib/api/zoom.server';
import { db } from '~/lib/db';
import { zoomCredentials } from '~/lib/db/schema';
import { eq } from 'drizzle-orm';
import { isAxiosError } from 'axios';

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const params = new URL(request.url).searchParams;
    const code = params.get('code');
    console.log('params: ', params);
    // const credentials = await getAccessToken(code!);
    // console.log('got access token');
    // const user = await whoAmI(credentials.access_token);
    // console.log('got user information');

    // TODO: seems like a candidate for upsert
    // const existing = await db.query.zoomCredentials.findFirst({
    //   where: eq(zoomCredentials.zoomUserId, user.id),
    // });

    // if (existing) {
    //   await db
    //     .update(zoomCredentials)
    //     .set({
    //       zoomUser: user,
    //       credentials: original,
    //     })
    //     .where(eq(zoomCredentials.zoomUserId, user.id));
    // } else {
    //   await db.insert(zoomCredentials).values({
    //     zoomUser: user,
    //     zoomUserId: user.id,
    //     credentials: original,
    //   });
    // }

    return json({ code, redirectUrl: REDIRECT_URL });
  } catch (err) {
    if (isAxiosError(err)) {
      return json({ error: err.response?.data });
    } else {
      return json({ unknown: `${err}` });
    }
  }
};
