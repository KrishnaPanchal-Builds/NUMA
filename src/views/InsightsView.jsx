import React from 'react';
import { Activity, Sparkles, TrendingUp, TrendingDown, Clock, ShieldCheck, Heart, Footprints, Moon, BarChart2 } from 'lucide-react';
import MultiCycleChart from '../components/MultiCycleChart';

export default function InsightsView({ patterns, whatChanged, cycles }) {
  // Activity vs Sleep vs Symptom Comparison Data
  const activityCorrelations = [
    { activity: 'Zone-2 Walking (30m+)', sleepImpact: '+1.4 hrs Restful Sleep', symptomImpact: '-35% Pelvic Cramp Severity', status: 'High Positive Correlation' },
    { activity: 'Low-Impact Pilates (40m)', sleepImpact: 'Improved Deep Sleep', symptomImpact: '-40% Bloating Discomfort', status: 'High Positive Correlation' },
    { activity: 'Late Night Heavy HIIT (>9 PM)', sleepImpact: '-45 mins Sleep Latency', symptomImpact: 'Elevated Cortisol & Cravings', status: 'Negative Impact Warning' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Banner */}
      <div className="numa-card glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '0.25rem' }}>Empirical Intelligence</span>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Observed Patterns & Activity Analytics</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Comparing cycle trends, activity levels, sleep quality, and symptom severities over time.
          </p>
        </div>
      </div>

      {/* SECTION 1: MULTI-CYCLE OVERLAY CHART */}
      <div className="numa-card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.4rem' }}>Multi-Cycle Superimposed Overlay Graph</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Comparing symptom & cramp trajectories across your last 3 cycles.
        </p>
        <MultiCycleChart cycles={cycles} />
      </div>

      {/* SECTION 2: ACTIVITY, SLEEP & SYMPTOM COMPARISON MATRIX */}
      <div className="numa-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Footprints size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Activity vs. Sleep & Symptom Comparison Matrix</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {activityCorrelations.map((item, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
              padding: '0.85rem 1.15rem',
              borderRadius: 'var(--radius-md)',
              background: item.status.includes('High') ? 'var(--primary-light)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${item.status.includes('High') ? 'rgba(139, 92, 246, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
            }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '0.2rem' }}>{item.activity}</h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  🌙 Sleep Impact: <strong>{item.sleepImpact}</strong> • 🩸 Symptom Impact: <strong>{item.symptomImpact}</strong>
                </div>
              </div>

              <span className={`badge ${item.status.includes('High') ? 'badge-mint' : 'badge-danger'}`} style={{ fontSize: '0.75rem' }}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: OBSERVED PATTERN ENGINE */}
      <div className="numa-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sparkles size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Observed Pattern Insights</h3>
        </div>

        <div className="grid-1-2">
          {patterns.map((pat) => (
            <div key={pat.id} style={{ background: 'var(--bg-input)', padding: '1.15rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>{pat.type}</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.35rem' }}>{pat.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.4', marginBottom: '0.75rem' }}>
                "{pat.observation}"
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                💡 Recommendation: {pat.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: WHAT CHANGED LONGITUDINAL MATRIX */}
      <div className="numa-card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.4rem' }}>"What Changed?" Matrix</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {whatChanged.timeframe}
        </p>

        <div className="grid-1-2-3">
          {whatChanged.metrics.map((m, idx) => (
            <div key={idx} style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{m.name}</h4>
              <div style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '0.2rem' }}>{m.current}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Previous: {m.previous} ({m.delta})</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
