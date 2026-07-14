import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, MapPin, Cpu, Users, Mic, Clock, Building, ArrowRight, ShieldAlert } from 'lucide-react';
import CivicIllustration from './CivicIllustration';

export default function IssueCard({ issue, onUpvote }) {
  if (!issue) return null;

  const [imageError, setImageError] = useState(false);

  const getStatusBadge = (status) => {
    let label = status ? status.replace('_', ' ').toUpperCase() : 'REPORTED';
    let badgeClass = 'badge-submitted';
    
    if (status === 'submitted') { label = 'REPORTED'; badgeClass = 'badge-submitted'; }
    if (status === 'verified') { label = 'IN REVIEW'; badgeClass = 'badge-verified'; }
    if (status === 'in_progress') { label = 'IN PROGRESS'; badgeClass = 'badge-in_progress'; }
    if (status === 'resolved') { label = 'RESOLVED'; badgeClass = 'badge-resolved'; }

    return <span className={`badge ${badgeClass}`} style={{ fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.5px' }}>{label}</span>;
  };

  const getSlaBadge = (priority, slaHours) => {
    const hours = slaHours || (priority === 'urgent' ? 12 : priority === 'high' ? 24 : 48);
    let bg = '#fee2e2';
    let color = '#b91c1c';
    if (priority === 'high') { bg = '#fef3c7'; color = '#b45309'; }
    if (priority === 'medium' || priority === 'low') { bg = '#e0f2fe'; color = '#0369a1'; }

    return (
      <span style={{ padding: '4px 10px', borderRadius: '6px', background: bg, color: color, fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <Clock size={12} />
        <span>SLA: {hours}H ({priority ? priority.toUpperCase() : 'URGENT'})</span>
      </span>
    );
  };

  const getCategoryEmoji = (categoryStr) => {
    const str = (categoryStr || '').toLowerCase();
    if (str.includes('coal') || str.includes('dust')) return '⛏️';
    if (str.includes('pothole') || str.includes('road')) return '🕳️';
    if (str.includes('manhole') || str.includes('drain')) return '🚨';
    if (str.includes('garbage') || str.includes('dump')) return '♻️';
    if (str.includes('light') || str.includes('dark')) return '💡';
    if (str.includes('water') || str.includes('leak')) return '💧';
    return '⚡';
  };

  const categorySlug = issue.ai_predicted_category || 
    (issue.category_name ? 
      (issue.category_name.toLowerCase().includes('coal') ? 'coal_pollution' : 
       issue.category_name.toLowerCase().includes('pothole') ? 'pothole' : 'garbage') 
      : 'coal_pollution');

  const locationText = issue.location_name || issue.address || 
    `${issue.latitude ? parseFloat(issue.latitude).toFixed(4) : '23.7957'}, ${issue.longitude ? parseFloat(issue.longitude).toFixed(4) : '86.4304'}`;

  const departmentText = issue.assigned_department || 
    (categorySlug === 'coal_pollution' ? 'Dhanbad Municipal Corporation (DMC) & JSPCB' : 
     categorySlug === 'pothole' ? 'BBMP / PWD Road Infrastructure' : 
     'BWSSB & Municipal Drainage Board');

  return (
    <div className="enterprise-card" style={{
      padding: '0',
      overflow: 'hidden',
      borderRadius: '12px',
      border: '1px solid #cbd5e1',
      boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08)',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    }}>
      
      {/* Top Visual Container: User-Uploaded Photo or High-Res Coal / Civic Category Photo */}
      <div style={{ position: 'relative', width: '100%', height: '190px', background: '#0f172a', overflow: 'hidden' }}>
        <img
          src={(!imageError && issue.image_url) ? issue.image_url : (
            categorySlug === 'coal_pollution' 
              ? 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80'
              : categorySlug === 'pothole'
              ? 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
              : 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
          )}
          alt={issue.title}
          className="w-full h-48 object-cover rounded-t-lg"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={() => setImageError(true)}
        />

        {/* Category Emoji Badge Overlay */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(4px)',
          color: '#ffffff',
          padding: '6px 12px',
          borderRadius: '8px',
          fontSize: '0.85rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <span>{getCategoryEmoji(issue.ai_predicted_category || issue.category_name)}</span>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {issue.ai_predicted_category || issue.category_name || 'CIVIC ISSUE'}
          </span>
        </div>

        {/* Multiple Reports Counter Badge */}
        {issue.duplicate_count > 1 && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: '#0284c7',
            color: '#ffffff',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '0.78rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}>
            <Users size={14} />
            <span>{issue.duplicate_count} CITIZENS</span>
          </div>
        )}
      </div>

      {/* Card Content Details */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
        
        {/* Status & SLA Urgency Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {getStatusBadge(issue.status)}
            {getSlaBadge(issue.priority, issue.sla_hours)}
          </div>
        </div>

        {/* Uppercase Dramatic Title & Description */}
        <div>
          <Link to={`/issues/${issue.id}`} style={{ textDecoration: 'none' }}>
            <h3 style={{
              color: '#0f172a',
              fontSize: '1.08rem',
              marginBottom: '8px',
              fontWeight: 800,
              letterSpacing: '-0.3px',
              lineHeight: '1.35'
            }}>
              {issue.title ? issue.title.toUpperCase() : 'CIVIC PROBLEM REPORTED'}
            </h3>
          </Link>
          <p style={{
            color: '#64748b',
            fontSize: '0.88rem',
            lineHeight: '1.5',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            margin: 0
          }}>
            {issue.description}
          </p>
        </div>

        {/* AI & Voice Note Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {issue.ai_predicted_category && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#047857', background: '#d1fae5', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>
              <Cpu size={14} />
              <span>AI Verified: <strong>{issue.ai_predicted_category}</strong> ({(issue.ai_confidence * 100).toFixed(0)}%)</span>
            </div>
          )}

          {(issue.voice_transcript || issue.voice_note_url) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#b45309', background: '#fef3c7', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>
              <Mic size={14} />
              <span>Voice Note ({issue.voice_language || 'hi-IN'})</span>
            </div>
          )}
        </div>

        {/* Location & Department Details */}
        <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
            <MapPin size={14} color="#0f766e" />
            <strong style={{ color: '#0f172a' }}>Location:</strong> <span>{locationText}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
            <Building size={14} color="#0f766e" />
            <strong style={{ color: '#0f172a' }}>Department:</strong> <span>{departmentText}</span>
          </div>
        </div>

        {/* Footer Actions: Upvote & View Details → Overlay */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #f1f5f9', marginTop: 'auto' }}>
          <button
            onClick={() => onUpvote && onUpvote(issue.id)}
            className="btn btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.82rem', gap: '6px', background: '#f0fdfa', border: '1px solid #ccfbf1', color: '#0f766e', fontWeight: 700 }}
          >
            <ThumbsUp size={14} color="#0f766e" />
            <span>{issue.upvotes_count || 0} Upvotes</span>
          </button>

          <Link
            to={`/issues/${issue.id}`}
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#0f766e',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>View Details</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
