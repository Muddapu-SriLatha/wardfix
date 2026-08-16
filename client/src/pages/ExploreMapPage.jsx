import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import IssueMap from '../components/IssueMap';
import IssueCard from '../components/IssueCard';
import { fetchApi } from '../services/api';
import { MapPin, Search, Navigation, AlertCircle, Filter, CheckCircle2, Clock, Shield } from 'lucide-react';

export default function ExploreMapPage() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const loadIssues = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/issues?limit=50');
      setIssues(data.issues || []);
    } catch (err) {
      console.error('Error loading map issues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const handleUpvote = async (issueId) => {
    try {
      const res = await fetchApi(`/issues/${issueId}/upvote`, { method: 'POST' });
      setIssues((prev) =>
        prev.map((item) =>
          item.id === issueId ? { ...item, upvotes_count: res.upvotes_count } : item
        )
      );
    } catch (err) {
      console.error('Error upvoting issue:', err);
    }
  };

  const filteredIssues = issues.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.address && item.address.toLowerCase().includes(searchTerm.toLowerCase()));

    if (selectedCategory === 'all') return matchesSearch;
    return matchesSearch && (
      item.ai_predicted_category === selectedCategory ||
      (item.category_name && item.category_name.toLowerCase().includes(selectedCategory.toLowerCase()))
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Bar */}
      <div className="enterprise-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#0f766e', background: '#f0fdfa', padding: '4px 10px', borderRadius: '6px', marginBottom: '8px' }}>
            <MapPin size={14} />
            <span>Dhanbad Municipal Corporation & Spatial GIS</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)', margin: 0, fontWeight: 800 }}>
            Live Geotagged Issues & GIS Interactive Map
          </h2>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0', fontSize: '0.9rem' }}>
            Explore real-time geotagged civic complaints, coal pollution hazards, and road work orders in Dhanbad.
          </p>
        </div>

        <button onClick={() => navigate('/report')} className="btn btn-primary" style={{ padding: '12px 20px', fontSize: '0.9rem', gap: '8px' }}>
          <Navigation size={16} />
          <span>Report an Issue (One-Touch GPS)</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setSelectedCategory('all')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)',
            background: selectedCategory === 'all' ? '#0f766e' : '#ffffff',
            color: selectedCategory === 'all' ? '#ffffff' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          All Issues ({issues.length})
        </button>

        <button
          onClick={() => setSelectedCategory('coal_pollution')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)',
            background: selectedCategory === 'coal_pollution' ? '#0f766e' : '#ffffff',
            color: selectedCategory === 'coal_pollution' ? '#ffffff' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          ⛏️ Coal Pollution
        </button>

        <button
          onClick={() => setSelectedCategory('pothole')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)',
            background: selectedCategory === 'pothole' ? '#0f766e' : '#ffffff',
            color: selectedCategory === 'pothole' ? '#ffffff' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          🕳️ Potholes
        </button>

        <button
          onClick={() => setSelectedCategory('manhole')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)',
            background: selectedCategory === 'manhole' ? '#0f766e' : '#ffffff',
            color: selectedCategory === 'manhole' ? '#ffffff' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          🚨 Open Manholes
        </button>

        <button
          onClick={() => setSelectedCategory('garbage')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)',
            background: selectedCategory === 'garbage' ? '#0f766e' : '#ffffff',
            color: selectedCategory === 'garbage' ? '#ffffff' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          ♻️ Garbage Dumps
        </button>
      </div>

      {/* Split-Screen Layout: Live Feed & GIS Map */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '24px' }}>
        {/* Left Column: Live Geotagged Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="enterprise-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--text-main)', fontWeight: 700 }}>
              Live Reports Feed ({filteredIssues.length})
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '240px' }}>
              <Search size={16} color="var(--text-dim)" />
              <input
                type="text"
                placeholder="Search Dhanbad issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '6px 10px', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          {loading ? (
            <div className="enterprise-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading live geotagged issue feed...
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="enterprise-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No matching geotagged issues found.
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} onUpvote={handleUpvote} />
            ))
          )}
        </div>

        {/* Right Column: Interactive Leaflet Vector GIS Map */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="enterprise-card" style={{ padding: '16px', height: '620px', position: 'sticky', top: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '0.95rem', margin: 0, color: 'var(--text-main)', fontWeight: 700 }}>
                Interactive Vector GIS Map
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#0f766e', fontWeight: 600 }}>Dhanbad Center (23.7957, 86.4304)</span>
            </div>

            <div className="vector-map-frame" style={{ height: '550px' }}>
              <IssueMap
                issues={filteredIssues}
                center={[23.7957, 86.4304]}
                zoom={13}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
