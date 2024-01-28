import axios from 'axios';

/**
 * According to the docs
 * https://developers.zoom.us/docs/integrations/oauth/
 */
interface AuthUrlParams {
  /**
   * Access response type being requested.
   * The supported authorization workflow requires the value code.
   */
  response_type: string;
  /**
   * URI to handle successful user authorization.
   * Must match with Development or Production Redirect URI in your OAuth app settings.
   */
  redirect_uri: string;
  /**
   * OAuth application's Development or Production Client ID.
   */
  client_id: string;
  /**
   * (Optional) An opaque value that you can use to maintain state
   * between the request and callback. The authorization server appends
   * the state value to the redirect URI.
   * This is also useful to prevent cross-site request forgery.
   */
  state?: string;
  code_challenge?: string;
  code_challenge_method?: string;
}

function authorizeUrl({
  response_type,
  redirect_uri,
  client_id,
}: AuthUrlParams): string {
  const encoded = encodeURIComponent(redirect_uri);
  return `https://zoom.us/oauth/authorize?response_type=${response_type}&client_id=${client_id}&redirect_uri=${encoded}&state=239`;
}

const CLIENT_ID = process.env.ZOOM_CLIENT_ID;

if (!CLIENT_ID) {
  throw new Error('Missing ZOOM_CLIENT_ID environment variable');
}

const CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;

if (!CLIENT_SECRET) {
  throw new Error('Missing ZOOM_CLIENT_SECRET environment variable');
}

export const REDIRECT_URL = process.env.ZOOM_REDIRECT_URL;

if (!REDIRECT_URL) {
  throw new Error('Missing ZOOM_CLIENT_ID environment variable');
}

export function getAuthorizeUrl(): string {
  console.log(REDIRECT_URL);

  return authorizeUrl({
    response_type: 'code',
    client_id: CLIENT_ID as string,
    redirect_uri: REDIRECT_URL as string,
  });
}

type ZoomCredentials = {
  access_token: string;
  token_type: 'bearer';
  refresh_token: string;
  scope: string;
  expires_in: number;
};

export async function getAccessToken(code: string): Promise<ZoomCredentials> {
  const authToken = `${CLIENT_ID}:${CLIENT_SECRET}`;
  const authCode = Buffer.from(authToken).toString('base64');
  const config = {
    params: {
      code,
      grant_type: 'authorization_code',
      redirect_url: REDIRECT_URL,
    },
    headers: {
      Authorization: `Basic ${authCode}`,
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  console.log(config);

  const { data, status } = await axios.post<ZoomCredentials>(
    'https://zoom.us/oauth/token',
    {},
    config
  );
  console.log(
    `Received an access token response, status code ${status}, ${data}`
  );
  return data;
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<ZoomCredentials> {
  const authToken = `${CLIENT_ID}:${CLIENT_SECRET}`;
  const authCode = Buffer.from(authToken).toString('base64');
  const config = {
    params: {
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
      redirect_url: REDIRECT_URL,
    },
    headers: {
      Authorization: `Basic ${authCode}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const { data, status } = await axios.post<ZoomCredentials>(
    'https://zoom.us/oauth/token',
    {},
    config
  );
  console.log(
    `Received an access token response, status code ${status}, ${data}`
  );
  return data;
}

/**
 * Zoom API methods
 *
 */

const apiBaseUri = 'https://api.zoom.us/v2';

export type ZoomUser = {
  id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  email: string;
  type: number;
  role_name: string;
  pmi: number;
  pic_url: string;
  account_id: string;
  account_number: number;
};

export async function whoAmI(token: string): Promise<ZoomUser> {
  const { data } = await axios<ZoomUser>({
    url: `${apiBaseUri}/users/me`,
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

/**
 * This creates a zoom meeting
 * Medium rate limit: 30 req/sec for Pro, 80 req/sec for Business+
 * Required scopes: meeting:read or meeting:read:admin & meeting:write or meeting:write:admin
 *
 * @param userId could be user_email / user_id / 'me'
 * @param payload something
 */
export async function createMeeting(
  token: string,
  userId: string,
  payload: {
    topic?: string; // max 200 char
    agenda?: string; // max 2000 char
    type: number; // 1 - instant, 2 - scheduled (start time), 3, 8 - recurring (`recurrence` payload)
  }
): Promise<object> {
  const { data } = await axios({
    url: `${apiBaseUri}/users/${userId}/meetings`,
    method: 'post',
    data: payload,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}
