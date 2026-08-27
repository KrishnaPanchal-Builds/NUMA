import React, { useState } from 'react';
import { X, Check, Heart, Activity, Footprints, Clock, Watch, AlertCircle } from 'lucide-react';
import QuickChips from './QuickChips';

export default function HealthDataModal({ isOpen, onClose, onSaveHealthData }) {
  if (!isOpen) return null;

  const [workoutType, setWorkoutType] = useState('Walking / Steps');
  const [durationMins, setDurationMins] = useState(30);
  const [stepCount, setStepCount] = useState(7500);
  const [intensity, setIntensity] = useState(3);
  const [bp, setBp] = useState('118/76');
  const [glucose, setGlucose] = useState('88');
  const [weightKg, setWeightKg] = useState('62');
  const [notes, setNotes] = useState('');
  const [wearableSynced, setWearableSynced] = useState(false);

  const workoutOptions = [
    'Walking / Steps',
    'Pilates',
    'Strength Training',
    'Zone-2 Low-Impact Cardio',
    'Yoga & Stretching',
    'HIIT / Circuit',
    'Swimming',
    'Cycling'
  ];

  const handleSyncWearable = () => {
    setStepCount(9240);
    setDurationMins(45);
    setWearableSynced(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveHealthData({
      date: new Date().toISOString().split('T')[0],
      workoutType,
      durationMins: parseInt(durationMins),
      stepCount: parseInt(stepCount),
      intensity: parseInt(intensity),
      bp,
      glucose,
      weightKg,
      notes,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem', maxWidth: '540px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Exercise & Health Logger</h2>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Wearable Sync Button */}
        <div style={{ background: 'var(--primary-light)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Watch size={18} color="var(--primary)" />
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)' }}>
              {wearableSynced ? 'Apple Health / Google Fit Synced!' : 'Sync with Wearable (Apple Health / Google Fit)'}
            </span>
          </div>
          <button type="button" onClick={handleSyncWearable} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
            {wearableSynced ? 'Synced ✓' : 'Sync Steps'}
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Workout / Activity Type</label>
            <select value={workoutType} onChange={(e) => setWorkoutType(e.target.value)} style={{ width: '100%' }}>
              {workoutOptions.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Duration (Minutes)</label>
              <input type="number" min="5" max="300" value={durationMins} onChange={(e) => setDurationMins(e.target.value)} style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Step Count</label>
              <input type="number" min="0" max="50000" value={stepCount} onChange={(e) => setStepCount(e.target.value)} style={{ width: '100%' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Blood Pressure</label>
              <input type="text" value={bp} onChange={(e) => setBp(e.target.value)} placeholder="120/80" style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Glucose (mg/dL)</label>
              <input type="number" value={glucose} onChange={(e) => setGlucose(e.target.value)} placeholder="88" style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Weight (kg)</label>
              <input type="number" step="0.1" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="62" style={{ width: '100%' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Notes & Exercise Details</label>
            <QuickChips value={notes} onChange={setNotes} category="general" />
            <textarea rows="2" placeholder="Tap presets above or type custom workout details..." value={notes} onChange={(e) => setNotes(e.target.value)} style={{ width: '100%', resize: 'none' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              <Check size={16} /> Save Exercise & Health Log
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
