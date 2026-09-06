import '@/styles/comunidad.css';

export default function ComunidadBanner() {
  return (
    <div className="comunidad-banner">
      <div
        className="comunidad-banner-bg"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1400&q=80)',
        }}
      />
      <div className="comunidad-banner-overlay" />
      <div className="comunidad-banner-content">
        <div className="comunidad-banner-logo">
          <span>KAIAK</span>
          <span className="accent"> K21</span>
        </div>
        <h2 className="comunidad-banner-title">
          CORRÉ. SUMÁ.<br />DESBLOQUEÁ.
        </h2>
        <p className="comunidad-banner-subtitle">
          EL PERFUME QUE CORRE CONTIGO
        </p>
      </div>
    </div>
  );
}
