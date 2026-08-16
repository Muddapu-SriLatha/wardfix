import React from 'react';

export default function CivicIllustration({ category = 'coal_pollution', height = '180px' }) {
  const getCategoryTheme = () => {
    switch (category) {
      case 'coal_pollution':
        return {
          title: 'Coal Dust & Mining Pollution',
          bg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          accent: '#f59e0b',
          badgeBg: '#78350f',
          badgeText: '#fef3c7',
          icon: '⛏️',
          sub: 'Airborne Coal Dust & Mining Tipper Hazard',
          svgContent: (
            <g>
              {/* Animated Coal Dust Cloud */}
              <circle cx="80" cy="60" r="35" fill="rgba(245, 158, 11, 0.15)">
                <animate attributeName="r" values="30;42;30" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="120" cy="50" r="28" fill="rgba(255, 255, 255, 0.1)">
                <animate attributeName="cx" values="115;125;115" dur="5s" repeatCount="indefinite" />
              </circle>
              {/* Tipper Truck Vector */}
              <rect x="200" y="70" width="80" height="40" rx="6" fill="#f59e0b" />
              <rect x="280" y="80" width="35" height="30" rx="4" fill="#334155" />
              <circle cx="225" cy="115" r="14" fill="#0f172a" stroke="#cbd5e1" strokeWidth="4" />
              <circle cx="295" cy="115" r="14" fill="#0f172a" stroke="#cbd5e1" strokeWidth="4" />
              {/* Road Ground */}
              <line x1="20" y1="128" x2="380" y2="128" stroke="#475569" strokeWidth="4" strokeDasharray="12,12" />
            </g>
          )
        };
      case 'pothole':
        return {
          title: 'Pothole & Asphalt Subsidence',
          bg: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
          accent: '#ef4444',
          badgeBg: '#991b1b',
          badgeText: '#fee2e2',
          icon: '🕳️',
          sub: 'Road Surface Crater Hazard',
          svgContent: (
            <g>
              {/* Road Crater Vector */}
              <ellipse cx="200" cy="90" rx="80" ry="25" fill="#0f172a" stroke="#ef4444" strokeWidth="3" />
              <ellipse cx="200" cy="90" rx="60" ry="18" fill="#1e293b" />
              {/* Caution Stripes */}
              <path d="M 60 120 L 100 120 L 80 135 Z" fill="#f59e0b" />
              <path d="M 300 120 L 340 120 L 320 135 Z" fill="#f59e0b" />
            </g>
          )
        };
      case 'manhole':
        return {
          title: 'Open Manhole & Storm Drain',
          bg: 'linear-gradient(135deg, #0369a1 0%, #0f172a 100%)',
          accent: '#38bdf8',
          badgeBg: '#075985',
          badgeText: '#e0f2fe',
          icon: '🚨',
          sub: 'Drainage Lid Displacement',
          svgContent: (
            <g>
              <circle cx="200" cy="85" r="45" fill="#0f172a" stroke="#38bdf8" strokeWidth="4" />
              <circle cx="200" cy="85" r="35" fill="none" stroke="#0284c7" strokeWidth="2" strokeDasharray="6,6" />
              <circle cx="200" cy="85" r="10" fill="#38bdf8">
                <animate attributeName="r" values="8;16;8" dur="2.5s" repeatCount="indefinite" />
              </circle>
            </g>
          )
        };
      case 'garbage':
        return {
          title: 'Solid Waste & Swachhata Dump',
          bg: 'linear-gradient(135deg, #065f46 0%, #064e3b 100%)',
          accent: '#10b981',
          badgeBg: '#064e3b',
          badgeText: '#d1fae5',
          icon: '♻️',
          sub: 'Uncollected Municipal Dumping Spot',
          svgContent: (
            <g>
              <rect x="170" y="55" width="60" height="65" rx="8" fill="#10b981" />
              <rect x="160" y="45" width="80" height="12" rx="4" fill="#047857" />
              <path d="M 190 75 L 210 75 M 200 65 L 200 95" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
            </g>
          )
        };
      default:
        return {
          title: 'Municipal Civic Infrastructure Issue',
          bg: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
          accent: '#3b82f6',
          badgeBg: '#1e3a8a',
          badgeText: '#dbeafe',
          icon: '🏢',
          sub: 'Geotagged Public Infrastructure Report',
          svgContent: (
            <g>
              <rect x="160" y="45" width="80" height="80" rx="8" fill="#2563eb" />
              <rect x="180" y="60" width="16" height="16" rx="2" fill="#ffffff" />
              <rect x="204" y="60" width="16" height="16" rx="2" fill="#ffffff" />
              <rect x="180" y="84" width="16" height="16" rx="2" fill="#ffffff" />
              <rect x="204" y="84" width="16" height="16" rx="2" fill="#ffffff" />
            </g>
          )
        };
    }
  };

  const theme = getCategoryTheme();

  return (
    <div style={{
      width: '100%',
      height: height,
      borderRadius: '12px',
      background: theme.bg,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)',
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      {/* Background Animated SVG Canvas */}
      <svg
        viewBox="0 0 400 150"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.85 }}
      >
        {theme.svgContent}
      </svg>

      {/* Top Category Badge */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        padding: '4px 10px',
        borderRadius: '6px',
        background: theme.badgeBg,
        color: theme.badgeText,
        fontSize: '0.75rem',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        zIndex: 2,
        backdropFilter: 'blur(4px)'
      }}>
        <span>{theme.icon}</span>
        <span>{theme.title}</span>
      </div>

      {/* Bottom Subtitle Bar */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '12px',
        right: '12px',
        padding: '6px 12px',
        borderRadius: '6px',
        background: 'rgba(15, 23, 42, 0.75)',
        color: '#cbd5e1',
        fontSize: '0.78rem',
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        backdropFilter: 'blur(6px)'
      }}>
        <span>{theme.sub}</span>
        <span style={{ color: theme.accent, fontWeight: 600 }}>Vector Illustration</span>
      </div>
    </div>
  );
}
