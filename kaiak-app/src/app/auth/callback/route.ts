import { createClient } from '@/lib/supabase/server';
import { getAppUrl } from '@/lib/url';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${getAppUrl()}${next}`);
    }
  }

  return NextResponse.redirect(`${getAppUrl()}/login?error=auth_callback_failed`);
}
