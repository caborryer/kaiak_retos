export interface UserProfile {
  id: string;
  email: string;
  created_at: string;
}

export interface StravaConnection {
  id: string;
  user_id: string;
  strava_user_id: number;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  athlete_name: string | null;
  athlete_profile: string | null;
  connected_at: string;
}

export interface Activity {
  id: string;
  user_id: string;
  strava_activity_id: number;
  name: string | null;
  type: 'Run' | 'Walk' | 'Hike' | 'VirtualRun';
  distance_km: number;
  elapsed_time_seconds: number | null;
  start_date: string;
  synced_at: string;
}

export interface Challenge {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  distance_km: number | null;
  points_reward: number;
  icon: string;
  sort_order: number;
  is_active: boolean;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  completed_at: string;
  evidence_activity_id: string | null;
}

export interface Reward {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  points_required: number;
  image_url: string | null;
  category: string;
  sort_order: number;
  is_active: boolean;
}

export interface UserReward {
  id: string;
  user_id: string;
  reward_id: string;
  unlocked_at: string;
}

export type UserLevel = 'RUNNER' | 'FINISHER';

export function getUserLevel(points: number): { level: UserLevel; nextLevel: UserLevel | null; pointsToNext: number | null } {
  if (points >= 3000) {
    return { level: 'FINISHER', nextLevel: null, pointsToNext: null };
  }
  return { level: 'RUNNER', nextLevel: 'FINISHER', pointsToNext: 3000 - points };
}

export function getTotalPoints(completedChallenges: Array<{ challenge: Challenge }>): number {
  return completedChallenges.reduce((sum, uc) => sum + uc.challenge.points_reward, 0);
}
