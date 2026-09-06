import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import RewardCard from '@/components/rewards/RewardCard';
import type { Reward } from '@/types';
import '@/styles/rewards.css';

// Rewards catalog changes rarely — cache for 60s
export const revalidate = 60;

async function getRewardsData(userId: string) {
  const supabase = await createClient();

  const [{ data: rewards }, { data: userRewards }] = await Promise.all([
    supabase.from('rewards').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('user_rewards').select('reward_id').eq('user_id', userId),
  ]);

  const unlockedIds = new Set((userRewards || []).map((r) => r.reward_id));

  return { rewards: rewards || [], unlockedIds };
}

export default async function RewardsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { rewards, unlockedIds } = await getRewardsData(user.id);

  return (
    <div className="rewards-page">
      <div className="container">
        <div className="rewards-header">
          <div>
            <h1 className="rewards-title">REWARDS</h1>
            <p className="rewards-subtitle">CORRÉ. SUMÁ. DESBLOQUEÁ.</p>
          </div>
          <a href="#" className="rewards-see-all">VER TODOS LOS REWARDS</a>
        </div>

        <div className="rewards-grid">
          {rewards.map((reward: Reward, index: number) => (
            <RewardCard
              key={reward.id}
              name={reward.name}
              pointsRequired={reward.points_required}
              imageUrl={reward.image_url}
              unlocked={unlockedIds.has(reward.id)}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
