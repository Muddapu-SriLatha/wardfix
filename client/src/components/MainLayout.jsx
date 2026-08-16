import { Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Building2, LogIn, UserPlus } from 'lucide-react';

export default function MainLayout({ children, user, onLogout }) {
  const location = useLocation();
  const isLandingOrAuthPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';

  if (!user || isLandingOrAuthPage) {
    // Public Landing / Auth Layout (No Sidebar, Top Navbar with Login, Register, About)
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: '70px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', sticky: 'top', zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #0d9488, #0f766e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <Building2 size={22} />
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f766e', letterSpacing: '-0.5px' }}>WardFix</span>
          </div>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <Link to="/login" style={{ fontSize: '0.92rem', fontWeight: 600, color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LogIn size={16} />
              <span>Login</span>
            </Link>
            <Link to="/register" style={{ fontSize: '0.92rem', fontWeight: 600, color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserPlus size={16} />
              <span>Register</span>
            </Link>
            <a href="#about" style={{ fontSize: '0.92rem', fontWeight: 600, color: '#475569', textDecoration: 'none' }}>About</a>
          </nav>
        </header>

        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    );
  }

  // Authenticated Role Portal Layout (With Collapsible Sidebar)
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)' }}>
      {/* Persistent Left Sidebar */}
      <Sidebar user={user} onLogout={onLogout} />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Corporate Utility Bar */}
        <header style={{ height: '56px', background: '#ffffff', borderBottom: '1px solid var(--border-subtle)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f766e' }}>WardFix Urban Operations Portal</span>
            <span style={{ color: 'var(--border-strong)' }}>|</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Municipal Operations & Spatial Intelligence System</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              <span>API Gateway Connected</span>
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
