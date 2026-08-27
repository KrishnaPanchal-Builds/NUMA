import React from 'react';
import { Tag } from 'lucide-react';

export default function QuickChips({ value = '', onChange, category = 'general' }) {
  const chipSets = {
    general: [
      '⚡ Pelvic Cramps',
      '🩸 Light Spotting',
      '😴 Extreme Fatigue',
      '💊 Took Inositol',
      '💊 Took Metformin',
      '🥑 Low-GI Meal',
      '🏃‍♀️ 30m Walk',
      '☕ Post-Coffee',
      '🤕 Headache',
      '💧 2L Water Logged'
    ],
    period: [
      '🩸 Heavy Flow',
      '🩸 Medium Flow',
      '🩸 Light Flow',
      '🩸 Spotting',
      '⚡ Lower Back Pain',
      '💊 Painkiller Taken',
      '🛋️ Resting with Heating Pad'
    ],
    symptom: [
      '⚡ Sudden Flare-up',
      '📈 Mild Discomfort',
      '📉 Improving',
      '💊 Took Supplement',
      '🧘 Stress Relief Exercise'
    ]
  };

  const chips = chipSets[category] || chipSets.general;

  const handleChipClick = (chipText) => {
    if (!value || value.trim() === '') {
      onChange(chipText);
    } else if (!value.includes(chipText)) {
      onChange(`${value} • ${chipText}`);
    }
  };

  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
        <Tag size={12} color="var(--primary)" />
        <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)' }}>Quick-Add Presets (Tap to insert into notes):</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
        {chips.map((chip) => (
          <button
            type="button"
            key={chip}
            onClick={() => handleChipClick(chip)}
            className="btn btn-outline"
            style={{
              fontSize: '0.7rem',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              background: value.includes(chip) ? 'var(--primary-light)' : 'var(--bg-input)',
              color: value.includes(chip) ? 'var(--primary)' : 'var(--text-main)',
              borderColor: value.includes(chip) ? 'var(--primary)' : 'var(--border-color)',
              fontWeight: '600'
            }}
          >
            + {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
