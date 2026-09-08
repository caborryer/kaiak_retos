'use client';

import { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import '@/styles/login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'No se pudo enviar el link');
      } else {
        setSent(true);
      }
    } catch {
      setError('No se pudo enviar el link. Intentá de nuevo.');
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo">
          <span className="login-logo-kaiak">KAIAK</span>
          <span className="login-logo-k21">K21</span>
        </div>

        <p className="login-tagline">EL PERFUME QUE CORRE CONTIGO</p>

        {!sent ? (
          <form onSubmit={handleLogin} className="login-form">
            <div className="login-field">
              <label htmlFor="email" className="login-label">
                Tu email
              </label>
              <div className="login-input-wrapper">
                <Mail size={18} className="login-input-icon" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="login-input"
                  required
                />
              </div>
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <><Loader2 size={18} className="spin" /> Enviando...</>
              ) : (
                'INGRESAR CON MAGIC LINK'
              )}
            </button>
          </form>
        ) : (
          <div className="login-sent">
            <div className="login-sent-icon">✉️</div>
            <h2>¡Revisá tu email!</h2>
            <p>Te enviamos un link de acceso a <strong>{email}</strong></p>
          </div>
        )}
      </div>
    </div>
  );
}
