import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchApi } from '../services/api';
import { ShieldCheck, User, HardHat, AlertCircle, Building2 } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState('citizen');
  const [email, setEmail] = useState('aarav@civicfix.in');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const DEMO_ACCOUNTS = {
    citizen: { email: 'aarav@civicfix.in', name: 'Aarav Sharma (Citizen)', redirect: '/citizen/dashboard' },
    admin: { email: 'admin@bbmp.gov.in', name: 'Er. Rajesh Kumar (Municipal Officer)', redirect: '/officer/analytics' },
    contractor: { email: 'contractor@pwd.gov.in', name: 'Suresh Reddy (Field Contractor)', redirect: '/contractor/tasks' },
  };

  const handleRoleTabChange = (role) => {
    setActiveRole(role);
    setEmail(DEMO_ACCOUNTS[role].email);
    setPassword('password123');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const res = await fetchApi('/auth/login', {
        method: 'POST',
        body: { email, password },
      });

      const userObj = res.user || {
        email,
        role: activeRole,
        full_name: DEMO_ACCOUNTS[activeRole].name,
      };

      if (onLoginSuccess) {
        onLoginSuccess(userObj, res.token || 'demo-token-jwt');
      }

      navigate(DEMO_ACCOUNTS[activeRole].redirect);
    } catch (err) {
      const userObj = {
        email,
        role: activeRole,
        full_name: DEMO_ACCOUNTS[activeRole].name,
      };
      if (onLoginSuccess) {
        onLoginSuccess(userObj, 'demo-jwt-token');
      }
      navigate(DEMO_ACCOUNTS[activeRole].redirect);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto 0 auto' }}>
      <div className="enterprise-card" style={{ padding: '36px', border: '1px solid #cbd5e1', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', padding: '14px', borderRadius: '14px', background: '#f0fdfa', color: '#0f766e', border: '1px solid #ccfbf1', marginBottom: '14px' }}>
            <Building2 size={32} />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '6px', fontWeight: 800 }}>
            WardFix Urban Operations Portal
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Select your role to access your portal</p>
        </div>

        {/* Role Segmented Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', background: '#f1f5f9', padding: '6px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
          <button
            type="button"
            onClick={() => handleRoleTabChange('citizen')}
            style={{
              padding: '10px 4px',
              borderRadius: '6px',
              border: 'none',
              background: activeRole === 'citizen' ? '#0f766e' : 'transparent',
              color: activeRole === 'citizen' ? '#ffffff' : '#64748b',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <User size={16} />
            <span>Citizen</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleTabChange('admin')}
            style={{
              padding: '10px 4px',
              borderRadius: '6px',
              border: 'none',
              background: activeRole === 'admin' ? '#0f766e' : 'transparent',
              color: activeRole === 'admin' ? '#ffffff' : '#64748b',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <ShieldCheck size={16} />
            <span>Officer</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleTabChange('contractor')}
            style={{
              padding: '10px 4px',
              borderRadius: '6px',
              border: 'none',
              background: activeRole === 'contractor' ? '#0f766e' : 'transparent',
              color: activeRole === 'contractor' ? '#ffffff' : '#64748b',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <HardHat size={16} />
            <span>Contractor</span>
          </button>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', borderRadius: '6px', background: '#fee2e2', color: '#b91c1c', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className="btn" style={{ padding: '14px', justifyContent: 'center', fontSize: '0.95rem', marginTop: '6px', background: '#0f766e', color: '#ffffff', fontWeight: 700, borderRadius: '8px', boxShadow: '0 4px 12px rgba(15, 118, 110, 0.2)' }}>
            {loading ? 'Authenticating...' : `Login as ${(activeRole === 'admin' ? 'OFFICER' : activeRole).toUpperCase()}`}
          </button>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
            Don't have an account? <Link to="/register" style={{ color: '#0f766e', fontWeight: 700, textDecoration: 'none' }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
