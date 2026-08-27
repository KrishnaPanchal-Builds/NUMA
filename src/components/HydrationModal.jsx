import React, { useState } from 'react';
import { Droplets, Plus, Check, Edit2, X, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

export default function HydrationModal({
  isOpen,
  onClose,
  hydration = { date: new Date().toISOString().split('T')[0], amountMl: 0, targetMl: 2500, logs: [] },
  onUpdateHydration,
  profile = {},
  onUpdateProfile
}) {
  if (!isOpen) return null;

  const currentLogs = Array.isArray(hydration.logs) ? hydration.logs : [];
  const currentAmount = hydration.amountMl || 0;
  const targetGoal = hydration.targetMl || profile.waterTargetMl || 2500;
  const progressPercent = Math.min(100, Math.round((currentAmount / targetGoal) * 100));

  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [newTargetInput, setNewTargetInput] = useState(targetGoal);
  const [customMlInput, setCustomMlInput] = useState('');

  // Add Water Entry (+ ml)
  const handleAddWater = (mlToAdd) => {
    const addedAmount = parseInt(mlToAdd, 10);
    if (isNaN(addedAmount) || addedAmount <= 0) return;

    const newAmount = currentAmount + addedAmount;
    const newEntry = {
      id: `h_log_${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amountMl: addedAmount
    };

    const updated = {
      ...hydration,
      date: new Date().toISOString().split('T')[0],
      amountMl: newAmount,
      targetMl: targetGoal,
      logs: [newEntry, ...currentLogs]
    };

    if (onUpdateHydration) onUpdateHydration(updated);
    setCustomMlInput('');
  };

  // Save User Daily Target Goal Change
  const handleSaveTargetGoal = () => {
    const val = parseInt(newTargetInput, 10);
    if (isNaN(val) || val <= 500) return;

    const updated = {
      ...hydration,
      targetMl: val
    };

    if (onUpdateHydration) onUpdateHydration(updated);
    if (onUpdateProfile) {
      onUpdateProfile({ ...profile, waterTargetMl: val });
    }
    setIsEditingGoal(false);
  };

  // Reset Today's Hydration Log
  const handleResetToday = () => {
    const updated = {
      date: new Date().toISOString().split('T')[0],
      amountMl: 0,
      targetMl: targetGoal,
      logs: []
    };
    if (onUpdateHydration) onUpdateHydration(updated);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 99999 }}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', padding: '1.75rem', borderRadius: 'var(--radius-xl)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #0EA5E9 0%, #3B82F6 100%)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(14,165,233,0.35)' }}>
              <Droplets size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Daily Hydration Tracker</h3>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', margin: 0 }}>Compulsory PCOS Water Balance & Goal</p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-outline btn-icon" style={{ borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Dynamic Water Goal Progress Display */}
        <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, rgba(14,165,233,0.12) 0%, rgba(59,130,246,0.12) 100%)', border: '1px solid #0EA5E9', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <div>
              <span className="badge badge-teal" style={{ fontSize: '0.65rem', marginBottom: '0.2rem' }}>LOGGED TODAY</span>
              <h2 style={{ fontSize: '1.85rem', fontWeight: '900', color: '#0EA5E9', lineHeight: 1.1 }}>
                {currentAmount} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {targetGoal} ml</span>
              </h2>
            </div>

            <button
              onClick={() => setIsEditingGoal(!isEditingGoal)}
              className="btn btn-outline"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', gap: '0.25rem', borderColor: '#0EA5E9', color: '#0EA5E9' }}
            >
              <Edit2 size={13} /> {isEditingGoal ? 'Cancel' : 'Change Goal'}
            </button>
          </div>

          {/* Edit Goal Input */}
          {isEditingGoal && (
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', background: 'var(--bg-card)', padding: '0.65rem', borderRadius: 'var(--radius-md)' }}>
              <input
                type="number"
                min="500"
                max="6000"
                step="100"
                value={newTargetInput}
                onChange={(e) => setNewTargetInput(e.target.value)}
                placeholder="Enter daily target in ml (e.g. 2500)"
                style={{ flex: 1, padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              />
              <button onClick={handleSaveTargetGoal} className="btn btn-primary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
                <Check size={14} /> Save Goal
              </button>
            </div>
          )}

          {/* Fill Progress Bar */}
          <div style={{ height: '12px', width: '100%', background: 'rgba(0,0,0,0.08)', borderRadius: 'var(--radius-full)', overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #0EA5E9 0%, #3B82F6 100%)', borderRadius: 'var(--radius-full)', transition: 'width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
            <span>{progressPercent}% Completed</span>
            <span>{targetGoal - currentAmount > 0 ? `${targetGoal - currentAmount} ml remaining` : '🎉 Daily Goal Achieved!'}</span>
          </div>
        </div>

        {/* 1-TAP QUICK +ML LOGGING BUTTONS */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem', display: 'block' }}>
            💧 Quick Add Water (+ ml):
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <button
              onClick={() => handleAddWater(250)}
              className="btn btn-outline"
              style={{ flexDirection: 'column', padding: '0.75rem 0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid #0EA5E9', gap: '0.2rem' }}
            >
              <span style={{ fontSize: '1.2rem' }}>🥤</span>
              <strong style={{ fontSize: '0.85rem', color: '#0EA5E9' }}>+ 250 ml</strong>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>1 Glass</span>
            </button>

            <button
              onClick={() => handleAddWater(500)}
              className="btn btn-outline"
              style={{ flexDirection: 'column', padding: '0.75rem 0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid #0EA5E9', gap: '0.2rem' }}
            >
              <span style={{ fontSize: '1.2rem' }}>🍼</span>
              <strong style={{ fontSize: '0.85rem', color: '#0EA5E9' }}>+ 500 ml</strong>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>1 Bottle</span>
            </button>

            <button
              onClick={() => handleAddWater(750)}
              className="btn btn-outline"
              style={{ flexDirection: 'column', padding: '0.75rem 0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid #0EA5E9', gap: '0.2rem' }}
            >
              <span style={{ fontSize: '1.2rem' }}>🥛</span>
              <strong style={{ fontSize: '0.85rem', color: '#0EA5E9' }}>+ 750 ml</strong>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Large Sipper</span>
            </button>
          </div>

          {/* Custom ml Entry Field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddWater(customMlInput);
            }}
            style={{ display: 'flex', gap: '0.5rem' }}
          >
            <input
              type="number"
              min="50"
              max="2000"
              step="50"
              placeholder="Or enter custom ml (e.g. 350)..."
              value={customMlInput}
              onChange={(e) => setCustomMlInput(e.target.value)}
              style={{ flex: 1, padding: '0.6rem 0.85rem', fontSize: '0.85rem' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1rem', background: '#0EA5E9', fontSize: '0.825rem' }}>
              <Plus size={16} /> Add Custom
            </button>
          </form>
        </div>

        {/* Today's Hydration Entries Log */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              📋 Today's Water Logs ({currentLogs.length})
            </label>

            {currentLogs.length > 0 && (
              <button onClick={handleResetToday} style={{ fontSize: '0.725rem', color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <RefreshCw size={12} /> Reset Today
              </button>
            )}
          </div>

          <div style={{ maxHeight: '140px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {currentLogs.length === 0 ? (
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', margin: 0, textAlign: 'center', padding: '0.75rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
                No water logged yet today. Tap + 250ml or + 500ml above to log your first drink!
              </p>
            ) : (
              currentLogs.map((log) => (
                <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: '700', color: '#0EA5E9' }}>+ {log.amountMl} ml</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.725rem' }}>{log.time}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
