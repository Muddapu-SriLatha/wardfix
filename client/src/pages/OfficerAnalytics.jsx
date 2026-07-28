import React, { useState, useEffect } from 'react';
import { fetchApi } from '../services/api';
import { getSocket, joinAdminRoom } from '../services/socket';
import { ShieldCheck, RefreshCw, HardHat, Layers, AlertCircle, CheckCircle2, UserCheck, Send, Search, Filter, CheckSquare, Square } from 'lucide-react';

export default function OfficerAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [clusters, setClusters] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Table State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedIssueIds, setSelectedIssueIds] = useState([]);

  // Modal / Dispatcher State
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [contractorName, setContractorName] = useState('Suresh Reddy (PWD Contractor)');
  const [targetDepartment, setTargetDepartment] = useState('BBMP Public Works (PWD)');
  const [dispatchNotes, setDispatchNotes] = useState('');

  const loadOfficerData = async () => {
    try {
      setLoading(true);
      const [analyticsData, clusterData, issuesData] = await Promise.all([
        fetchApi('/admin/analytics').catch(() => null),
        fetchApi('/admin/clusters').catch(() => ({ clusters: [] })),
        fetchApi('/issues?limit=100'),
      ]);

      setAnalytics(analyticsData);
      setClusters(clusterData.clusters || []);
      setIssues(issuesData.issues || []);
    } catch (err) {
      console.error('Error loading officer data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOfficerData();
    joinAdminRoom();

    const socket = getSocket();
    const handleAdminAlert = () => loadOfficerData();
    socket.on('admin:alert', handleAdminAlert);

    return () => socket.off('admin:alert', handleAdminAlert);
  }, []);

  const handleSelectAll = () => {
    if (selectedIssueIds.length === filteredIssues.length) {
      setSelectedIssueIds([]);
    } else {
      setSelectedIssueIds(filteredIssues.map(i => i.id));
    }
  };

  const toggleSelectIssue = (id) => {
    if (selectedIssueIds.includes(id)) {
      setSelectedIssueIds(selectedIssueIds.filter(item => item !== id));
    } else {
      setSelectedIssueIds([...selectedIssueIds, id]);
    }
  };

  const handleBulkStatusChange = async (newStatus) => {
    if (selectedIssueIds.length === 0) return;
    try {
      await Promise.all(
        selectedIssueIds.map(id =>
          fetchApi(`/admin/issues/${id}/status`, {
            method: 'PATCH',
            body: { status: newStatus },
          })
        )
      );
      alert(`Updated status for ${selectedIssueIds.length} selected tickets!`);
      setSelectedIssueIds([]);
      loadOfficerData();
    } catch (err) {
      alert('Bulk update failed.');
    }
  };

  const handleDispatchContractor = async (e) => {
    e.preventDefault();
    if (!selectedIssue) return;

    try {
      await fetchApi(`/admin/issues/${selectedIssue.id}/assign`, {
        method: 'POST',
        body: {
          contractor_name: contractorName,
          assigned_department: targetDepartment,
          notes: dispatchNotes,
        },
      });

      alert(`🚜 Work Order dispatched to ${contractorName}!`);
      setSelectedIssue(null);
      setDispatchNotes('');
      loadOfficerData();
    } catch (err) {
      alert(err.message || 'Failed to dispatch contractor.');
    }
  };

  const filteredIssues = issues.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.address && item.address.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Officer Header Card */}
      <div className="enterprise-card" style={{ padding: '24px', border: '1px solid #cbd5e1', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#0f766e', background: '#f0fdfa', padding: '3px 10px', borderRadius: '16px', marginBottom: '6px', border: '1px solid #ccfbf1' }}>
              <ShieldCheck size={14} />
              <span>📊 Municipal Operations & Dispatcher</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', margin: 0, color: '#0f172a', fontWeight: 800 }}>Municipal Triage & Dispatch Portal</h2>
            <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '0.9rem' }}>
              Real-time issue queue, bulk work order status management, and field contractor dispatcher for WardFix.
            </p>
          </div>

          <button onClick={loadOfficerData} className="btn" style={{ padding: '10px 18px', fontSize: '0.88rem', background: '#0f766e', color: '#ffffff', fontWeight: 700, borderRadius: '8px', boxShadow: '0 4px 12px rgba(15, 118, 110, 0.2)' }}>
            <RefreshCw size={16} /> Refresh Triage Queue
          </button>
        </div>
      </div>

      {/* Department Summary Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="enterprise-card" style={{ padding: '18px' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>🚧 Roads & Infrastructure</p>
          <h3 style={{ fontSize: '1.6rem', color: 'var(--text-main)', margin: '4px 0 0 0' }}>14 Open Issues</h3>
        </div>

        <div className="enterprise-card" style={{ padding: '18px' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>💡 Electrical & Power</p>
          <h3 style={{ fontSize: '1.6rem', color: 'var(--text-main)', margin: '4px 0 0 0' }}>8 Open Issues</h3>
        </div>

        <div className="enterprise-card" style={{ padding: '18px' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>🗑️ Swachhata & Sanitation</p>
          <h3 style={{ fontSize: '1.6rem', color: 'var(--text-main)', margin: '4px 0 0 0' }}>7 Open Issues</h3>
        </div>

        <div className="enterprise-card" style={{ padding: '18px' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>💧 Water Supply & Sewerage</p>
          <h3 style={{ fontSize: '1.6rem', color: 'var(--text-main)', margin: '4px 0 0 0' }}>5 Open Issues</h3>
        </div>
      </div>

      {/* Triage Search, Filter & Bulk Actions Bar */}
      <div className="enterprise-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
            <input
              type="text"
              placeholder="Search title, ticket #, address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
            <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '180px' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="submitted">Pending</option>
            <option value="verified">In Review</option>
            <option value="in_progress">Work Scheduled</option>
            <option value="resolved">Completed</option>
          </select>
        </div>

        {/* Bulk Action Controls */}
        {selectedIssueIds.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{selectedIssueIds.length} Selected:</span>
            <button onClick={() => handleBulkStatusChange('in_progress')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              Mark Work Scheduled
            </button>
            <button onClick={() => handleBulkStatusChange('resolved')} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              Mark Completed
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Enterprise Table & Dispatcher Modal */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '24px' }}>
        {/* Enterprise Data Table */}
        <div className="table-container">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <button onClick={handleSelectAll} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    {selectedIssueIds.length > 0 && selectedIssueIds.length === filteredIssues.length ? <CheckSquare size={16} /> : <Square size={16} />}
                  </button>
                </th>
                <th>Ticket ID</th>
                <th>Issue Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>Loading municipal queue...</td>
                </tr>
              ) : filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>No tickets matching criteria.</td>
                </tr>
              ) : (
                filteredIssues.map((item) => (
                  <tr key={item.id} style={{ background: selectedIssue?.id === item.id ? '#f1f5f9' : 'transparent' }}>
                    <td>
                      <button onClick={() => toggleSelectIssue(item.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        {selectedIssueIds.includes(item.id) ? <CheckSquare size={16} color="var(--primary-blue)" /> : <Square size={16} />}
                      </button>
                    </td>
                    <td><strong>#{item.id}</strong></td>
                    <td>
                      <div>
                        <strong style={{ color: 'var(--text-main)' }}>{item.title}</strong>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-dim)' }}>{item.address || 'Geotagged Spot'}</p>
                      </div>
                    </td>
                    <td>{item.category_name || 'Civic'}</td>
                    <td>
                      <span className={`badge badge-${item.status}`}>
                        {item.status === 'submitted' ? 'Pending' : item.status === 'verified' ? 'In Review' : item.status === 'in_progress' ? 'Work Scheduled' : 'Completed'}
                      </span>
                    </td>
                    <td><span className={`badge badge-${item.priority}`}>{item.priority}</span></td>
                    <td>
                      <button
                        onClick={() => setSelectedIssue(item)}
                        className="btn btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                      >
                        Dispatch
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Contractor Dispatcher Panel */}
        <div className="enterprise-card" style={{ padding: '24px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HardHat size={20} color="var(--primary-blue)" />
            <span>Field Contractor Dispatcher</span>
          </h3>

          {selectedIssue ? (
            <form onSubmit={handleDispatchContractor} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ padding: '12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-main)' }}>Ticket #{selectedIssue.id}: {selectedIssue.title}</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Location: {selectedIssue.address || 'Geotagged Spot'}</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>Assigned Contractor</label>
                <select
                  value={contractorName}
                  onChange={(e) => setContractorName(e.target.value)}
                >
                  <option value="Suresh Reddy (PWD Contractor)">Suresh Reddy (PWD Contractor)</option>
                  <option value="Ramesh Infrastructure Pvt Ltd">Ramesh Infrastructure Pvt Ltd</option>
                  <option value="Swachhata Sanitation Crew #8">Swachhata Sanitation Crew #8</option>
                  <option value="BESCOM Rapid Response Unit">BESCOM Rapid Response Unit</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>Target Department</label>
                <select
                  value={targetDepartment}
                  onChange={(e) => setTargetDepartment(e.target.value)}
                >
                  <option value="BBMP Public Works (PWD)">BBMP Public Works (PWD)</option>
                  <option value="Solid Waste Management (SWM)">Solid Waste Management (SWM)</option>
                  <option value="BESCOM Electrical Division">BESCOM Electrical Division</option>
                  <option value="BWSSB Water Board">BWSSB Water Board</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>Work Order Instructions</label>
                <textarea
                  rows={3}
                  placeholder="Enter repair notes for field crew..."
                  value={dispatchNotes}
                  onChange={(e) => setDispatchNotes(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '10px', justifyContent: 'center' }}>
                <Send size={16} /> Dispatch Work Order
              </button>
            </form>
          ) : (
            <div style={{ padding: '30px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Select a ticket from the queue table to assign a contractor and dispatch a work order.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
