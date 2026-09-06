import '@/styles/comunidad.css';
import '@/styles/skeleton.css';

export default function ComunidadLoading() {
  return (
    <div className="comunidad-page">
      {/* Banner skeleton */}
      <div
        className="skeleton"
        style={{
          height: '65vh',
          minHeight: 420,
          borderRadius: 0,
          opacity: 0.6,
        }}
      />
      {/* CTA skeleton */}
      <div
        style={{
          padding: 'var(--space-8) var(--space-6)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-6)',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <div className="skeleton" style={{ width: 52, height: 52, borderRadius: '50%', flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="skeleton skeleton-text-lg" style={{ width: 220 }} />
          <div className="skeleton skeleton-text-sm" style={{ width: 300 }} />
        </div>
        <div className="skeleton skeleton-btn" style={{ width: 180 }} />
      </div>
    </div>
  );
}
