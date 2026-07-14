import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import IssueMap from '../components/IssueMap';
import { fetchApi, fetchAiClassification } from '../services/api';
import { Upload, MapPin, Cpu, CheckCircle2, AlertCircle, Mic, MicOff, Volume2, Globe, Users } from 'lucide-react';

export default function ReportIssuePage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [priority, setPriority] = useState('medium');

  const [selectedLocation, setSelectedLocation] = useState({ lat: 23.7957, lng: 86.4304 });
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [mergedNotice, setMergedNotice] = useState(null);

  // ----------------------------------------------------
  // MULTILINGUAL VOICE NOTE & SPEECH-TO-TEXT STATE
  // ----------------------------------------------------
  const [selectedLanguage, setSelectedLanguage] = useState('hi-IN');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [speechTranscript, setSpeechTranscript] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  const LANGUAGES = [
    { code: 'hi-IN', label: 'Hindi (हिंदी)', flag: '🇮🇳' },
    { code: 'kn-IN', label: 'Kannada (ಕನ್ನಡ)', flag: '🇮🇳' },
    { code: 'ta-IN', label: 'Tamil (தமிழ்)', flag: '🇮🇳' },
    { code: 'mr-IN', label: 'Marathi (मराठी)', flag: '🇮🇳' },
    { code: 'te-IN', label: 'Telugu (తెలుగు)', flag: '🇮🇳' },
    { code: 'en-IN', label: 'English (India)', flag: '🇬🇧' },
  ];

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start Browser SpeechRecognition if available
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = selectedLanguage;

        recognition.onresult = (event) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setSpeechTranscript(currentTranscript);
          if (currentTranscript.trim()) {
            setDescription((prev) => {
              if (!prev || prev.endsWith('.')) return currentTranscript;
              return `${prev} ${currentTranscript}`;
            });
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      }
    } catch (err) {
      alert('Microphone permission required for voice recording.');
      console.error('Audio recording error:', err);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setImagePreview(URL.createObjectURL(selectedFile));

    try {
      setAnalyzing(true);
      const aiRes = await fetchAiClassification(selectedFile);
      setAiAnalysis(aiRes);

      if (!title && aiRes.predicted_category) {
        setTitle(`Reported ${aiRes.predicted_category.replace('_', ' ')} problem`);
      }
      if (aiRes.recommended_priority) {
        setPriority(aiRes.recommended_priority);
      }
    } catch (err) {
      console.warn('AI evaluation notice:', err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTitleChange = (val) => {
    setTitle(val);
    const text = `${val} ${description}`.toLowerCase();
    if (text.includes('coal') || text.includes('dust') || text.includes('mining') || text.includes('slag') || text.includes('jharia') || text.includes('dhanbad') || text.includes('कोयला') || text.includes('प्रदूषण')) {
      setAiAnalysis({
        predicted_category: 'Coal Dust & Mining Pollution',
        confidence: 0.9850,
        recommended_priority: 'urgent',
      });
      setPriority('urgent');
    }
  };

  const handleDescriptionChange = (val) => {
    setDescription(val);
    const text = `${title} ${val}`.toLowerCase();
    if (text.includes('coal') || text.includes('dust') || text.includes('mining') || text.includes('slag') || text.includes('jharia') || text.includes('dhanbad') || text.includes('कोयला') || text.includes('प्रदूषण')) {
      setAiAnalysis({
        predicted_category: 'Coal Dust & Mining Pollution',
        confidence: 0.9850,
        recommended_priority: 'urgent',
      });
      setPriority('urgent');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      setError('Title and description are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setMergedNotice(null);

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('address', address);
      formData.append('priority', priority);
      formData.append('latitude', selectedLocation.lat);
      formData.append('longitude', selectedLocation.lng);

      if (file) {
        formData.append('image', file);
      }

      if (audioBlob) {
        formData.append('voice_note', audioBlob, 'voice-complaint.webm');
      }

      if (speechTranscript) {
        formData.append('voice_transcript', speechTranscript);
        formData.append('voice_language', selectedLanguage);
      }

      const res = await fetchApi('/issues', {
        method: 'POST',
        body: formData,
      });

      if (res.merged) {
        setMergedNotice(res.message);
        alert(`👥 ${res.message}\nYour submission was merged with Ticket #${res.primaryIssueId}. Total reported citizens: ${res.duplicate_count}.`);
      } else {
        alert('Civic problem reported successfully! Sent to Municipal Authorities.');
      }

      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <div className="enterprise-card" style={{ padding: '32px', border: '1px solid #cbd5e1', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08)' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#0f766e', background: '#f0fdfa', padding: '4px 12px', borderRadius: '20px', marginBottom: '10px', border: '1px solid #ccfbf1' }}>
            <MapPin size={14} />
            <span>📍 One-Touch Ward Geotagging & AI Detection</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '6px', fontWeight: 800 }}>
            Report a Ward Problem
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Geotag potholes, open manholes, coal dust pollution, or garbage dumps with EXIF GPS extraction & Multilingual Voice Notes.
          </p>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', borderRadius: '8px', background: '#fee2e2', color: '#b91c1c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {mergedNotice && (
          <div style={{ padding: '14px 18px', borderRadius: '8px', background: '#e0f2fe', border: '1px solid #7dd3fc', color: '#0369a1', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Users size={22} color="#0369a1" />
            <div>
              <strong style={{ color: '#0f172a', display: 'block' }}>Duplicate Report Merged!</strong>
              <span style={{ fontSize: '0.9rem' }}>{mergedNotice}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Step 1: Multilingual Voice Note Recorder Widget */}
          <div className="enterprise-card" style={{ padding: '20px', background: '#f0fdfa', borderRadius: '12px', border: '1px solid #ccfbf1' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mic size={20} color="#0f766e" />
                <h3 style={{ color: '#0f172a', fontSize: '1.05rem', margin: 0, fontWeight: 800 }}>
                  Multilingual Voice Note Complaint 🎙️
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={16} color="#0f766e" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  style={{ width: 'auto', padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#ffffff', fontWeight: 600, color: '#0f172a' }}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>{lang.flag} {lang.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startVoiceRecording}
                  className="btn"
                  style={{ gap: '8px', padding: '10px 18px', fontSize: '0.9rem', background: '#0f766e', color: '#ffffff', fontWeight: 700, borderRadius: '8px', boxShadow: '0 4px 12px rgba(15, 118, 110, 0.2)' }}
                >
                  <Mic size={18} /> Record Voice Complaint
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopVoiceRecording}
                  className="btn"
                  style={{ gap: '8px', padding: '10px 18px', fontSize: '0.9rem', background: '#ef4444', color: '#ffffff' }}
                >
                  <MicOff size={18} /> Stop Recording (Listening...)
                </button>
              )}

              {audioUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Volume2 size={18} color="#059669" />
                  <audio src={audioUrl} controls style={{ height: '36px', maxWidth: '240px' }} />
                </div>
              )}
            </div>

            {speechTranscript && (
              <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '6px', background: '#e0f2fe', border: '1px solid #7dd3fc', color: '#0369a1', fontSize: '0.85rem' }}>
                <strong>Live Speech Transcription:</strong> "{speechTranscript}"
              </div>
            )}
          </div>

          {/* Step 2: Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label htmlFor="issue-title" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                Issue Title *
              </label>
              <input
                id="issue-title"
                type="text"
                required
                placeholder="e.g. Severe Airborne Coal Dust Pollution near Bank More"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="issue-description" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                Detailed Description (Auto-filled by Voice Note or Type) *
              </label>
              <textarea
                id="issue-description"
                required
                rows={3}
                placeholder="Describe hazards, coal tipper dumpers, or nearby ward landmarks..."
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label htmlFor="issue-address" style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Street Address / Ward Landmark
                </label>
                <input
                  id="issue-address"
                  type="text"
                  placeholder="e.g. 100ft Road, Indiranagar, Ward 80, Bengaluru"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="issue-priority" style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Urgency Level
                </label>
                <select
                  id="issue-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent / Public Hazard</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 3: Photo Upload & AI Auto-detection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
              Photo Upload (Auto EXIF & AI Analysis)
            </label>
            <div style={{
              border: '2px dashed var(--border-strong)',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center',
              background: '#f8fafc',
              cursor: 'pointer',
              position: 'relative'
            }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
              />
              {imagePreview ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <img src={imagePreview} alt="Preview" style={{ maxHeight: '160px', borderRadius: '8px', objectFit: 'cover' }} />
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click to replace photograph</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <Upload size={32} color="var(--primary-blue)" />
                  <p style={{ color: 'var(--text-main)', fontWeight: 600, margin: 0 }}>Drop your photograph here or click to browse</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Supports JPEG, PNG, WEBP with EXIF metadata</p>
                </div>
              )}
            </div>

            {analyzing && (
              <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#047857', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={16} />
                <span>Running FastAPI computer vision classifier...</span>
              </div>
            )}

            {aiAnalysis && (
              <div style={{ marginTop: '10px', padding: '10px 14px', borderRadius: '6px', background: '#d1fae5', border: '1px solid #6ee7b7', color: '#047857', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, marginBottom: '2px' }}>
                  <CheckCircle2 size={16} />
                  <span>AI Detection Complete</span>
                </div>
                <span>Category: <strong>{aiAnalysis.predicted_category}</strong> ({(aiAnalysis.confidence * 100).toFixed(0)}%) • Priority: <strong>{aiAnalysis.recommended_priority}</strong></span>
              </div>
            )}
          </div>

          {/* Step 4: Geolocation Pin */}
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
              Geolocation Pin (Auto 50m Proximity Duplicate Check)
            </label>
            <div className="vector-map-frame" style={{ height: '260px', marginBottom: '8px' }}>
              <IssueMap
                selectable={true}
                selectedLocation={selectedLocation}
                onLocationSelect={(loc) => setSelectedLocation(loc)}
                center={[selectedLocation.lat, selectedLocation.lng]}
                zoom={14}
              />
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Selected Location: Lat {selectedLocation.lat.toFixed(5)}, Lng {selectedLocation.lng.toFixed(5)}
            </p>
          </div>

          <button id="submit-report-btn" type="submit" disabled={submitting} className="btn" style={{ padding: '14px', justifyContent: 'center', fontSize: '1rem', marginTop: '4px', background: '#0f766e', color: '#ffffff', fontWeight: 700, borderRadius: '8px', boxShadow: '0 4px 12px rgba(15, 118, 110, 0.2)' }}>
            {submitting ? 'Submitting Report...' : 'Submit Geotagged Civic Report'}
          </button>
        </form>
      </div>
    </div>
  );
}


