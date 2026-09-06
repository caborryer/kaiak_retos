import { createClient } from '@/lib/supabase/server';
import { syncStravaActivities } from '@/lib/strava/api';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const totalKm = await syncStravaActivities(user.id);
    return NextResponse.json({ success: true, totalKm });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sync failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
