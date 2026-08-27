import React, { useState } from 'react';
import { Layers, Eye } from 'lucide-react';

export default function MultiCycleChart({ cycles }) {
  const [activeMetric, setActiveMetric] = useState('cramps'); // 'cramps' | 'fatigue' | 'sleep'

  // Simulated 35-day cycle data points across 3 consecutive cycles
  const cycleData = {
    cramps: {
      c1: [4, 5, 3, 2, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 4, 3, 2, 1, 1, 1, 1, 1],
      c2: [3, 4, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 2, 1, 1, 1, 1, 1, 1],
      c3: [2, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1],
    },
    fatigue: {
      c1: [3, 4, 4, 3, 2, 2, 2, 3, 4, 4, 3, 2, 2, 2, 3, 3, 4, 4, 3, 2, 2, 3, 4, 4, 3, 3, 4, 4, 3, 2, 2, 2, 2, 2, 2],
      c2: [3, 3, 3, 2, 2, 1, 2, 2, 3, 3, 2, 2, 1, 2, 2, 2, 3, 3, 2, 2, 1, 2, 3, 3, 2, 2, 3, 3, 2, 2, 1, 1, 1, 1, 1],
      c3: [2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1],
    },
    sleep: {
      c1: [6.2, 6.0, 6.5, 6.8, 7.0, 7.1, 7.0, 6.4, 6.2, 6.5, 7.0, 7.2, 7.1, 6.8, 6.5, 6.2, 6.0, 6.5, 7.0, 7.1, 7.2, 6.5, 6.2, 6.4, 7.0, 7.1, 6.5, 6.2, 6.8, 7.0, 7.2, 7.2, 7.1, 7.0, 7.0],
      c2: [6.8, 6.5, 7.0, 7.2, 7.4, 7.5, 7.4, 7.0, 6.8, 7.0, 7.2, 7.5, 7.6, 7.4, 7.2, 7.0, 6.8, 7.0, 7.4, 7.5, 7.6, 7.2, 6.8, 7.0, 7.4, 7.5, 7.2, 6.8, 7.2, 7.4, 7.5, 7.5, 7.4, 7.4, 7.4],
      c3: [7.2, 7.0, 7.4, 7.6, 7.8, 7.8, 7.6, 7.4, 7.2, 7.5, 7.8, 8.0, 7.8, 7.6, 7.4, 7.2, 7.0, 7.4, 7.8, 8.0, 8.0, 7.6, 7.2, 7.5, 7.8, 8.0, 7.6, 7.2, 7.6, 7.8, 8.0, 8.0, 7.8, 7.8, 7.8],
    }
  };

  const currentDataset = cycleData[activeMetric];

  // Helper to map array of values to SVG path
  const buildSvgPath = (values, maxVal) => {
    return values.map((val, index) => {
      const x = (index / (values.length - 1)) * 360 + 20;
      const y = 110 - (val / maxVal) * 90;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const maxVal = activeMetric === 'sleep' ? 10 : 5;

  return (
    <div className="numa-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <Layers size={18} color="var(--primary)" />
            <span className="badge badge-primary">Multi-Cycle Overlay Engine</span>
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>3-Cycle Superimposed Comparison Chart</h3>
        </div>

        {/* Metric Switcher Pills */}
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button
            onClick={() => setActiveMetric('cramps')}
            className={`btn ${activeMetric === 'cramps' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
          >
            Cramps Severity
          </button>
          <button
            onClick={() => setActiveMetric('fatigue')}
            className={`btn ${activeMetric === 'fatigue' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
          >
            Fatigue Shifts
          </button>
          <button
            onClick={() => setActiveMetric('sleep')}
            className={`btn ${activeMetric === 'sleep' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
          >
            Sleep Duration
          </button>
        </div>
      </div>

      {/* Interactive SVG Overlay Graph */}
      <div style={{ height: '210px', width: '100%', background: 'var(--bg-input)', padding: '0.75rem', borderRadius: 'var(--radius-lg)' }}>
        <svg viewBox="0 0 400 130" style={{ width: '100%', height: '100%' }}>
          {/* Grid lines */}
          <line x1="20" y1="20" x2="380" y2="20" stroke="var(--border-color)" strokeDasharray="4" />
          <line x1="20" y1="65" x2="380" y2="65" stroke="var(--border-color)" strokeDasharray="4" />
          <line x1="20" y1="110" x2="380" y2="110" stroke="var(--border-color)" strokeDasharray="4" />

          {/* Cycle 1 Line (Pink) */}
          <path
            d={buildSvgPath(currentDataset.c1, maxVal)}
            fill="none"
            stroke="var(--secondary)"
            strokeWidth="2.5"
            opacity="0.8"
          />

          {/* Cycle 2 Line (Teal) */}
          <path
            d={buildSvgPath(currentDataset.c2, maxVal)}
            fill="none"
            stroke="var(--accent-teal)"
            strokeWidth="2.5"
            opacity="0.85"
          />

          {/* Cycle 3 (Latest) Line (Purple Glowing) */}
          <path
            d={buildSvgPath(currentDataset.c3, maxVal)}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3.5"
          />
        </svg>
      </div>

      {/* Legend & Key */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.75rem', fontWeight: '700', marginTop: '0.75rem' }}>
        <span style={{ color: 'var(--primary)' }}>● Current Cycle (Aug) — Showing Improvement</span>
        <span style={{ color: 'var(--accent-teal)' }}>● Previous Cycle (Jul)</span>
        <span style={{ color: 'var(--secondary)' }}>● Cycle 2 Months Ago (Jun)</span>
      </div>
    </div>
  );
}
