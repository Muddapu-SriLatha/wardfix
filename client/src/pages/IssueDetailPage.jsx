import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import IssueMap from '../components/IssueMap';
import { fetchApi } from '../services/api';
import { getSocket, joinIssueRoom, leaveIssueRoom } from '../services/socket';
import { MapPin, ThumbsUp, Calendar, Cpu, Camera, MessageSquare, ArrowLeft, Send, Users, Mic } from 'lucide-react';
import CivicIllustration from '../components/CivicIllustration';

export default function IssueDetailPage() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [imageError, setImageError] = useState(false);

  const loadDetail = async () => {
    try {
      setLoading(true);
      const data = await fetchApi(`/issues/${id}`);
      setIssue(data.issue);
      setComments(data.comments || []);
    } catch (err) {
      console.error('Error fetching issue detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();

    // Join WebSocket issue room
    joinIssueRoom(id);
    const socket = getSocket();

    const handleCommentAdded = (comment) => {
      setComments((prev) => [...prev, comment]);
    };

    const handleStatusChanged = (statusData) => {
      setIssue((prev) => prev ? { ...prev, status: statusData.newStatus, resolution_notes: statusData.resolution_notes } : prev);
    };

    socket.on('comment:added', handleCommentAdded);
    socket.on('issue:status_changed', handleStatusChanged);

    return () => {
      leaveIssueRoom(id);
      socket.off('comment:added', handleCommentAdded);
      socket.off('issue:status_changed', handleStatusChanged);
    };
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      await fetchApi(`/issues/${id}/comments`, {
        method: 'POST',
        body: { content: newComment },
      });
      setNewComment('');
    } catch (err) {
      alert('Please log in to add comments.');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading issue details...
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="app-container">
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <h2 style={{ color: '#fff', marginBottom: '12px' }}>Issue Not Found</h2>
          <Link to="/explore" className="btn btn-primary">Return to Explore Map</Link>
        </div>
      </div>
    );
  }

  const exif = issue.exif_data ? (typeof issue.exif_data === 'string' ? JSON.parse(issue.exif_data) : issue.exif_data) : null;

  return (
    <div className="app-container" style={{ maxWidth: '1000px' }}>
      <Link to="/explore" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0f766e', marginBottom: '16px', textDecoration: 'none', fontWeight: 700 }}>
        <ArrowLeft size={16} /> Back to Live Map & Explore Issues
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="enterprise-card" style={{ padding: '24px' }}>
            {/* 50m Proximity Duplicate Impact Counter Banner */}
            {issue.duplicate_count > 1 && (
              <div style={{ padding: '14px 18px', borderRadius: '8px', background: '#e0f2fe', border: '1px solid #7dd3fc', color: '#0369a1', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Users size={24} color="#0369a1" />
                <div>
                  <strong style={{ color: '#0f172a', fontSize: '1.02rem', display: 'block' }}>High Community Impact!</strong>
                  <span style={{ fontSize: '0.88rem' }}>👥 <strong>{issue.duplicate_count} citizens</strong> have reported this issue at this location. Automatically consolidated into a single primary work order.</span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span className={`badge badge-${issue.status}`}>
                {issue.status === 'submitted' ? 'Pending' : issue.status === 'verified' ? 'In Review' : issue.status === 'in_progress' ? 'Work Scheduled' : 'Completed'}
              </span>
              <span className={`badge badge-${issue.priority}`}>{issue.priority} priority</span>
            </div>

            <h1 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginBottom: '12px', fontWeight: 800 }}>{issue.title}</h1>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '20px' }}>
              {issue.description}
            </p>

            {/* Multilingual Voice Note Player Widget */}
            {(issue.voice_transcript || issue.voice_note_url) && (
              <div style={{ padding: '16px', borderRadius: '8px', background: '#fef3c7', border: '1px solid #fcd34d', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b45309', fontWeight: 600 }}>
                    <Mic size={18} color="#b45309" />
                    <span>Multilingual Voice Note ({issue.voice_language || 'hi-IN'})</span>
                  </div>
                </div>

                {issue.voice_note_url && (
                  <audio src={issue.voice_note_url} controls style={{ width: '100%', marginBottom: '10px', height: '40px' }} />
                )}

                {issue.voice_transcript && (
                  <p style={{ fontSize: '0.88rem', color: '#b45309', margin: 0, fontStyle: 'italic' }}>
                    <strong>Transcribed Speech:</strong> "{issue.voice_transcript}"
                  </p>
                )}
              </div>
            )}

            {issue.image_url && !imageError ? (
              <div style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
                <img
                  src={issue.image_url}
                  alt={issue.title}
                  style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div style={{ marginBottom: '20px' }}>
                <CivicIllustration category={issue.ai_predicted_category || 'coal_pollution'} height="260px" />
              </div>
            )}

            {/* EXIF Metadata Card */}
            {exif && exif.hasGps && (
              <div style={{ padding: '16px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)', fontWeight: 600, marginBottom: '8px', fontSize: '0.88rem' }}>
                  <Camera size={16} />
                  <span>EXIF Camera & GPS Metadata Extracted</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <div>Device: <strong>{exif.cameraMake} {exif.cameraModel}</strong></div>
                  <div>Timestamp: <strong>{exif.timestamp ? new Date(exif.timestamp).toLocaleString() : 'N/A'}</strong></div>
                  <div>GPS Lat: <strong>{exif.latitude}</strong></div>
                  <div>GPS Lng: <strong>{exif.longitude}</strong></div>
                </div>
              </div>
            )}

            {issue.resolution_notes && (
              <div style={{ padding: '16px', borderRadius: '8px', background: '#d1fae5', border: '1px solid #6ee7b7', color: '#047857' }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.95rem' }}>Municipal Resolution Notes</h4>
                <p style={{ fontSize: '0.88rem', margin: 0 }}>{issue.resolution_notes}</p>
              </div>
            )}
          </div>

          {/* Comments Feed */}
          <div className="enterprise-card" style={{ padding: '24px' }}>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={20} color="var(--primary-blue)" />
              <span>Public Comments & Activity ({comments.length})</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {comments.map((comment) => (
                <div key={comment.id} style={{ padding: '12px 16px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.88rem' }}>{comment.author_name || 'Community Member'}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{new Date(comment.created_at).toLocaleString()}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>{comment.content}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Add a comment or update..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" disabled={submittingComment} className="btn btn-primary" style={{ padding: '10px 16px' }}>
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Location Map */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="enterprise-card" style={{ padding: '16px', height: '350px' }}>
            <h3 style={{ color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '12px' }}>Geotagged Location</h3>
            <IssueMap
              issues={[issue]}
              center={[parseFloat(issue.latitude), parseFloat(issue.longitude)]}
              zoom={15}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
