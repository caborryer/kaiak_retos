import '@/styles/skeleton.css';

export function SkeletonRing() {
  return (
    <div className="skeleton-ring-wrapper">
      <div className="skeleton-ring-outer skeleton" />
      <div className="skeleton-ring-center">
        <div className="skeleton skeleton-text-sm" style={{ width: 80 }} />
        <div className="skeleton skeleton-text-lg" style={{ width: 120 }} />
        <div className="skeleton skeleton-text-sm" style={{ width: 40 }} />
      </div>
    </div>
  );
}

export function SkeletonMilestone() {
  return (
    <div className="skeleton-milestone">
      <div className="skeleton skeleton-bar" />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
        <div className="skeleton skeleton-text-sm" style={{ width: 40 }} />
        <div className="skeleton skeleton-text-sm" style={{ width: 40 }} />
        <div className="skeleton skeleton-text-sm" style={{ width: 40 }} />
      </div>
    </div>
  );
}

export function SkeletonKmHeader() {
  return (
    <div className="skeleton-km-header">
      <div>
        <div className="skeleton skeleton-text-lg" style={{ width: 140, marginBottom: 8 }} />
        <div className="skeleton skeleton-text-sm" style={{ width: 240 }} />
      </div>
      <div className="skeleton skeleton-btn" />
    </div>
  );
}

export function SkeletonChallengeCard() {
  return (
    <div className="skeleton-challenge-card card">
      <div className="skeleton skeleton-icon" />
      <div className="skeleton skeleton-text-lg" style={{ width: '60%' }} />
      <div className="skeleton skeleton-text-sm" style={{ width: '80%' }} />
      <div className="skeleton skeleton-text-sm" style={{ width: '40%' }} />
    </div>
  );
}

export function SkeletonChallengesGrid() {
  return (
    <div className="skeleton-challenges-wrapper">
      <div className="skeleton-challenges-header">
        <div className="skeleton skeleton-text-lg" style={{ width: 220 }} />
        <div className="skeleton skeleton-text-sm" style={{ width: 80 }} />
      </div>
      <div className="skeleton-challenges-grid">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonChallengeCard key={i} />
        ))}
      </div>
      <div className="skeleton-points-panel card">
        <div>
          <div className="skeleton skeleton-text-sm" style={{ width: 100, marginBottom: 8 }} />
          <div className="skeleton skeleton-text-lg" style={{ width: 160 }} />
        </div>
        <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: 24 }}>
          <div className="skeleton skeleton-text-sm" style={{ width: 80, marginBottom: 8 }} />
          <div className="skeleton skeleton-text-lg" style={{ width: 120 }} />
        </div>
      </div>
    </div>
  );
}
