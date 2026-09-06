import { SkeletonChallengesGrid } from '@/components/ui/Skeletons';
import '@/styles/challenges.css';
import '@/styles/skeleton.css';

export default function ChallengesLoading() {
  return (
    <div className="challenges-page">
      <div className="container">
        <SkeletonChallengesGrid />
      </div>
    </div>
  );
}
