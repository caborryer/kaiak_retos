import { createClient, createServiceClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(`${origin}/km?strava_error=access_denied`);
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  // Exchange code for tokens
  const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenResponse.ok) {
    return NextResponse.redirect(`${origin}/km?strava_error=token_exchange_failed`);
  }

  const tokenData = await tokenResponse.json();
  const serviceSupabase = await createServiceClient();

  // Save connection to DB
  const { error: dbError } = await serviceSupabase
    .from('strava_connections')
    .upsert({
      user_id: user.id,
      strava_user_id: tokenData.athlete.id,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: new Date(tokenData.expires_at * 1000).toISOString(),
      athlete_name: `${tokenData.athlete.firstname} ${tokenData.athlete.lastname}`,
      athlete_profile: tokenData.athlete.profile,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (dbError) {
    return NextResponse.redirect(`${origin}/km?strava_error=db_save_failed`);
  }

  return NextResponse.redirect(`${origin}/km?strava_connected=true`);
}
