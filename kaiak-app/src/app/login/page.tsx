'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
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

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
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
