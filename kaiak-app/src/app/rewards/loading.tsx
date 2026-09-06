import '@/styles/rewards.css';
import '@/styles/skeleton.css';

function SkeletonRewardCard() {
  return (
    <div className="reward-card">
      <div
        className="skeleton"
        style={{ width: '100%', aspectRatio: '1/1', borderRadius: 0 }}
      />
      <div style={{ padding: '12px 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="skeleton skeleton-text-sm" style={{ width: '80%' }} />
        <div className="skeleton skeleton-text-sm" style={{ width: '50%' }} />
      </div>
    </div>
  );
}

export default function RewardsLoading() {
  return (
    <div className="rewards-page">
      <div className="container">
        <div className="rewards-header" style={{ paddingTop: 'var(--space-8)' }}>
          <div>
            <div className="skeleton skeleton-text-lg" style={{ width: 160, marginBottom: 8 }} />
            <div className="skeleton skeleton-text-sm" style={{ width: 220 }} />
          </div>
        </div>
        <div className="rewards-grid">
          {[0, 1, 2, 3, 4].map((i) => (
            <SkeletonRewardCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
