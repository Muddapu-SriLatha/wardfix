import React, { useState, useEffect } from 'react';
import { fetchApi } from '../services/api';
import { HardHat, MapPin, Navigation, Camera, CheckCircle2, RefreshCw, Filter } from 'lucide-react';

export default function ContractorTasks({ user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [selectedTask, setSelectedTask] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolving, setResolving] = useState(false);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/admin/contractor/tasks');
      setTasks(data.tasks || []);
    } catch (err) {
      console.error('Error loading contractor tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const openRouteDirections = (lat, lng) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  const handleProofFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFile(file);
      setProofPreview(URL.createObjectURL(file));
    }
  };

  const handleResolveTask = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;

    try {
      setResolving(true);
      const formData = new FormData();
      formData.append('resolution_notes', resolutionNotes || 'Site repair completed and verified by Field Contractor.');
      if (proofFile) {
        formData.append('image', proofFile);
      }

      await fetchApi(`/admin/contractor/tasks/${selectedTask.id}/resolve`, {
        method: 'PATCH',
        body: formData,
      });

      alert(`✅ Task #${selectedTask.id} marked as COMPLETED with Proof of Work!`);
      setSelectedTask(null);
      setProofFile(null);
      setProofPreview(null);
      setResolutionNotes('');
      loadTasks();
    } catch (err) {
      alert(err.message || 'Failed to resolve task.');
    } finally {
      setResolving(false);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'in_progress') return t.status === 'in_progress';
    if (statusFilter === 'resolved') return t.status === 'resolved';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px' }}>
      {/* Contractor Header Card */}
      <div className="enterprise-card" style={{ padding: '24px', border: '1px solid #cbd5e1', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: '#f0fdfa', padding: '14px', borderRadius: '14px', color: '#0f766e', border: '1px solid #ccfbf1' }}>
              <HardHat size={28} />
            </div>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#0f766e', background: '#f0fdfa', padding: '3px 10px', borderRadius: '16px', marginBottom: '6px', border: '1px solid #ccfbf1' }}>
                <HardHat size={14} />
                <span>🚜 Field Crew Dispatch Portal</span>
              </div>
              <h2 style={{ fontSize: '1.6rem', color: '#0f172a', margin: 0, fontWeight: 800 }}>Field Contractor Work Orders</h2>
              <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '0.9rem' }}>
                Assigned Crew: <strong>{user ? user.full_name : 'Suresh Reddy (PWD Contractor)'}</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={loadTasks} className="btn" style={{ padding: '10px 18px', fontSize: '0.88rem', background: '#0f766e', color: '#ffffff', fontWeight: 700, borderRadius: '8px', boxShadow: '0 4px 12px rgba(15, 118, 110, 0.2)' }}>
              <RefreshCw size={16} /> Refresh Orders
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="enterprise-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setStatusFilter('ALL')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: statusFilter === 'ALL' ? 'var(--primary-blue)' : 'transparent',
              color: statusFilter === 'ALL' ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            All Work Orders ({tasks.length})
          </button>

          <button
            onClick={() => setStatusFilter('in_progress')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: statusFilter === 'in_progress' ? '#4338ca' : 'transparent',
              color: statusFilter === 'in_progress' ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Work Scheduled ({tasks.filter(t => t.status === 'in_progress').length})
          </button>

          <button
            onClick={() => setStatusFilter('resolved')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: statusFilter === 'resolved' ? '#047857' : 'transparent',
              color: statusFilter === 'resolved' ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Completed ({tasks.filter(t => t.status === 'resolved').length})
          </button>
        </div>
      </div>

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loading ? (
          <div className="enterprise-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading field work orders...
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="enterprise-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No work orders matching this filter.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="enterprise-card"
              style={{
                padding: '20px',
                border: selectedTask?.id === task.id ? '1px solid var(--primary-blue)' : '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`badge badge-${task.status}`}>
                    {task.status === 'submitted' ? 'Pending' : task.status === 'verified' ? 'In Review' : task.status === 'in_progress' ? 'Work Scheduled' : 'Completed'}
                  </span>
                  <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                  {task.assigned_department && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
                      {task.assigned_department}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 600 }}>Work Order #{task.id}</span>
              </div>

              <h3 style={{ color: 'var(--text-main)', fontSize: '1.15rem', marginBottom: '6px' }}>{task.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>{task.description}</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}>
                  <MapPin size={16} color="var(--primary-blue)" />
                  <span>{task.address || 'Geotagged Spot'}</span>
                </div>

                <button
                  type="button"
                  onClick={() => openRouteDirections(task.latitude, task.longitude)}
                  className="btn btn-secondary"
                  style={{ padding: '4px 12px', fontSize: '0.8rem', gap: '6px', color: 'var(--primary-blue)' }}
                >
                  <Navigation size={14} /> Get GPS Route Directions
                </button>
              </div>

              {/* Completion & Proof Photo Form */}
              {task.status !== 'resolved' ? (
                <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                  {selectedTask?.id === task.id ? (
                    <form onSubmit={handleResolveTask} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ padding: '16px', borderRadius: '8px', background: '#f8fafc', border: '1px dashed var(--border-strong)', textAlign: 'center' }}>
                        <label style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '8px' }}>
                          Upload 'After' Proof of Work Photo *
                        </label>

                        <input type="file" accept="image/*" onChange={handleProofFileChange} style={{ marginBottom: '8px' }} />

                        {proofPreview && (
                          <div style={{ marginTop: '8px' }}>
                            <img src={proofPreview} alt="Proof" style={{ maxHeight: '120px', borderRadius: '6px', objectFit: 'cover' }} />
                          </div>
                        )}
                      </div>

                      <textarea
                        rows={2}
                        placeholder="Enter resolution notes (e.g. Cold asphalt patch laid, site cleared)..."
                        value={resolutionNotes}
                        onChange={(e) => setResolutionNotes(e.target.value)}
                      />

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" disabled={resolving} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', background: '#059669', borderColor: '#059669' }}>
                          {resolving ? 'Submitting...' : 'Confirm Completion & Close Ticket'}
                        </button>
                        <button type="button" onClick={() => setSelectedTask(null)} className="btn btn-secondary">
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedTask(task)}
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center', background: '#059669', borderColor: '#059669' }}
                    >
                      <Camera size={16} /> Upload Proof & Mark Completed
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ padding: '12px', borderRadius: '6px', background: '#d1fae5', color: '#047857', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} />
                  <span>Work Order Verified & Completed: {task.resolution_notes || 'Resolved'}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
