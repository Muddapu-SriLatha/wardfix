import React, { useState, useEffect } from 'react';
import IssueCard from '../components/IssueCard';
import IssueMap from '../components/IssueMap';
import { fetchApi } from '../services/api';
import { getSocket } from '../services/socket';
import { Filter, Search, RefreshCw, SlidersHorizontal } from 'lucide-react';

export default function IssueListPage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [viewMode, setViewMode] = useState('split'); // 'split', 'list', 'map'

  const loadIssues = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (statusFilter) query.append('status', statusFilter);
      if (priorityFilter) query.append('priority', priorityFilter);
      if (search) query.append('search', search);

      const data = await fetchApi(`/issues?${query.toString()}`);
      setIssues(data.issues || []);
    } catch (err) {
      console.error('Failed to load issues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();

    // Socket.io Real-Time Event Subscriptions
    const socket = getSocket();

    const handleNewIssue = (newIssue) => {
      setIssues((prev) => [newIssue, ...prev]);
    };

    const handleStatusUpdate = ({ issueId, newStatus }) => {
      setIssues((prev) =>
        prev.map((item) => (item.id === issueId ? { ...item, status: newStatus } : item))
      );
    };

    const handleUpvoteUpdate = ({ issueId, upvotesCount }) => {
      setIssues((prev) =>
        prev.map((item) => (item.id === issueId ? { ...item, upvotes_count: upvotesCount } : item))
      );
    };

    socket.on('issue:created', handleNewIssue);
    socket.on('issue:status_updated', handleStatusUpdate);
    socket.on('issue:upvoted', handleUpvoteUpdate);

    return () => {
      socket.off('issue:created', handleNewIssue);
      socket.off('issue:status_updated', handleStatusUpdate);
      socket.off('issue:upvoted', handleUpvoteUpdate);
    };
  }, [statusFilter, priorityFilter, search]);

  const handleUpvote = async (issueId) => {
    try {
      const res = await fetchApi(`/issues/${issueId}/upvote`, { method: 'POST' });
      setIssues((prev) =>
        prev.map((item) => (item.id === issueId ? { ...item, upvotes_count: res.upvotes_count } : item))
      );
    } catch (err) {
      alert('Please log in or register to upvote issues.');
    }
  };

  const [selectedCity, setSelectedCity] = useState({ name: 'Bengaluru', center: [12.9716, 77.5946] });

  const INDIAN_CITIES = [
    { name: 'Bengaluru', center: [12.9716, 77.5946] },
    { name: 'New Delhi', center: [28.6139, 77.2090] },
    { name: 'Mumbai', center: [19.0760, 72.8777] },
    { name: 'Hyderabad', center: [17.3850, 78.4867] },
    { name: 'Chennai', center: [13.0827, 80.2707] },
  ];

  return (
    <div className="app-container">
      {/* Header & Filter Bar */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: 0 }}>Indian Civic Issue Explorer</h2>
              <span style={{ fontSize: '1.2rem' }}>🇮🇳</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Geotagged infrastructure & Swachhata tracker across Indian Metro Municipalities</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Quick City Selector */}
            <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '10px' }}>
              {INDIAN_CITIES.map((city) => (
                <button
                  key={city.name}
                  onClick={() => { setSelectedCity(city); setSearch(city.name); }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: selectedCity.name === city.name ? 'var(--primary)' : 'transparent',
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {city.name}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', minWidth: '200px' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search Ward, Road, City..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-glass)',
                  color: '#fff',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                background: '#121826',
                border: '1px solid var(--border-glass)',
                color: '#fff',
                fontSize: '0.9rem',
              }}
            >
              <option value="">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="verified">Verified</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <button onClick={loadIssues} className="btn btn-secondary" style={{ padding: '8px 12px' }}>
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left Column: Interactive Map */}
        <div className="glass-panel" style={{ padding: '16px', height: '650px', position: 'sticky', top: '24px' }}>
          <IssueMap issues={issues} center={selectedCity.center} zoom={12} />
        </div>

        {/* Right Column: Issue List Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loading ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading geotagged issues...
            </div>
          ) : issues.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No issue reports found matching your filter criteria.
            </div>
          ) : (
            issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} onUpvote={handleUpvote} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
