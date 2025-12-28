import { getStravaTokens, setStravaTokens, type StravaTokens } from './kv-store';

const STRAVA_OAUTH_URL = 'https://www.strava.com/oauth/token';
const STRAVA_API_BASE = 'https://www.strava.com/api/v3';

function readEnvTokens(): StravaTokens | null {
  const accessToken = process.env.STRAVA_ACCESS_TOKEN;
  const refreshToken = process.env.STRAVA_REFRESH_TOKEN;
  const expiresAt = process.env.STRAVA_EXPIRES_AT;

  if (!accessToken || !refreshToken || !expiresAt) {
    return null;
  }

  const parsedExpiresAt = Number(expiresAt);
  if (!Number.isFinite(parsedExpiresAt)) {
    return null;
  }

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: parsedExpiresAt,
  };
}

async function refreshTokens(tokens: StravaTokens): Promise<StravaTokens> {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Strava client credentials are not configured.');
  }

  const response = await fetch(STRAVA_OAUTH_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: tokens.refresh_token,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Strava token refresh failed: ${text}`);
  }

  const data = (await response.json()) as {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };

  const updated: StravaTokens = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: data.expires_at,
  };

  await setStravaTokens(updated);
  return updated;
}

export async function getValidStravaTokens(): Promise<StravaTokens> {
  const now = Math.floor(Date.now() / 1000);
  const fromKv = await getStravaTokens();
  const fromEnv = readEnvTokens();
  const tokens = fromKv ?? fromEnv;

  if (!tokens) {
    throw new Error('Strava tokens are not configured.');
  }

  if (tokens.expires_at > now + 60) {
    return tokens;
  }

  return refreshTokens(tokens);
}

export async function fetchStravaActivities(from: string, to: string) {
  const tokens = await getValidStravaTokens();
  const after = Math.floor(new Date(from).getTime() / 1000);
  const before = Math.floor(new Date(to).getTime() / 1000);

  if (Number.isNaN(after) || Number.isNaN(before)) {
    throw new Error('Invalid date range.');
  }

  const url = new URL(`${STRAVA_API_BASE}/athlete/activities`);
  url.searchParams.set('after', String(after));
  url.searchParams.set('before', String(before));
  url.searchParams.set('per_page', '200');

  const response = await fetch(url.toString(), {
    headers: {
      authorization: `Bearer ${tokens.access_token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Strava API error: ${text}`);
  }

  return response.json();
}
