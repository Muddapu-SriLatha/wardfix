import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, MapPin, PlusCircle, FileText, Bell, BarChart3, Inbox,
  Users, TrendingUp, Truck, Navigation, Camera, ChevronLeft, ChevronRight,
  LogOut, Shield, User, HardHat, Building2
} from 'lucide-react';

export default function Sidebar({ user, onLogout }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const activeRole = user ? user.role : 'citizen';

  const isActive = (path) => location.pathname === path;

  // Role-Aware Navigation Links
  const CITIZEN_LINKS = [
    { label: 'Home / Live Feed', path: '/explore', icon: Home },
    { label: 'Interactive Map', path: '/map', icon: MapPin },
    { label: 'Report New Issue', path: '/report', icon: PlusCircle },
    { label: 'My Submissions', path: '/citizen/dashboard', icon: FileText },
    { label: 'Activity Alerts', path: '/citizen/dashboard', icon: Bell },
  ];

  const OFFICER_LINKS = [
    { label: 'City Overview & Heatmap', path: '/officer/analytics', icon: BarChart3 },
    { label: 'Issue Triage Queue', path: '/officer/analytics', icon: Inbox },
    { label: 'Assign Contractors', path: '/officer/analytics', icon: Users },
    { label: 'Department Analytics', path: '/officer/analytics', icon: TrendingUp },
  ];

  const CONTRACTOR_LINKS = [
    { label: 'Assigned Work Orders', path: '/contractor/tasks', icon: Truck },
    { label: 'Optimized Route Map', path: '/contractor/tasks', icon: Navigation },
    { label: 'Proof Upload', path: '/contractor/tasks', icon: Camera },
  ];

  let currentNavLinks = CITIZEN_LINKS;
  if (activeRole === 'admin' || activeRole === 'officer') {
    currentNavLinks = OFFICER_LINKS;
  } else if (activeRole === 'contractor') {
    currentNavLinks = CONTRACTOR_LINKS;
  }

  const getRoleIcon = () => {
    if (activeRole === 'admin' || activeRole === 'officer') return <Shield size={16} color="#f59e0b" />;
    if (activeRole === 'contractor') return <HardHat size={16} color="#14b8a6" />;
    return <User size={16} color="#38bdf8" />;
  };

  return (
    <aside
      style={{
        width: isCollapsed ? '72px' : '260px',
        minHeight: '100vh',
        background: '#0f172a',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderRight: '1px solid #1e293b',
      }}
    >
      {/* Top Header: WardFix Portal Branding */}
      <div>
        <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#fff', overflow: 'hidden' }}>
            <div style={{ background: '#0f766e', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(15, 118, 110, 0.3)' }}>
              <Building2 size={20} color="#ffffff" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 style={{ fontSize: '1.1rem', color: '#ffffff', margin: 0, fontWeight: 800, whiteSpace: 'nowrap', letterSpacing: '-0.3px' }}>WardFix Portal</h2>
                <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0, whiteSpace: 'nowrap' }}>Urban Operations System</p>
              </div>
            )}
          </Link>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              background: '#1e293b',
              border: 'none',
              color: '#94a3b8',
              borderRadius: '6px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
            }}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Active Role Banner */}
        {!isCollapsed && (
          <div style={{ padding: '12px 16px', background: '#182234', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Active Role: <span style={{ color: '#ffffff' }}>{activeRole.toUpperCase()}</span></span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <Link to="/login" style={{ fontSize: '0.75rem', color: '#14b8a6', fontWeight: 700, textDecoration: 'none' }}>Switch Role →</Link>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav style={{ padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {currentNavLinks.map((item, idx) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={idx}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  color: active ? '#ffffff' : '#94a3b8',
                  background: active ? '#0f766e' : 'transparent',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: active ? 700 : 500,
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  boxShadow: active ? '0 4px 12px rgba(15, 118, 110, 0.25)' : 'none'
                }}
              >
                <Icon size={18} color={active ? '#ffffff' : '#94a3b8'} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Profile Card & Logout Control */}
      <div style={{ padding: '16px', borderTop: '1px solid #1e293b', background: '#0b1322' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0f766e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 800, fontSize: '0.9rem' }}>
                {user.full_name ? user.full_name.charAt(0) : 'U'}
              </div>
              {!isCollapsed && (
                <div style={{ overflow: 'hidden' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#ffffff', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.full_name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {getRoleIcon()}
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'capitalize', fontWeight: 600 }}>{user.role}</span>
                  </div>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={() => {
                  if (onLogout) onLogout();
                  navigate('/');
                }}
                title="Logout"
                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center' }}
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: '#0f766e',
              color: '#ffffff',
              fontSize: '0.85rem',
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            <Shield size={16} />
            {!isCollapsed && <span>Sign In</span>}
          </Link>
        )}
      </div>
    </aside>
  );
}
