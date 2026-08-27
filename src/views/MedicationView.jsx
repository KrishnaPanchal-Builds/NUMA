import React, { useState } from 'react';
import { Pill, Plus, Check, X, Clock, Calendar, AlertCircle, FileText, Bell, Sparkles, ShieldCheck, CheckCircle2, XCircle, Trash2, Edit2 } from 'lucide-react';
import QuickChips from '../components/QuickChips';

export default function MedicationView({ profile, medications = [], onUpdateMedications, onAddTimelineEntry }) {
  const [filterCategory, setFilterCategory] = useState('all'); // 'all' | 'prescription' | 'supplement'
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMedId, setEditingMedId] = useState(null);

  // Form State for Adding/Editing Medication
  const [medForm, setMedForm] = useState({
    name: '',
    category: 'supplement',
    dosage: '',
    timing: '8:00 AM',
    startDate: new Date().toISOString().split('T')[0],
    endDate: 'Ongoing',
    prescribedBy: '',
    notes: ''
  });

  // Open Modal for Adding New
  const handleOpenAdd = () => {
    setEditingMedId(null);
    setMedForm({
      name: '',
      category: 'supplement',
      dosage: '',
      timing: '8:00 AM',
      startDate: new Date().toISOString().split('T')[0],
      endDate: 'Ongoing',
      prescribedBy: '',
      notes: ''
    });
    setShowAddModal(true);
  };

  // Open Modal for Rectifying / Editing Existing Entry
  const handleOpenEdit = (med) => {
    setEditingMedId(med.id);
    setMedForm({
      name: med.name || '',
      category: med.category || 'supplement',
      dosage: med.dosage || '',
      timing: med.timing || '8:00 AM',
      startDate: med.startDate || new Date().toISOString().split('T')[0],
      endDate: med.endDate || 'Ongoing',
      prescribedBy: med.prescribedBy || '',
      notes: med.notes || ''
    });
    setShowAddModal(true);
  };

  // Delete Medication Entry
  const handleDeleteMed = (medId) => {
    if (onUpdateMedications) {
      onUpdateMedications(medications.filter((m) => m.id !== medId));
    }
  };

  // Toggle Taken / Missed Status
  const handleToggleStatus = (medId, newStatus) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updated = medications.map((m) => {
      if (m.id !== medId) return m;

      const historyList = m.history || [];
      const updatedHistory = [
        { date: todayStr, status: newStatus, time: nowTimeStr },
        ...historyList.filter((h) => h.date !== todayStr)
      ];

      return {
        ...m,
        todayStatus: newStatus,
        history: updatedHistory
      };
    });

    if (onUpdateMedications) {
      onUpdateMedications(updated);
    }

    if (onAddTimelineEntry) {
      const targetMed = medications.find((m) => m.id === medId);
      onAddTimelineEntry({
        id: 'med_log_' + Date.now(),
        date: todayStr,
        time: nowTimeStr,
        symptom: `Meds Log: ${targetMed?.name} (${newStatus.toUpperCase()})`,
        severity: 1,
        bleedingLevel: 'None',
        painLevel: 0,
        notes: `Dosage: ${targetMed?.dosage} — Status marked as ${newStatus}`
      });
    }
  };

  // Save (Create or Rectify) Medication
  const handleSaveMed = (e) => {
    e.preventDefault();
    if (!medForm.name.trim()) return;

    if (editingMedId) {
      // Rectify Existing Entry
      const updated = medications.map((m) => {
        if (m.id !== editingMedId) return m;
        return {
          ...m,
          ...medForm
        };
      });
      if (onUpdateMedications) onUpdateMedications(updated);
    } else {
      // Create New Entry
      const newEntry = {
        id: 'm_' + Date.now(),
        ...medForm,
        todayStatus: 'pending',
        history: []
      };
      if (onUpdateMedications) onUpdateMedications([newEntry, ...medications]);
    }

    setShowAddModal(false);
  };

  // Filtered List
  const filteredMeds = medications.filter((m) => {
    if (filterCategory === 'all') return true;
    return m.category === filterCategory;
  });

  // Compute Overall Adherence Percentage
  const totalLogs = medications.reduce((acc, m) => acc + (m.history ? m.history.length : 0), 0);
  const takenLogs = medications.reduce((acc, m) => acc + (m.history ? m.history.filter((h) => h.status === 'taken').length : 0), 0);
  const adherencePercentage = totalLogs > 0 ? Math.round((takenLogs / totalLogs) * 100) : 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Banner */}
      <div className="numa-card glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Pill size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Medication & Supplement Hub</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Clean, user-managed prescriptions and supplements with edit, rectify, and delete options.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {medications.length > 0 && (
            <span className="badge badge-mint" style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', fontWeight: '800' }}>
              Adherence Rate: {adherencePercentage}%
            </span>
          )}

          <button onClick={handleOpenAdd} className="btn btn-primary" style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}>
            <Plus size={16} /> + Add Medication / Supplement
          </button>
        </div>
      </div>

      {/* Filter Sub-Nav */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <button
          onClick={() => setFilterCategory('all')}
          className={`btn ${filterCategory === 'all' ? 'btn-primary' : 'btn-outline'}`}
          style={{ fontSize: '0.85rem' }}
        >
          All Items ({medications.length})
        </button>

        <button
          onClick={() => setFilterCategory('prescription')}
          className={`btn ${filterCategory === 'prescription' ? 'btn-primary' : 'btn-outline'}`}
          style={{ fontSize: '0.85rem' }}
        >
          Doctor Prescriptions ({medications.filter((m) => m.category === 'prescription').length})
        </button>

        <button
          onClick={() => setFilterCategory('supplement')}
          className={`btn ${filterCategory === 'supplement' ? 'btn-primary' : 'btn-outline'}`}
          style={{ fontSize: '0.85rem' }}
        >
          Supplements ({medications.filter((m) => m.category === 'supplement').length})
        </button>
      </div>

      {/* SECTION 1: ACTIVE MEDICATIONS & SUPPLEMENTS CARDS */}
      {filteredMeds.length > 0 ? (
        <div className="grid-1-2">
          {filteredMeds.map((med) => (
            <div key={med.id} className="numa-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: `5px solid ${med.category === 'prescription' ? 'var(--primary)' : 'var(--secondary)'}` }}>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className={`badge ${med.category === 'prescription' ? 'badge-primary' : 'badge-pink'}`}>
                    {med.category === 'prescription' ? '🩺 Prescription' : '🌿 Supplement'}
                  </span>

                  {/* Actions: Rectify/Edit & Delete Buttons */}
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      onClick={() => handleOpenEdit(med)}
                      className="btn btn-outline btn-icon"
                      style={{ width: '28px', height: '28px', padding: 0 }}
                      title="Rectify / Edit Treatment Details"
                    >
                      <Edit2 size={13} />
                    </button>

                    <button
                      onClick={() => handleDeleteMed(med.id)}
                      className="btn btn-outline btn-icon"
                      style={{ width: '28px', height: '28px', padding: 0, color: 'var(--danger)', borderColor: 'var(--danger)' }}
                      title="Delete Treatment"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0 }}>{med.name}</h3>
                  <span className={`badge ${med.todayStatus === 'taken' ? 'badge-mint' : med.todayStatus === 'missed' ? 'badge-danger' : 'badge-amber'}`} style={{ fontSize: '0.65rem' }}>
                    {med.todayStatus === 'taken' ? '✓ Taken Today' : med.todayStatus === 'missed' ? '✗ Missed Today' : '⏳ Pending'}
                  </span>
                </div>
                
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                  💊 Dosage: {med.dosage}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.75rem' }}>
                  <div>⏰ Timing: <strong>{med.timing}</strong></div>
                  <div>📅 Dates: <strong>{med.startDate} ➔ {med.endDate}</strong></div>
                  {med.prescribedBy && <div>🩺 Provider: <strong>{med.prescribedBy}</strong></div>}
                </div>

                {med.notes && (
                  <div style={{ background: 'var(--bg-input)', padding: '0.75rem 0.9rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
                    📝 <strong>Notes:</strong> "{med.notes}"
                  </div>
                )}
              </div>

              {/* 1-TAP TAKEN / MISSED STATUS BUTTONS */}
              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
                <button
                  type="button"
                  onClick={() => handleToggleStatus(med.id, 'taken')}
                  className={`btn ${med.todayStatus === 'taken' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1, fontSize: '0.8rem', padding: '0.45rem 0.65rem' }}
                >
                  <CheckCircle2 size={15} /> Mark Taken
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleStatus(med.id, 'missed')}
                  className={`btn ${med.todayStatus === 'missed' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1, fontSize: '0.8rem', padding: '0.45rem 0.65rem', color: med.todayStatus === 'missed' ? '#FFF' : 'var(--danger)', borderColor: 'var(--danger)' }}
                >
                  <XCircle size={15} /> Mark Missed
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* CLEAN EMPTY STATE WITH ZERO DUMMY DATA */
        <div className="numa-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-full)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Pill size={28} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.4rem' }}>No Medications Logged Yet</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
            Your medication list is empty. Tap the button below to add your real doctor prescriptions or daily supplements.
          </p>
          <button onClick={handleOpenAdd} className="btn btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}>
            <Plus size={16} /> + Add Your First Medication / Supplement
          </button>
        </div>
      )}

      {/* SECTION 2: CHRONOLOGICAL MEDICATION TIMELINE */}
      {medications.some((m) => m.history && m.history.length > 0) && (
        <div className="numa-card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.4rem' }}>Chronological Medication Timeline</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Historical record of all taken and missed doses.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {medications.flatMap((m) =>
              (m.history || []).map((h, idx) => (
                <div key={`${m.id}_${h.date}_${idx}`} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>📅 {h.date}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)' }}>{m.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({m.dosage})</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{h.time}</span>
                    <span className={`badge ${h.status === 'taken' ? 'badge-mint' : 'badge-danger'}`} style={{ fontSize: '0.75rem' }}>
                      {h.status === 'taken' ? '✓ Taken' : '✗ Missed'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ADD / RECTIFY MEDICATION MODAL */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem', maxWidth: '560px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Pill size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>
                  {editingMedId ? 'Rectify / Edit Medication' : 'Add Medication / Supplement'}
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="btn btn-outline btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveMed} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Medication / Supplement Name</label>
                <input
                  type="text"
                  placeholder="e.g. Myo-Inositol, Metformin ER, Vitamin D3..."
                  value={medForm.name}
                  onChange={(e) => setMedForm({ ...medForm, name: e.target.value })}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Category</label>
                  <select value={medForm.category} onChange={(e) => setMedForm({ ...medForm, category: e.target.value })} style={{ width: '100%' }}>
                    <option value="supplement">🌿 Supplement</option>
                    <option value="prescription">🩺 Doctor Prescription</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Dosage</label>
                  <input
                    type="text"
                    placeholder="e.g. 500mg, 2000 IU, 1 scoop"
                    value={medForm.dosage}
                    onChange={(e) => setMedForm({ ...medForm, dosage: e.target.value })}
                    required
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Reminder Timing</label>
                  <input
                    type="text"
                    placeholder="e.g. 8:00 AM & 8:00 PM"
                    value={medForm.timing}
                    onChange={(e) => setMedForm({ ...medForm, timing: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Prescribed By</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Endocrinologist / Self"
                    value={medForm.prescribedBy}
                    onChange={(e) => setMedForm({ ...medForm, prescribedBy: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Start Date</label>
                  <input
                    type="date"
                    value={medForm.startDate}
                    onChange={(e) => setMedForm({ ...medForm, startDate: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>End Date</label>
                  <input
                    type="text"
                    placeholder="Ongoing or YYYY-MM-DD"
                    value={medForm.endDate}
                    onChange={(e) => setMedForm({ ...medForm, endDate: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Doctor & User Notes</label>
                <QuickChips value={medForm.notes} onChange={(val) => setMedForm({ ...medForm, notes: val })} category="general" />
                <textarea
                  rows="2"
                  placeholder="Tap chips above or type custom instructions..."
                  value={medForm.notes}
                  onChange={(e) => setMedForm({ ...medForm, notes: e.target.value })}
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  <Check size={16} /> {editingMedId ? 'Save Rectified Treatment' : 'Save Treatment'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
