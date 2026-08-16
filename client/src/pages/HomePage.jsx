import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../services/api';
import CivicIllustration from '../components/CivicIllustration';
import IssueCard from '../components/IssueCard';
import { Users, Settings, FileText, ArrowRight, MapPin, AlertCircle, Clock, ShieldCheck, CheckCircle2, ChevronRight, Building2 } from 'lucide-react';

export default function HomePage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIssues = async () => {
      try {
        setLoading(true);
        const data = await fetchApi('/issues?limit=10');
        setIssues(data.issues || []);
      } catch (err) {
        console.error('Error loading featured issues:', err);
      } finally {
        setLoading(false);
      }
    };
    loadIssues();
  }, []);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* 1. TOP HERO SECTION (Replicating image_0.png) */}
      <section style={{ background: '#f0fdfa', padding: '60px 40px 70px 40px', borderBottom: '1px solid #e6f4f1' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>

          {/* Left Text & CTAs */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: '#ccfbf1', color: '#0f766e', fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px' }}>
              <span>📍 Your Ward, Your Voice</span>
            </div>
            <h1 style={{ fontSize: '2.8rem', color: '#0f172a', fontWeight: 800, lineHeight: '1.2', marginBottom: '20px', letterSpacing: '-0.5px' }}>
              Transforming <span style={{ color: '#0f766e' }}>Ward Infrastructure</span> into Resolved Solutions
            </h1>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.65', marginBottom: '32px', maxWidth: '520px' }}>
              Report local ward problems, coal dust pollution, open manholes, and track repairs with our transparent municipal platform.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link
                to="/login"
                className="btn"
                style={{
                  background: '#0f766e',
                  color: '#ffffff',
                  padding: '14px 28px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.98rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(15, 118, 110, 0.2)',
                  textDecoration: 'none'
                }}
              >
                <span>Get Started</span>
                <ChevronRight size={18} />
              </Link>

              <a
                href="#featured-issues"
                className="btn"
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#334155',
                  padding: '14px 28px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.98rem',
                  textDecoration: 'none',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                Explore Issues
              </a>
            </div>
          </div>

          {/* Right Hero Illustration Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 20px 40px -15px rgba(15, 118, 110, 0.15)',
            border: '1px solid #ccfbf1',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '320px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justify: 'center'
            }}>
              {/* Flat-style Vector SVG Scene: Woman using phone & road repair crew */}
              <svg viewBox="0 0 500 300" style={{ width: '100%', height: '100%' }}>
                {/* Background Cityscape */}
                <rect x="50" y="80" width="70" height="180" fill="rgba(255, 255, 255, 0.15)" rx="4" />
                <rect x="130" y="50" width="90" height="210" fill="rgba(255, 255, 255, 0.1)" rx="4" />
                <rect x="230" y="90" width="80" height="170" fill="rgba(255, 255, 255, 0.15)" rx="4" />

                {/* Road Surface & Pedestrian Crossing */}
                <rect x="0" y="220" width="500" height="80" fill="#1e293b" />
                <rect x="220" y="235" width="60" height="12" fill="#ffffff" rx="2" />
                <rect x="220" y="260" width="60" height="12" fill="#ffffff" rx="2" />

                {/* Citizen Character with Smartphone (Left) */}
                <circle cx="90" cy="170" r="22" fill="#0d9488" />
                <path d="M 65 240 Q 90 200 115 240 Z" fill="#0f766e" />
                <rect x="105" y="180" width="18" height="32" rx="4" fill="#38bdf8" />

                {/* Pothole & Road Workers (Right) */}
                <ellipse cx="380" cy="250" rx="40" ry="12" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                <circle cx="350" cy="180" r="20" fill="#f59e0b" />
                <path d="M 330 240 L 350 200 L 370 240 Z" fill="#334155" />

                <circle cx="420" cy="175" r="20" fill="#f59e0b" />
                <path d="M 400 240 L 420 195 L 440 240 Z" fill="#0f766e" />

                {/* Floating GPS Geotag Pin */}
                <g transform="translate(180, 110)">
                  <circle cx="30" cy="30" r="24" fill="#ffffff" />
                  <path d="M 30 14 C 21 14 14 21 14 30 C 14 42 30 56 30 56 C 30 56 46 42 46 30 C 46 21 39 14 30 14 Z" fill="#0f766e" />
                  <circle cx="30" cy="28" r="6" fill="#ffffff" />
                </g>
              </svg>
            </div>
          </div>

        </div>
      </section>


      {/* 2. 'HOW IT WORKS' SECTION (Replicating image_1.png) */}
      <section style={{ padding: '70px 40px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2rem', color: '#0f172a', fontWeight: 800, marginBottom: '8px' }}>How It Works</h2>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>Simple, transparent three-step process for civic problem resolution</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>

            {/* Step 1 Card */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '32px 24px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#f0fdfa', color: '#0f766e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={26} color="#0f766e" />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 700, margin: 0 }}>Report Issues</h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
                Take photos, add details, and submit infrastructure problems in your area with precise location tracking.
              </p>
            </div>

            {/* Step 2 Card */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '32px 24px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#f0fdfa', color: '#0f766e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Settings size={26} color="#0f766e" />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 700, margin: 0 }}>Government Validation</h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
                Officials review, approve, and allocate budget for repairs with AI-assisted cost estimation.
              </p>
            </div>

            {/* Step 3 Card */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '32px 24px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#f0fdfa', color: '#0f766e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={26} color="#0f766e" />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 700, margin: 0 }}>Contractor Bidding</h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
                Qualified contractors bid on projects, with transparent selection and progress tracking.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* 3. 'PRIORITY ISSUE DIRECTORY' SECTION (Dynamic Grid & Real API Data) */}
      <section id="featured-issues" style={{ padding: '70px 40px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2rem', color: '#0f172a', fontWeight: 800, marginBottom: '8px' }}>Priority Issue Directory</h2>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>Live geotagged reports with real-time AI classification & user-uploaded photo evidence</p>
          </div>

          {/* Dynamic Grid of Top 3 Issues */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              Loading priority issue directory...
            </div>
          ) : issues.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              No priority issues reported yet.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
              marginBottom: '40px'
            }}>
              {issues.slice(0, 3).map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <Link
              to="/register"
              className="btn"
              style={{
                background: '#0f766e',
                color: '#ffffff',
                padding: '14px 28px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.92rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(15, 118, 110, 0.2)'
              }}
            >
              <span>Explore All Live Issues</span>
              <ChevronRight size={18} />
            </Link>
          </div>

        </div>
      </section>


      {/* 4. 'JOIN OUR COMMUNITY' SECTION (Matching image_2.png) */}
      <section style={{ padding: '70px 40px', background: '#f0fdfa', borderTop: '1px solid #e6f4f1' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '48px', alignItems: 'center' }}>

          {/* Left Text & Sub-cards */}
          <div>
            <h2 style={{ fontSize: '2.2rem', color: '#0f172a', fontWeight: 800, marginBottom: '16px' }}>
              Join Our Ward Community
            </h2>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.65', marginBottom: '32px' }}>
              Whether you're a concerned citizen, a contractor, or a municipal official, WardFix provides the tools you need to improve neighborhood infrastructure.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

              {/* For Citizens Sub-card */}
              <div style={{
                background: '#ffffff',
                borderRadius: '10px',
                padding: '20px',
                border: '1px solid #ccfbf1',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}>
                <h4 style={{ color: '#0f766e', fontSize: '1.05rem', fontWeight: 700, margin: '0 0 8px 0' }}>For Citizens</h4>
                <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: '1.5', margin: 0 }}>
                  Report issues, track progress, and rate completed work
                </p>
              </div>

              {/* For Contractors Sub-card */}
              <div style={{
                background: '#ffffff',
                borderRadius: '10px',
                padding: '20px',
                border: '1px solid #ccfbf1',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}>
                <h4 style={{ color: '#0f766e', fontSize: '1.05rem', fontWeight: 700, margin: '0 0 8px 0' }}>For Contractors</h4>
                <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: '1.5', margin: 0 }}>
                  Find projects, submit bids, and manage your work
                </p>
              </div>

            </div>
          </div>

          {/* Right Illustration: Dramatic Comic-Style Community Crowd Holding Papers (Replicating image_2.png) */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 12px 30px rgba(15, 118, 110, 0.1)',
            border: '1px solid #ccfbf1',
            height: '280px'
          }}>
            <svg viewBox="0 0 500 280" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="warmSunburst" x1="50%" y1="100%" x2="50%" y2="0%">
                  <stop offset="0%" stopColor="#fef3c7" />
                  <stop offset="100%" stopColor="#ecfdf5" />
                </linearGradient>
              </defs>

              {/* Background Glow */}
              <rect x="0" y="0" width="500" height="280" fill="url(#warmSunburst)" />

              {/* Radial Energy Lines */}
              <g stroke="#fde047" strokeWidth="2.5" opacity="0.65">
                <line x1="250" y1="280" x2="20" y2="0" />
                <line x1="250" y1="280" x2="100" y2="0" />
                <line x1="250" y1="280" x2="180" y2="0" />
                <line x1="250" y1="280" x2="250" y2="0" />
                <line x1="250" y1="280" x2="320" y2="0" />
                <line x1="250" y1="280" x2="400" y2="0" />
                <line x1="250" y1="280" x2="480" y2="0" />
              </g>

              {/* Comic-Style Crowd Silhouettes & Raised Fists Holding Papers */}
              <g stroke="#0f172a" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
                {/* Arm 1 Left */}
                <path d="M 70 280 L 90 170 C 90 150 110 150 110 170 L 110 280 Z" fill="#b45309" />
                <rect x="75" y="125" width="45" height="35" rx="3" fill="#ffffff" fillOpacity="0.95" stroke="#0f172a" strokeWidth="3" />
                <line x1="82" y1="135" x2="108" y2="135" stroke="#0f172a" strokeWidth="2" />
                <line x1="82" y1="145" x2="102" y2="145" stroke="#0f172a" strokeWidth="2" />

                {/* Arm 2 Center Left */}
                <path d="M 160 280 L 180 130 C 180 110 200 110 200 130 L 200 280 Z" fill="#78350f" />
                <rect x="165" y="85" width="50" height="38" rx="3" fill="#ffffff" fillOpacity="0.95" stroke="#0f172a" strokeWidth="3" />
                <line x1="172" y1="96" x2="202" y2="96" stroke="#0f172a" strokeWidth="2" />
                <line x1="172" y1="106" x2="195" y2="106" stroke="#0f172a" strokeWidth="2" />

                {/* Arm 3 Center High (Hero Fist) */}
                <path d="M 250 280 L 270 100 C 270 80 290 80 290 100 L 290 280 Z" fill="#d97706" />
                <rect x="255" y="50" width="55" height="42" rx="3" fill="#ffffff" fillOpacity="0.95" stroke="#0f172a" strokeWidth="3" />
                <line x1="265" y1="62" x2="298" y2="62" stroke="#0f172a" strokeWidth="2.5" />
                <line x1="265" y1="74" x2="290" y2="74" stroke="#0f172a" strokeWidth="2.5" />

                {/* Arm 4 Center Right */}
                <path d="M 340 280 L 360 140 C 360 120 380 120 380 140 L 380 280 Z" fill="#92400e" />
                <rect x="345" y="95" width="48" height="36" rx="3" fill="#ffffff" fillOpacity="0.95" stroke="#0f172a" strokeWidth="3" />
                <line x1="352" y1="105" x2="380" y2="105" stroke="#0f172a" strokeWidth="2" />
                <line x1="352" y1="115" x2="374" y2="115" stroke="#0f172a" strokeWidth="2" />

                {/* Arm 5 Far Right */}
                <path d="M 430 280 L 445 175 C 445 155 465 155 465 175 L 465 280 Z" fill="#b45309" />
                <rect x="430" y="130" width="44" height="34" rx="3" fill="#ffffff" fillOpacity="0.95" stroke="#0f172a" strokeWidth="3" />
                <line x1="436" y1="140" x2="462" y2="140" stroke="#0f172a" strokeWidth="2" />
                <line x1="436" y1="150" x2="456" y2="150" stroke="#0f172a" strokeWidth="2" />
              </g>
            </svg>
          </div>

        </div>
      </section>


      {/* 5. DARK-NAVY FOOTER */}
      <footer style={{ background: '#1e293b', color: '#cbd5e1', padding: '50px 40px 30px 40px', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '40px', marginBottom: '40px' }}>

            {/* Col 1: WardFix Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', marginBottom: '14px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={18} color="#ffffff" />
                </div>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.3px' }}>WardFix</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.6', margin: 0, maxWidth: '280px' }}>
                Transforming ward issues into resolved solutions through transparency and accountability.
              </p>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px' }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
                <li><a href="#about" style={{ color: '#94a3b8', textDecoration: 'none' }}>About Us</a></li>
                <li><Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>Login</Link></li>
                <li><Link to="/register" style={{ color: '#94a3b8', textDecoration: 'none' }}>Register</Link></li>
                <li><Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>Report Issue</Link></li>
              </ul>
            </div>

            {/* Col 3: Resources */}
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px' }}>Resources</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#94a3b8' }}>
                <li>Public GIS Map</li>
                <li>API Documentation</li>
                <li>SLA Metrics</li>
              </ul>
            </div>

            {/* Col 4: Connect */}
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px' }}>Connect</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#94a3b8' }}>
                <li>Municipal Portal</li>
                <li>Contractor Operations</li>
                <li>Support Desk</li>
              </ul>
            </div>

          </div>

          <div style={{ borderTop: '1px solid #334155', paddingTop: '24px', textAlign: 'center', fontSize: '0.82rem', color: '#64748b' }}>
            © 2026 WardFix Urban Operations Portal. All rights reserved.
          </div>

        </div>
      </footer>

    </div>
  );
}
