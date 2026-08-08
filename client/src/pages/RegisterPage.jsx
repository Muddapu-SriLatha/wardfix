import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchApi } from '../services/api';
import { User, AlertCircle } from 'lucide-react';

export default function RegisterPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const res = await fetchApi('/auth/register', {
        method: 'POST',
        body: {
          full_name: fullName,
          email,
          password,
          role,
        },
      });

      const registeredUser = res.user || {
        full_name: fullName,
        email,
        role,
      };

      if (onLoginSuccess) {
        onLoginSuccess(registeredUser, res.token || 'demo-jwt-token');
      }

      alert(`✅ Account created for ${fullName}! Logged in as ${role.toUpperCase()}.`);

      if (role === 'admin') navigate('/officer/analytics');
      else if (role === 'contractor') navigate('/contractor/tasks');
      else navigate('/citizen/dashboard');
    } catch (err) {
      // Local demo fallback if account exists or offline
      const registeredUser = {
        full_name: fullName,
        email,
        role,
      };
      if (onLoginSuccess) {
        onLoginSuccess(registeredUser, 'demo-jwt-token');
      }
      alert(`✅ Welcome, ${fullName}! Logged in as ${role.toUpperCase()}.`);
      if (role === 'admin') navigate('/officer/analytics');
      else if (role === 'contractor') navigate('/contractor/tasks');
      else navigate('/citizen/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto 0 auto' }}>
      <div className="enterprise-card" style={{ padding: '36px', border: '1px solid #cbd5e1', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', padding: '14px', borderRadius: '14px', background: '#f0fdfa', color: '#0f766e', border: '1px solid #ccfbf1', marginBottom: '14px' }}>
            <User size={32} />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '6px', fontWeight: 800 }}>
            Register New Account
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Create your custom user profile for WardFix</p>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', borderRadius: '6px', background: '#fee2e2', color: '#b91c1c', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Verma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Email Address *</label>
            <input
              type="email"
              required
              placeholder="e.g. rahul@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Account Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="citizen">Citizen (Report & Track)</option>
              <option value="admin">Municipal Officer (Triage & Dispatch)</option>
              <option value="contractor">Field Contractor (Work Orders)</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn" style={{ padding: '14px', justifyContent: 'center', fontSize: '0.95rem', marginTop: '6px', background: '#0f766e', color: '#ffffff', fontWeight: 700, borderRadius: '8px', boxShadow: '0 4px 12px rgba(15, 118, 110, 0.2)' }}>
            {loading ? 'Creating Profile...' : 'Register Account'}
          </button>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
            Already registered? <Link to="/login" style={{ color: '#0f766e', fontWeight: 700, textDecoration: 'none' }}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
