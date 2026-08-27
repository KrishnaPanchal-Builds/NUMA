import React, { useState } from 'react';
import { X, Activity, Check, TrendingUp, TrendingDown, Minus, Plus } from 'lucide-react';

export default function SymptomModal({ isOpen, onClose, symptom, onSaveSymptom, onAddCustomSymptom }) {
  if (!isOpen) return null;

  const isNewCustom = !symptom;

  const [name, setName] = useState(symptom ? symptom.name : '');
  const [category, setCategory] = useState(symptom ? symptom.category : 'General');
  const [severity, setSeverity] = useState(symptom ? symptom.severity : 3);
  const [frequency, setFrequency] = useState(symptom ? symptom.frequency : 'Daily');
  const [duration, setDuration] = useState(symptom?.duration || '2 hours');
  const [timeOfOccurrence, setTimeOfOccurrence] = useState(symptom?.timeOfOccurrence || '02:30 PM');
  const [trend, setTrend] = useState(symptom ? symptom.trend : 'stable'); // 'improving' | 'stable' | 'worsening'
  const [notes, setNotes] = useState(symptom?.notes || '');

  const categories = ['Skin & Hair', 'Pain', 'Energy & Mood', 'Digestive', 'Metabolic', 'Sleep', 'Mental Health', 'General'];
  const frequencies = ['Constant', 'Daily', 'Intermittent', 'Post-Meals', 'Afternoon', 'Nightly', 'Occasional'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isNewCustom) {
      onAddCustomSymptom({
        id: 'sym_custom_' + Date.now(),
        name: name.trim(),
        category,
        severity: parseInt(severity),
        frequency,
        duration,
        timeOfOccurrence,
        trend,
        lastLogged: 'Logged Just Now',
        notes
      });
    } else {
      onSaveSymptom({
        ...symptom,
        name: name.trim(),
        category,
        severity: parseInt(severity),
        frequency,
        duration,
        timeOfOccurrence,
        trend,
        lastLogged: 'Logged Just Now',
        notes
      });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <span className="badge badge-primary">{isNewCustom ? 'Custom Symptom' : 'Symptom Manager'}</span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>
              {isNewCustom ? 'Add New Custom Symptom' : `Update: ${symptom.name}`}
            </h2>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-icon">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {isNewCustom && (
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Symptom Name</label>
              <input
                type="text"
                placeholder="e.g. Breast Tenderness, Brain Fog..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%' }}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Severity (1-5)</label>
              <select value={severity} onChange={(e) => setSeverity(e.target.value)} style={{ width: '100%' }}>
                {[1, 2, 3, 4, 5].map((s) => <option key={s} value={s}>{s} {s === 1 ? '- Mild' : s === 5 ? '- Severe' : ''}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Frequency</label>
              <select value={frequency} onChange={(e) => setFrequency(e.target.value)} style={{ width: '100%' }}>
                {frequencies.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Time of Occurrence</label>
              <input type="text" value={timeOfOccurrence} onChange={(e) => setTimeOfOccurrence(e.target.value)} placeholder="02:30 PM" style={{ width: '100%' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Duration</label>
            <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 2 hours, All day" style={{ width: '100%' }} />
          </div>

          {/* Trend Status: Improving, Stable, Worsening */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>Overall Trend / Progression</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setTrend('improving')}
                className={`btn ${trend === 'improving' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, fontSize: '0.8rem', gap: '0.3rem' }}
              >
                <TrendingDown size={14} color="var(--accent-mint)" /> Improving
              </button>
              <button
                type="button"
                onClick={() => setTrend('stable')}
                className={`btn ${trend === 'stable' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, fontSize: '0.8rem', gap: '0.3rem' }}
              >
                <Minus size={14} color="var(--accent-amber)" /> Stable
              </button>
              <button
                type="button"
                onClick={() => setTrend('worsening')}
                className={`btn ${trend === 'worsening' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, fontSize: '0.8rem', gap: '0.3rem' }}
              >
                <TrendingUp size={14} color="var(--danger)" /> Worsening
              </button>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Notes & Context</label>
            <textarea rows="2" placeholder="e.g. Worse post-meal or during work stress..." value={notes} onChange={(e) => setNotes(e.target.value)} style={{ width: '100%', resize: 'none' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              <Check size={16} /> Save Symptom Details
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
