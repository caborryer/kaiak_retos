import type { Metadata } from 'next';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProgressRing from '@/components/km/ProgressRing';
import MilestoneBar from '@/components/km/MilestoneBar';
import SyncButton from '@/components/km/SyncButton';
import { SkeletonRing, SkeletonMilestone, SkeletonKmHeader } from '@/components/ui/Skeletons';
import '@/styles/km.css';
import '@/styles/skeleton.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kaiak-app.vercel.app';

export const metadata: Metadata = {
  title: 'Registrar kilómetros KAIAK — Tus KM, tus logros',
  description:
    'Registrá tus kilómetros en KAIAK K21. Conectá Strava, seguí tu progreso y alcanzá la meta de los 21K.',
  alternates: {
    canonical: `${siteUrl}/km`,
  },
  openGraph: {
    title: 'Registrar kilómetros KAIAK — Tus KM, tus logros',
    description:
      'Registrá tus kilómetros en KAIAK K21. Conectá Strava, seguí tu progreso y alcanzá la meta de los 21K.',
    url: `${siteUrl}/km`,
  },
  twitter: {
    title: 'Registrar kilómetros KAIAK — Tus KM, tus logros',
    description:
      'Registrá tus kilómetros en KAIAK K21. Conectá Strava, seguí tu progreso y alcanzá la meta de los 21K.',
  },
};


async function KmContent({ userId }: { userId: string }) {
  const supabase = await createClient();

  const [{ data: activities }, { data: stravaConnection }] = await Promise.all([
    supabase.from('activities').select('distance_km').eq('user_id', userId),
    supabase
      .from('strava_connections')
      .select('athlete_name')
      .eq('user_id', userId)
      .single(),
  ]);

  const totalKm = parseFloat(
    (
      (activities || []).reduce((sum, a) => sum + (a.distance_km || 0), 0)
    ).toFixed(1)
  );

  const hasStrava = !!stravaConnection;
  const athleteName = stravaConnection?.athlete_name || null;

  return (
    <>
      <div className="km-header">
        <div>
          <h1 className="km-title">TUS KM</h1>
          <p className="km-subtitle">SE SUMAN, TE ACERCAN, TE TRANSFORMAN.</p>
          {athleteName && (
            <p style={{ color: 'var(--accent-cyan)', fontSize: '13px', marginTop: '4px' }}>
              👟 {athleteName}
            </p>
          )}
        </div>
        <SyncButton hasStrava={hasStrava} />
      </div>

      {!hasStrava && (
        <div className="km-connect-strava">
          <p>
            Conectá tu cuenta de Strava para sincronizar tus kilómetros reales
            y empezar a competir.
          </p>
          <a href="/api/auth/strava" className="btn-primary">
            CONECTAR STRAVA
          </a>
        </div>
      )}

      <div className="km-ring-section">
        <ProgressRing totalKm={totalKm} goalKm={21} />
      </div>

      <div className="km-milestone-section">
        <MilestoneBar totalKm={totalKm} />
      </div>
    </>
  );
}

function KmSkeleton() {
  return (
    <>
      <SkeletonKmHeader />
      <div className="km-ring-section">
        <SkeletonRing />
      </div>
      <div className="km-milestone-section">
        <SkeletonMilestone />
      </div>
    </>
  );
}

export default async function KmPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className="km-page">
      <div className="container">
        <Suspense fallback={<KmSkeleton />}>
          <KmContent userId={user.id} />
        </Suspense>
      </div>
    </div>
  );
}
