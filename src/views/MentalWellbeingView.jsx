import React, { useState } from 'react';
import { Heart, Sparkles, ShieldCheck, Smile, Frown, Meh, Zap, Brain, Bell, Play, Check, BarChart2 } from 'lucide-react';
import QuickChips from '../components/QuickChips';

export default function MentalWellbeingView({ profile, cycles, symptoms, timeline, onAddTimelineEntry }) {
  const [selectedMood, setSelectedMood] = useState('Calm & Balanced');
  const [stressLevel, setStressLevel] = useState(2); // 1-5
  const [energyLevel, setEnergyLevel] = useState(3); // 1-5
  const [journalText, setJournalText] = useState('Practiced 10 mins of spearmint tea wind-down.');

  const moodOptions = [
    { label: 'Calm & Balanced', icon: '🧘', color: 'var(--accent-mint)' },
    { label: 'Happy & Energized', icon: '✨', color: 'var(--primary)' },
    { label: 'Anxious / Restless', icon: '🌀', color: 'var(--accent-amber)' },
    { label: 'Irritable / Sensitive', icon: '⚡', color: 'var(--secondary)' },
    { label: 'Low Energy / Fatigue', icon: '🔋', color: 'var(--text-muted)' },
    { label: 'Overwhelmed', icon: '🌧️', color: 'var(--danger)' },
  ];

  // Correlation Matrices Data
  const moodCorrelations = [
    { factor: 'Mood vs. Cycle Phase', correlation: 'Follicular & Ovulatory phases yield 85% higher positive mood scores', status: 'Optimal' },
    { factor: 'Mood vs. Sleep Duration', correlation: '7.5h+ sleep correlates with 70% lower emotional irritability', status: 'High Relief' },
    { factor: 'Mood vs. 4-7-8 Breathing', correlation: 'Post-breathing self-reported anxiety drops by 3.2 points', status: 'Effective' }
  ];

  const handleSaveCheckIn = (e) => {
    e.preventDefault();
    if (onAddTimelineEntry) {
      onAddTimelineEntry({
        id: 'mw_' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        symptom: `Emotional Check-In: ${selectedMood}`,
        severity: stressLevel,
        bleedingLevel: 'None',
        painLevel: 0,
        notes: `Stress: ${stressLevel}/5 • Energy: ${energyLevel}/5 — Journal: "${journalText}"`
      });
    }
    alert(`Emotional Check-In Saved! Mood: ${selectedMood}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Banner */}
      <div className="numa-card glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={24} color="var(--secondary)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Mental Well-Being & Emotional Journal</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Track daily mood, stress, energy, and emotional well-being reflections.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: DAILY EMOTIONAL CHECK-IN & JOURNAL */}
      <div className="numa-card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.4rem' }}>Daily Emotional Check-In & Journal</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Select your current mood, stress level, and energy score to track emotional shifts across your cycle.
        </p>

        <form onSubmit={handleSaveCheckIn} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Mood Selector Grid */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.5rem' }}>
              Current Mood (Tap to Select / Deselect)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.6rem' }}>
              {moodOptions.map((m) => {
                const isSelected = selectedMood === m.label;
                return (
                  <button
                    type="button"
                    key={m.label}
                    onClick={() => setSelectedMood(isSelected ? '' : m.label)} // DESELECT ON RE-CLICK
                    className={`btn ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                    style={{ justifyContent: 'flex-start', padding: '0.65rem 0.85rem', fontSize: '0.825rem', gap: '0.5rem' }}
                  >
                    <span>{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stress & Energy Scales */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.35rem' }}>
                Stress Level (1 = Low, 5 = Severe): <strong>{stressLevel}/5</strong>
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={stressLevel}
                onChange={(e) => setStressLevel(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.35rem' }}>
                Energy Level (1 = Exhausted, 5 = High): <strong>{energyLevel}/5</strong>
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Emotional Journal Field */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.35rem' }}>
              Emotional Well-being Journal Notes
            </label>
            <QuickChips value={journalText} onChange={setJournalText} category="general" />
            <textarea
              rows="3"
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Tap presets above or type custom thoughts, feelings, or reflections..."
              style={{ width: '100%', resize: 'none' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem', alignSelf: 'flex-start' }}>
            <Check size={16} /> Save Emotional Check-In
          </button>

        </form>
      </div>

      {/* SECTION 2: MOOD VS CYCLE & SLEEP CORRELATION MATRICES */}
      <div className="numa-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <BarChart2 size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Mood vs. Cycle & Sleep Correlations</h3>
        </div>

        <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={16} color="var(--primary)" />
          Clinical Framing Guarantee: System avoids diagnosing mental health conditions.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {moodCorrelations.map((item, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
              padding: '0.85rem 1.15rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-light)',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '0.2rem' }}>{item.factor}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>{item.correlation}</div>
              </div>
              <span className="badge badge-mint" style={{ fontSize: '0.75rem' }}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
