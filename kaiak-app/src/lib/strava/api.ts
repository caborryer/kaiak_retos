import { createServiceClient } from '@/lib/supabase/server';

const STRAVA_API_BASE = 'https://www.strava.com/api/v3';

const APP_TIMEZONE = process.env.APP_TIMEZONE || 'America/Bogota';

function startOfTodayAfterEpoch(): number {
  const now = new Date();
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: APP_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = dtf.formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const hour = get('hour') === '24' ? '0' : get('hour');

  const asUtc = Date.UTC(
    +get('year'),
    +get('month') - 1,
    +get('day'),
    +hour,
    +get('minute'),
    +get('second')
  );
  const offsetMs = asUtc - now.getTime();

  const todayAt0001 = Date.UTC(
    +get('year'),
    +get('month') - 1,
    +get('day'),
    0,
    1,
    0
  );

  return Math.floor((todayAt0001 - offsetMs) / 1000);
}

interface StravaActivity {
  id: number;
  name: string;
  type: string;
  distance: number; // meters
  elapsed_time: number;
  start_date: string;
}

interface StravaTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

async function refreshStravaToken(
  refreshToken: string
): Promise<StravaTokenResponse> {
  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to refresh Strava token: ${response.statusText}`);
  }

  return response.json();
}

export async function syncStravaActivities(userId: string): Promise<number> {
  const supabase = await createServiceClient();

  // Get strava connection
  const { data: connection, error: connError } = await supabase
    .from('strava_connections')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (connError || !connection) {
    throw new Error('No Strava connection found for user');
  }

  let accessToken = connection.access_token;

  // Refresh token if expired
  const now = new Date();
  const expiresAt = new Date(connection.expires_at);
  if (now >= expiresAt) {
    try {
      const newTokens = await refreshStravaToken(connection.refresh_token);
      accessToken = newTokens.access_token;

      // Update stored tokens
      await supabase
        .from('strava_connections')
        .update({
          access_token: newTokens.access_token,
          refresh_token: newTokens.refresh_token,
          expires_at: new Date(newTokens.expires_at * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);
    } catch (err) {
      throw new Error('Failed to refresh Strava token. Please reconnect Strava.');
    }
  }

  // Fetch activities from today at 00:01
  const afterTimestamp = startOfTodayAfterEpoch();

  const activitiesUrl = new URL(`${STRAVA_API_BASE}/athlete/activities`);
  activitiesUrl.searchParams.set('after', afterTimestamp.toString());
  activitiesUrl.searchParams.set('per_page', '100');

  const response = await fetch(activitiesUrl.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error(`Strava API error: ${response.statusText}`);
  }

  const activities: StravaActivity[] = await response.json();

  // Filter only running/walking activities
  const runningTypes = ['Run', 'Walk', 'Hike', 'VirtualRun'];
  const validActivities = activities.filter((a) => runningTypes.includes(a.type));

  if (validActivities.length > 0) {
    // Upsert activities
    const { error: upsertError } = await supabase.from('activities').upsert(
      validActivities.map((a) => ({
        user_id: userId,
        strava_activity_id: a.id,
        name: a.name,
        type: a.type as 'Run' | 'Walk' | 'Hike' | 'VirtualRun',
        distance_km: parseFloat((a.distance / 1000).toFixed(3)),
        elapsed_time_seconds: a.elapsed_time,
        start_date: a.start_date,
        synced_at: new Date().toISOString(),
      })),
      { onConflict: 'user_id,strava_activity_id' }
    );

    if (upsertError) {
      throw new Error(`Failed to save activities: ${upsertError.message}`);
    }
  }

  // Calculate and return total KM
  const { data: totalData } = await supabase
    .from('activities')
    .select('distance_km')
    .eq('user_id', userId);

  const totalKm = (totalData || []).reduce(
    (sum, a) => sum + (a.distance_km || 0),
    0
  );

  return parseFloat(totalKm.toFixed(1));
}

export async function getTotalKm(userId: string): Promise<number> {
  const supabase = await createServiceClient();

  const { data } = await supabase
    .from('activities')
    .select('distance_km')
    .eq('user_id', userId);

  const total = (data || []).reduce((sum, a) => sum + (a.distance_km || 0), 0);
  return parseFloat(total.toFixed(1));
}
