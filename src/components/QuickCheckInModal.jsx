import React, { useState } from 'react';
import { X, Check, Heart, Smile, Frown, Meh, Sparkles } from 'lucide-react';
import QuickChips from './QuickChips';

export default function QuickCheckInModal({ isOpen, onClose, onSaveCheckIn, initialData }) {
  if (!isOpen) return null;

  const [mood, setMood] = useState(initialData?.mood || 'Good');
  const [energyLevel, setEnergyLevel] = useState(initialData?.energyLevel || 5);
  const [sleepQuality, setSleepQuality] = useState(initialData?.sleepQuality || 'Restful');
  const [painLevel, setPainLevel] = useState(initialData?.painLevel || 0);
  const [bleedingStatus, setBleedingStatus] = useState(initialData?.bleedingStatus || 'None');
  const [hydrationLiters, setHydrationLiters] = useState(initialData?.hydrationLiters || 2.0);
  const [notes, setNotes] = useState(initialData?.notes || '');

  const moods = [
    { label: 'Great', icon: '😄' },
    { label: 'Good', icon: '🙂' },
    { label: 'Neutral', icon: '😐' },
    { label: 'Anxious', icon: '😰' },
    { label: 'Fatigued', icon: '😫' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveCheckIn({
      date: new Date().toISOString().split('T')[0],
      mood,
      energyLevel: parseInt(energyLevel),
      sleepQuality,
      painLevel: parseInt(painLevel),
      bleedingStatus,
      hydrationLiters: parseFloat(hydrationLiters),
      notes,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem', maxWidth: '540px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>30-Second Daily Check-in</h2>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-icon">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Mood Selection */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>How are you feeling today?</label>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
              {moods.map((m) => (
                <button
                  type="button"
                  key={m.label}
                  onClick={() => setMood(m.label)}
                  className={`btn ${mood === m.label ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1, flexDirection: 'column', padding: '0.5rem 0.2rem', gap: '0.2rem' }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{m.icon}</span>
                  <span style={{ fontSize: '0.7rem' }}>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Energy & Pain Sliders */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>
                Energy Level ({energyLevel}/10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>
                Pain / Discomfort ({painLevel}/5)
              </label>
              <input
                type="range"
                min="0"
                max="5"
                value={painLevel}
                onChange={(e) => setPainLevel(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Bleeding Status */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Bleeding / Spotting</label>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {['None', 'Spotting', 'Light', 'Medium', 'Heavy'].map((b) => (
                <button
                  type="button"
                  key={b}
                  onClick={() => setBleedingStatus(b)}
                  className={`btn ${bleedingStatus === b ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Chips Preset Bars for Notes */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Daily Notes</label>
            <QuickChips value={notes} onChange={setNotes} category="general" />
            <textarea
              rows="2"
              placeholder="Tap presets above or type custom notes directly..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ width: '100%', resize: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              <Check size={16} /> Save 30s Check-in
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
