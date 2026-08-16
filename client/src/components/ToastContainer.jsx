import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, ShieldCheck, Users } from 'lucide-react';

export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      maxWidth: '380px',
      width: '100%',
      pointerEvents: 'none'
    }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="glass-panel"
          style={{
            padding: '14px 18px',
            background: 'rgba(18, 24, 38, 0.92)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-glow)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            borderRadius: '14px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            pointerEvents: 'auto',
            animation: 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {toast.type === 'success' && <CheckCircle2 size={20} color="#34d399" />}
          {toast.type === 'warning' && <AlertTriangle size={20} color="#fbbf24" />}
          {toast.type === 'merged' && <Users size={20} color="#60a5fa" />}
          {toast.type === 'info' && <Bell size={20} color="#3b82f6" />}

          <div style={{ flex: 1 }}>
            <h5 style={{ margin: 0, fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>{toast.title}</h5>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{toast.message}</p>
          </div>

          <button
            onClick={() => onDismiss && onDismiss(toast.id)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '1.1rem' }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
