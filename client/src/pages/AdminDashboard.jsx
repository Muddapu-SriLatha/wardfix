import React, { useState, useEffect } from 'react';
import { fetchApi } from '../services/api';
import { getSocket, joinAdminRoom } from '../services/socket';
import { LayoutDashboard, CheckCircle2, Clock, AlertTriangle, ShieldCheck, Layers, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [clusters, setClusters] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [analyticsData, clusterData, issuesData] = await Promise.all([
        fetchApi('/admin/analytics').catch(() => null),
        fetchApi('/admin/clusters').catch(() => ({ clusters: [] })),
        fetchApi('/issues?limit=50'),
      ]);

      setAnalytics(analyticsData);
      setClusters(clusterData.clusters || []);
      setIssues(issuesData.issues || []);
    } catch (err) {
      console.error('Error loading admin portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();

    // Subscribe to WebSocket admin alerts
    joinAdminRoom();
    const socket = getSocket();

    const handleAdminAlert = (alertData) => {
      console.log('⚡ Admin WebSocket alert received:', alertData);
      loadAdminData();
    };

    socket.on('admin:alert', handleAdminAlert);

    return () => {
      socket.off('admin:alert', handleAdminAlert);
    };
  }, []);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedIssue || !newStatus) return;

    try {
      await fetchApi(`/admin/issues/${selectedIssue.id}/status`, {
        method: 'PATCH',
        body: {
          status: newStatus,
          resolution_notes: resolutionNotes,
        },
      });

      alert(`Status updated to '${newStatus}'!`);
      setSelectedIssue(null);
      setNewStatus('');
      setResolutionNotes('');
      loadAdminData();
    } catch (err) {
      alert(err.message || 'Failed to update issue status. Check admin authentication.');
    }
  };

  return (
    <div className="app-container">
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={28} color="var(--primary)" />
              <span>Municipal & Ward Officer Dispatch Portal 🇮🇳</span>
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>City infrastructure resolution tracking across BBMP, MCD, BMC, GHMC, PostGIS spatial density clusters, and PWD dispatch.</p>
          </div>

          <button onClick={loadAdminData} className="btn btn-secondary">
            <RefreshCw size={16} /> Refresh Analytics
          </button>
        </div>
      </div>

      {/* High-Level Metric Cards */}
      {analytics && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Total Civic Reports</p>
            <h3 style={{ fontSize: '2rem', color: '#fff' }}>{analytics.total_issues}</h3>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Swachhata Resolution Rate</p>
            <h3 style={{ fontSize: '2rem', color: '#10b981' }}>{analytics.resolution_rate}%</h3>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Active Spatial Hotspots</p>
            <h3 style={{ fontSize: '2rem', color: '#60a5fa' }}>{clusters.length} Ward Clusters</h3>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>SLA Target Compliance</p>
            <h3 style={{ fontSize: '2rem', color: '#fbbf24' }}>96.5%</h3>
          </div>
        </div>
      )}

      {/* Main Admin Workflow */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
        {/* Issue Management List */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px' }}>Reported Issues Queue</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {issues.map((item) => (
              <div 
                key={item.id} 
                onClick={() => { setSelectedIssue(item); setNewStatus(item.status); }}
                style={{ 
                  padding: '14px', 
                  borderRadius: '12px', 
                  background: selectedIssue?.id === item.id ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: selectedIssue?.id === item.id ? '1px solid var(--primary)' : '1px solid var(--border-glass)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between'
                }}
              >
                <div>
                  <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '4px' }}>#{item.id} {item.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{item.category_name} • {item.address || 'Geotagged'}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`badge badge-${item.status}`}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Update Panel */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px' }}>Status & Dispatch Control</h3>

          {selectedIssue ? (
            <form onSubmit={handleUpdateStatus} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.04)' }}>
                <h4 style={{ color: '#fff', margin: '0 0 4px 0' }}>{selectedIssue.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Current Status: {selectedIssue.status}</p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Update Resolution Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: '#121826', border: '1px solid var(--border-glass)', color: '#fff' }}
                >
                  <option value="submitted">Submitted</option>
                  <option value="verified">Verified</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Resolution Notes / Dispatch Logs</label>
                <textarea
                  rows={4}
                  placeholder="Enter work order notes or resolution proof..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: '#121826', border: '1px solid var(--border-glass)', color: '#fff' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '12px', justifyContent: 'center' }}>
                Save Status Change & Broadcast Update
              </button>
            </form>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '40px 0' }}>
              Select an issue from the queue to manage status and assign dispatch notes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
