import React, { useState } from 'react';
import { Clock } from 'lucide-react';

export default function AnalogClockPicker({ label, value, onChange }) {
  // Value format expected: "10:30 PM"
  const parseTime = (timeStr) => {
    if (!timeStr) return { hour: 10, minute: 0, ampm: 'PM' };
    const parts = timeStr.trim().split(' ');
    const ampm = parts[1] || 'PM';
    const [h, m] = parts[0].split(':');
    return {
      hour: parseInt(h) || 12,
      minute: parseInt(m) || 0,
      ampm: ampm.toUpperCase()
    };
  };

  const parsed = parseTime(value);
  const [selectedHour, setSelectedHour] = useState(parsed.hour);
  const [selectedMinute, setSelectedMinute] = useState(parsed.minute);
  const [ampm, setAmpm] = useState(parsed.ampm);
  const [mode, setMode] = useState('hour'); // 'hour' | 'minute'

  const updateTime = (h, m, p) => {
    const formattedHour = h < 10 ? `0${h}` : `${h}`;
    const formattedMinute = m < 10 ? `0${m}` : `${m}`;
    onChange(`${formattedHour}:${formattedMinute} ${p}`);
  };

  const handleHourSelect = (h) => {
    setSelectedHour(h);
    updateTime(h, selectedMinute, ampm);
    setMode('minute'); // Auto switch to minute picker
  };

  const handleMinuteSelect = (m) => {
    setSelectedMinute(m);
    updateTime(selectedHour, m, ampm);
  };

  const handleAmpmToggle = (p) => {
    setAmpm(p);
    updateTime(selectedHour, selectedMinute, p);
  };

  // Compute Analog Clock Hand Angles
  const hourAngle = (selectedHour % 12) * 30 + (selectedMinute / 60) * 30;
  const minuteAngle = selectedMinute * 6;

  // 12 Hours positions around a 180px circle
  const hoursList = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const minutesList = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  return (
    <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
      
      {/* Label & Active Value Display */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Clock size={16} color="var(--primary)" />
          <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>{label}</span>
        </div>
        
        {/* AM/PM Switcher */}
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button
            type="button"
            onClick={() => handleAmpmToggle('AM')}
            className={`btn ${ampm === 'AM' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', fontWeight: '800' }}
          >
            AM
          </button>
          <button
            type="button"
            onClick={() => handleAmpmToggle('PM')}
            className={`btn ${ampm === 'PM' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', fontWeight: '800' }}
          >
            PM
          </button>
        </div>
      </div>

      {/* Mode Switcher: Select Hours or Minutes */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={() => setMode('hour')}
          className={`btn ${mode === 'hour' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
        >
          Hour: {selectedHour}
        </button>
        <button
          type="button"
          onClick={() => setMode('minute')}
          className={`btn ${mode === 'minute' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
        >
          Minute: {selectedMinute < 10 ? `0${selectedMinute}` : selectedMinute}
        </button>
      </div>

      {/* VISUAL ANALOG CLOCK FACE */}
      <div style={{
        width: '180px',
        height: '180px',
        margin: '0 auto',
        borderRadius: 'var(--radius-full)',
        border: '3px solid var(--primary)',
        background: 'var(--bg-input)',
        position: 'relative',
        boxShadow: 'inset 0 0 15px rgba(0,0,0,0.05)'
      }}>
        
        {/* Center Pivot Point */}
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--primary)',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10
        }} />

        {/* Hour Hand */}
        <div style={{
          width: '4px',
          height: '45px',
          background: 'var(--primary)',
          position: 'absolute',
          bottom: '50%',
          left: 'calc(50% - 2px)',
          transformOrigin: 'bottom center',
          transform: `rotate(${hourAngle}deg)`,
          borderRadius: '4px',
          transition: 'transform 0.3s ease',
          zIndex: 8
        }} />

        {/* Minute Hand */}
        <div style={{
          width: '2px',
          height: '65px',
          background: 'var(--secondary)',
          position: 'absolute',
          bottom: '50%',
          left: 'calc(50% - 1px)',
          transformOrigin: 'bottom center',
          transform: `rotate(${minuteAngle}deg)`,
          borderRadius: '2px',
          transition: 'transform 0.3s ease',
          zIndex: 9
        }} />

        {/* Clock Dial Numbers (Hours 1-12 or Minutes 0-55) */}
        {mode === 'hour' ? (
          hoursList.map((h, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const radius = 68; // radius from center
            const x = Math.round(90 + radius * Math.cos(angle)) - 14;
            const y = Math.round(90 + radius * Math.sin(angle)) - 14;
            const isSelected = selectedHour === h;

            return (
              <button
                type="button"
                key={h}
                onClick={() => handleHourSelect(h)}
                style={{
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${y}px`,
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-full)',
                  background: isSelected ? 'var(--primary)' : 'transparent',
                  color: isSelected ? '#FFF' : 'var(--text-main)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? '800' : '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {h}
              </button>
            );
          })
        ) : (
          minutesList.map((m, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const radius = 68;
            const x = Math.round(90 + radius * Math.cos(angle)) - 14;
            const y = Math.round(90 + radius * Math.sin(angle)) - 14;
            const isSelected = selectedMinute === m;

            return (
              <button
                type="button"
                key={m}
                onClick={() => handleMinuteSelect(m)}
                style={{
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${y}px`,
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-full)',
                  background: isSelected ? 'var(--secondary)' : 'transparent',
                  color: isSelected ? '#FFF' : 'var(--text-main)',
                  border: 'none',
                  fontSize: '0.7rem',
                  fontWeight: isSelected ? '800' : '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {m < 10 ? `0${m}` : m}
              </button>
            );
          })
        )}

      </div>

      {/* Formatted Selected Time String */}
      <div style={{ marginTop: '0.85rem', fontSize: '1.1rem', fontWeight: '900', color: 'var(--primary)' }}>
        {value}
      </div>

    </div>
  );
}
