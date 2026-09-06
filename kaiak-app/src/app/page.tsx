import Link from 'next/link';
import HeroPhone from '@/components/home/HeroPhone';
import { ArrowRight, Activity, Trophy, Gift } from 'lucide-react';
import '@/styles/home.css';

export default function HomePage() {
  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-tagline">EL PERFUME QUE CORRE CONTIGO</p>
          <h1 className="hero-title">
            ACTIVÁ TU<br />
            MOMENTO<br />
            <span className="hero-title-accent">21K</span>
          </h1>
          <p className="hero-subtitle">
            Tu cuerpo se mueve. Tu fragancia responde.
            Registrá tus km y desbloqueá recompensas exclusivas de KAIAK K21.
          </p>
          <div className="hero-cta-group">
            <Link href="/km" className="btn-primary hero-btn">
              SUMÁ TUS KM <ArrowRight size={18} />
            </Link>
            <Link href="/challenges" className="btn-secondary hero-btn">
              VER RETOS
            </Link>
          </div>
        </div>

        <HeroPhone />
      </section>

      {/* Features strip */}
      <section className="home-features">
        <div className="container">
          <div className="home-features-grid">
            <div className="home-feature-item">
              <div className="home-feature-icon">
                <Activity size={28} color="#4FCBFE" />
              </div>
              <h3>SUMÁ KM</h3>
              <p>Cada actividad cuenta. Cada paso te acerca a tus grandes recompensas.</p>
            </div>
            <div className="home-feature-item">
              <div className="home-feature-icon">
                <Trophy size={28} color="#EE8148" />
              </div>
              <h3>DESBLOQUEÁ REWARDS</h3>
              <p>Acumulá puntos y canjealos por productos y experiencias increíbles.</p>
            </div>
            <div className="home-feature-item">
              <div className="home-feature-icon">
                <Gift size={28} color="#3797E1" />
              </div>
              <h3>SOMOS COMUNIDAD</h3>
              <p>Corré, sumá y compartí con runners como vos.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
