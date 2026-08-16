import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertCircle, Map, PlusCircle, ShieldCheck, User, HardHat, LogIn } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, marginBottom: '24px' }}>
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', flexWrap: 'wrap', gap: '16px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg, #ff9933, #ffffff, #138808)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
            <AlertCircle size={24} color="#000080" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.4rem', color: '#fff', margin: 0, fontWeight: 700 }}>CivicFix India</h1>
              <span style={{ fontSize: '1rem' }}>🇮🇳</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#93c5fd', margin: 0 }}>Swachhata & Municipal Issue Tracking Portal</p>
          </div>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/" className={`btn ${isActive('/') ? 'btn-primary' : 'btn-secondary'}`}>
            <Map size={16} />
            <span>Live Map</span>
          </Link>

          <Link to="/report" className={`btn ${isActive('/report') ? 'btn-primary' : 'btn-secondary'}`}>
            <PlusCircle size={16} />
            <span>Report Issue</span>
          </Link>

          <Link to="/citizen/dashboard" className={`btn ${isActive('/citizen/dashboard') ? 'btn-primary' : 'btn-secondary'}`}>
            <User size={16} />
            <span>Citizen</span>
          </Link>

          <Link to="/officer/analytics" className={`btn ${isActive('/officer/analytics') ? 'btn-primary' : 'btn-secondary'}`}>
            <ShieldCheck size={16} color="#fbbf24" />
            <span>Officer</span>
          </Link>

          <Link to="/contractor/tasks" className={`btn ${isActive('/contractor/tasks') ? 'btn-primary' : 'btn-secondary'}`}>
            <HardHat size={16} color="#f59e0b" />
            <span>Contractor</span>
          </Link>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', margin: 0 }}>{user.full_name}</p>
                <span className="badge badge-submitted">{user.role}</span>
              </div>
              <button onClick={onLogout} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ fontSize: '0.85rem', gap: '6px' }}>
              <LogIn size={16} /> Role Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}


