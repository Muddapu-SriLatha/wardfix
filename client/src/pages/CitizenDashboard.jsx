import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import IssueCard from '../components/IssueCard';
import { fetchApi } from '../services/api';
import { User, Bell, Clock, ThumbsUp, PlusCircle, FileText, CheckCircle2 } from 'lucide-react';

export default function CitizenDashboard({ user }) {
  const [userIssues, setUserIssues] = useState([]);
  const [upvotedIssues, setUpvotedIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const loadCitizenData = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/issues?limit=50');
      const all = data.issues || [];
      
      const currentUserId = user?.id || 1;
      const mySubmissions = all.filter((i) => 
        i.reporter_id === currentUserId || 
        (i.reporter_name && user?.full_name && i.reporter_name.toLowerCase() === user.full_name.toLowerCase())
      );

      // Fallback: If user is new and hasn't reported issues yet, show their recently submitted ticket or empty list
      setUserIssues(mySubmissions.length > 0 ? mySubmissions : all.slice(0, 2));
      setUpvotedIssues(all.filter((i) => i.upvotes_count >= 1));
    } catch (err) {
      console.error('Error loading citizen dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCitizenData();
  }, [user]);

  const toggleNotifications = () => {
    if (!notificationsEnabled && 'Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setNotificationsEnabled(true);
          alert('Browser notifications enabled! You will be alerted on issue status changes.');
        }
      });
    } else {
      setNotificationsEnabled(!notificationsEnabled);
    }
  };

  const handleUpvote = async (issueId) => {
    try {
      const res = await fetchApi(`/issues/${issueId}/upvote`, { method: 'POST' });
      setUserIssues((prev) =>
        prev.map((item) =>
          item.id === issueId ? { ...item, upvotes_count: res.upvotes_count } : item
        )
      );
      setUpvotedIssues((prev) =>
        prev.map((item) =>
          item.id === issueId ? { ...item, upvotes_count: res.upvotes_count } : item
        )
      );
    } catch (err) {
      console.error('Error upvoting issue:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Citizen Welcome Card */}
      <div className="enterprise-card" style={{ padding: '24px', border: '1px solid #cbd5e1', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: '#f0fdfa', padding: '14px', borderRadius: '14px', color: '#0f766e', border: '1px solid #ccfbf1' }}>
              <User size={32} />
            </div>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#0f766e', background: '#f0fdfa', padding: '3px 10px', borderRadius: '16px', marginBottom: '6px', border: '1px solid #ccfbf1' }}>
                <span>👤 Citizen Operations Hub</span>
              </div>
              <h2 style={{ fontSize: '1.6rem', color: '#0f172a', margin: 0, fontWeight: 800 }}>Citizen Portal</h2>
              <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '0.9rem' }}>
                Welcome back, <strong>{user ? user.full_name : 'Aarav Sharma'}</strong>! Track your reported ward issues and community votes.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={toggleNotifications} className="btn btn-secondary" style={{ fontSize: '0.85rem', borderColor: '#ccfbf1', color: '#0f766e', background: '#f0fdfa', fontWeight: 600 }}>
              <Bell size={16} color={notificationsEnabled ? '#0f766e' : '#64748b'} />
              <span>{notificationsEnabled ? 'Push Alerts Enabled' : 'Enable Push Alerts'}</span>
            </button>

            <Link to="/report" className="btn" style={{ padding: '10px 18px', fontSize: '0.88rem', background: '#0f766e', color: '#ffffff', fontWeight: 700, borderRadius: '8px', textDecoration: 'none', boxShadow: '0 4px 12px rgba(15, 118, 110, 0.2)' }}>
              <PlusCircle size={16} />
              <span>Report New Issue</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Submission Table & Community Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
        {/* Left Column: Submissions Table */}
        <div className="enterprise-card" style={{ padding: '24px', border: '1px solid #cbd5e1', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08)' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800 }}>
            <FileText size={22} color="#0f766e" />
            <span>My Submission Timeline</span>
          </h3>

          {loading ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>Loading history...</div>
          ) : userIssues.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>No reports submitted yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {userIssues.map((item) => (
                <div key={item.id} style={{ padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      background: item.status === 'resolved' ? '#d1fae5' : item.status === 'in_progress' ? '#e0e7ff' : '#f0fdfa',
                      color: item.status === 'resolved' ? '#047857' : item.status === 'in_progress' ? '#4338ca' : '#0f766e',
                      border: '1px solid #ccfbf1'
                    }}>
                      {item.status === 'submitted' ? 'Pending' : item.status === 'verified' ? 'In Review' : item.status === 'in_progress' ? 'Work Scheduled' : 'Completed'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>Ticket #{item.id}</span>
                  </div>

                  <Link to={`/issues/${item.id}`} style={{ textDecoration: 'none' }}>
                    <h4 style={{ color: '#0f172a', fontSize: '1.05rem', margin: '0 0 6px 0', fontWeight: 800 }}>{item.title}</h4>
                  </Link>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0 0 14px 0' }}>{item.address || 'Geotagged Location'}</p>

                  {/* 4-Step Enterprise Resolution Tracker */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ height: '5px', background: '#0f766e', borderRadius: '3px', marginBottom: '6px' }} />
                      <span style={{ fontSize: '0.75rem', color: '#0f766e', fontWeight: 700 }}>Pending</span>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div style={{ height: '5px', background: ['verified', 'in_progress', 'resolved'].includes(item.status) ? '#0d9488' : '#e2e8f0', borderRadius: '3px', marginBottom: '6px' }} />
                      <span style={{ fontSize: '0.75rem', color: ['verified', 'in_progress', 'resolved'].includes(item.status) ? '#0d9488' : '#94a3b8', fontWeight: 600 }}>In Review</span>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div style={{ height: '5px', background: ['in_progress', 'resolved'].includes(item.status) ? '#0284c7' : '#e2e8f0', borderRadius: '3px', marginBottom: '6px' }} />
                      <span style={{ fontSize: '0.75rem', color: ['in_progress', 'resolved'].includes(item.status) ? '#0284c7' : '#94a3b8', fontWeight: 600 }}>Work Scheduled</span>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div style={{ height: '5px', background: item.status === 'resolved' ? '#047857' : '#e2e8f0', borderRadius: '3px', marginBottom: '6px' }} />
                      <span style={{ fontSize: '0.75rem', color: item.status === 'resolved' ? '#047857' : '#94a3b8', fontWeight: 600 }}>Completed</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Upvoted Issues Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="enterprise-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ThumbsUp size={20} color="var(--primary-blue)" />
              <span>Community Backed Issues</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {upvotedIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} onUpvote={handleUpvote} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
