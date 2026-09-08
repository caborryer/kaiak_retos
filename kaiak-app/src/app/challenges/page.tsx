import type { Metadata } from 'next';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { kmCutoffISO } from '@/lib/date';
import ChallengeCard from '@/components/challenges/ChallengeCard';
import PointsPanel from '@/components/challenges/PointsPanel';
import { SkeletonChallengesGrid } from '@/components/ui/Skeletons';

// Revalidate every 30s — balances freshness vs Supabase round-trips
export const revalidate = 30;
import type { Challenge } from '@/types';
import '@/styles/challenges.css';
import '@/styles/skeleton.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kaiak-app.vercel.app';

export const metadata: Metadata = {
  title: 'Retos KAIAK K21 — Completá desafíos y sumá puntos',
  description:
    'Descubrí los retos de KAIAK K21. Completá desafíos de distancia, acumulá puntos y desbloqueá recompensas exclusivas.',
  alternates: {
    canonical: `${siteUrl}/challenges`,
  },
  openGraph: {
    title: 'Retos KAIAK K21 — Completá desafíos y sumá puntos',
    description:
      'Descubrí los retos de KAIAK K21. Completá desafíos de distancia, acumulá puntos y desbloqueá recompensas exclusivas.',
    url: `${siteUrl}/challenges`,
  },
  twitter: {
    title: 'Retos KAIAK K21 — Completá desafíos y sumá puntos',
    description:
      'Descubrí los retos de KAIAK K21. Completá desafíos de distancia, acumulá puntos y desbloqueá recompensas exclusivas.',
  },
};


async function ChallengesContent({ userId }: { userId: string }) {
  const supabase = await createClient();

  const [
    { data: challenges },
    { data: userChallenges },
    { data: activities },
  ] = await Promise.all([
    supabase.from('challenges').select('*').eq('is_active', true).order('sort_order'),
    supabase
      .from('user_challenges')
      .select('challenge_id, challenges(points_reward)')
      .eq('user_id', userId),
    supabase
      .from('activities')
      .select('id, distance_km')
      .eq('user_id', userId)
      .gte('start_date', kmCutoffISO()),
  ]);

  // A challenge is completed with a SINGLE activity session
  const completedIds = new Set((userChallenges || []).map((uc) => uc.challenge_id));

  // A single activity completes only the HIGHEST distance challenge it reaches
  const distanceChallenges = (challenges || [])
    .filter((c) => c.distance_km)
    .sort((a, b) => (a.distance_km || 0) - (b.distance_km || 0));

  const toComplete: Challenge[] = [];
  const evidenceByChallenge = new Map<string, string>();

  for (const a of activities || []) {
    const km = a.distance_km || 0;
    const qualifying = distanceChallenges.filter((c) => km >= (c.distance_km || 0));
    const highest = qualifying[qualifying.length - 1];
    if (
      highest &&
      !completedIds.has(highest.id) &&
      !toComplete.some((c) => c.id === highest.id)
    ) {
      toComplete.push(highest);
      evidenceByChallenge.set(highest.id, a.id);
    }
  }

  if (toComplete.length > 0) {
    await supabase.from('user_challenges').insert(
      toComplete.map((c) => ({
        user_id: userId,
        challenge_id: c.id,
        evidence_activity_id: evidenceByChallenge.get(c.id) ?? null,
      }))
    );
    toComplete.forEach((c) => completedIds.add(c.id));
  }

  const totalPoints = [
    ...(userChallenges || []),
    ...toComplete.map((c) => ({ challenges: { points_reward: c.points_reward } })),
  ].reduce((sum, uc) => sum + ((uc as any).challenges?.points_reward || 0), 0);

  // Unlock eligible rewards
  const [{ data: rewards }, { data: userRewards }] = await Promise.all([
    supabase.from('rewards').select('id, points_required').eq('is_active', true),
    supabase.from('user_rewards').select('reward_id').eq('user_id', userId),
  ]);

  const unlockedRewardIds = new Set((userRewards || []).map((r) => r.reward_id));
  const toUnlock = (rewards || []).filter(
    (r) => totalPoints >= r.points_required && !unlockedRewardIds.has(r.id)
  );

  if (toUnlock.length > 0) {
    await supabase.from('user_rewards').insert(
      toUnlock.map((r) => ({ user_id: userId, reward_id: r.id }))
    );
  }

  return (
    <>
      <div className="challenges-header">
        <h1 className="challenges-title">TUS CHALLENGES</h1>
        <a href="#" className="challenges-see-all">VER TODOS</a>
      </div>

      <div className="challenges-grid">
        {(challenges || []).map((challenge: Challenge, index: number) => (
          <ChallengeCard
            key={challenge.id}
            name={challenge.name}
            description={challenge.description}
            distanceKm={challenge.distance_km}
            points={challenge.points_reward}
            icon={challenge.icon}
            completed={completedIds.has(challenge.id)}
            index={index}
          />
        ))}
      </div>

      <PointsPanel totalPoints={totalPoints} />
    </>
  );
}

export default async function ChallengesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className="challenges-page">
      <div className="container">
        <Suspense fallback={<SkeletonChallengesGrid />}>
          <ChallengesContent userId={user.id} />
        </Suspense>
      </div>
    </div>
  );
}
