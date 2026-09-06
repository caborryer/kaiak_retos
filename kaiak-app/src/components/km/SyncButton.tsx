'use client';

import { useState } from 'react';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface SyncButtonProps {
  hasStrava: boolean;
}

export default function SyncButton({ hasStrava }: SyncButtonProps) {
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!hasStrava) return null;

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    setSynced(false);

    try {
      const res = await fetch('/api/strava/sync', { method: 'POST' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Error al sincronizar');
      }
      setSynced(true);
      setTimeout(() => {
        setSynced(false);
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="sync-button-wrapper">
      {error && (
        <p className="sync-error">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
      <button
        className={`btn-primary sync-btn ${syncing ? 'syncing' : ''} ${synced ? 'synced' : ''}`}
        onClick={handleSync}
        disabled={syncing || synced}
      >
        {synced ? (
          <>
            <CheckCircle size={16} />
            SINCRONIZADO
          </>
        ) : syncing ? (
          <>
            <RefreshCw size={16} className="spin" />
            SINCRONIZANDO...
          </>
        ) : (
          <>
            <RefreshCw size={16} />
            ACTUALIZAR KM
          </>
        )}
      </button>
    </div>
  );
}
