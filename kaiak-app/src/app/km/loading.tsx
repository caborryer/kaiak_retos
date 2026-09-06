import { SkeletonRing, SkeletonMilestone, SkeletonKmHeader } from '@/components/ui/Skeletons';
import '@/styles/km.css';
import '@/styles/skeleton.css';

export default function KmLoading() {
  return (
    <div className="km-page">
      <div className="container">
        <SkeletonKmHeader />
        <div className="km-ring-section">
          <SkeletonRing />
        </div>
        <div className="km-milestone-section">
          <SkeletonMilestone />
        </div>
      </div>
    </div>
  );
}
