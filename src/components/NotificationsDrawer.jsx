import React, { useState } from 'react';
import { X, Bell, Pill, Droplets, Calendar, Moon, Check, Trash2, Plus, Clock, Edit2, ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react';

export default function NotificationsDrawer({
  isOpen,
  onClose,
  onNavigate,
  reminders = [],
  onSaveReminders
}) {
  if (!isOpen) return null;

  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    message: '',
    time: '08:00 AM',
    category: 'med' // med, hydration, appointment, sleep, custom
  });

  const activeReminders = Array.isArray(reminders) ? reminders : [];
  const unreadCount = activeReminders.filter((n) => !n.read && n.active !== false).length;

  // Toggle Reminder Active State
  const handleToggleActive = (id) => {
    const updated = activeReminders.map((n) => n.id === id ? { ...n, active: !(n.active !== false) } : n);
    if (onSaveReminders) onSaveReminders(updated);
  };

  // Mark Read / Completed
  const handleAction = (n) => {
    const updated = activeReminders.map((item) => item.id === n.id ? { ...item, read: true } : item);
    if (onSaveReminders) onSaveReminders(updated);

    if (n.category === 'appointment') {
      onClose();
      onNavigate('appointment');
    }
  };

  // Mark All Read
  const handleMarkAllRead = () => {
    const updated = activeReminders.map((n) => ({ ...n, read: true }));
    if (onSaveReminders) onSaveReminders(updated);
  };

  // Delete Reminder
  const handleDeleteReminder = (id) => {
    const updated = activeReminders.filter((n) => n.id !== id);
    if (onSaveReminders) onSaveReminders(updated);
  };

  // Add Custom User Reminder
  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const newReminder = {
      id: `rem_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: form.title.trim(),
      message: form.message.trim() || 'Custom user reminder',
      time: form.time || '10:00 AM',
      category: form.category,
      read: false,
      active: true,
      createdAt: new Date().toISOString()
    };

    if (onSaveReminders) {
      onSaveReminders([newReminder, ...activeReminders]);
    }

    setForm({ title: '', message: '', time: '08:00 AM', category: 'med' });
    setShowAddForm(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 99999 }}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()} style={{
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '460px',
        height: '100vh',
        borderRadius: 'var(--radius-xl) 0 0 var(--radius-xl)',
        padding: '1.5rem',
        animation: 'slideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Bell size={22} color="var(--primary)" />
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', lineHeight: 1.1 }}>My Personal Reminders</h2>
              <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', margin: 0 }}>Custom user-configured schedule & alerts</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
              <Plus size={14} /> {showAddForm ? 'Cancel' : '+ New'}
            </button>
            <button onClick={onClose} className="btn btn-outline btn-icon" style={{ width: '32px', height: '32px' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Custom Reminder Creation Form */}
        {showAddForm && (
          <form onSubmit={handleAddReminder} style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-lg)', marginBottom: '1rem', border: '1px solid var(--primary)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '0.75rem', color: 'var(--primary)' }}>
              ➕ Create Custom User Reminder
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div>
                <label style={{ fontSize: '0.725rem', fontWeight: '700', color: 'var(--text-muted)' }}>Reminder Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Evening Myo-Inositol (2000mg)"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.725rem', fontWeight: '700', color: 'var(--text-muted)' }}>Notes / Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Take with warm water after dinner"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.725rem', fontWeight: '700', color: 'var(--text-muted)' }}>Alert Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 08:30 PM"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.725rem', fontWeight: '700', color: 'var(--text-muted)' }}>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                  >
                    <option value="med">💊 Supplement / Med</option>
                    <option value="hydration">💧 Hydration Target</option>
                    <option value="appointment">🩺 Doctor Visit</option>
                    <option value="sleep">🌙 Sleep / Relax</option>
                    <option value="custom">🌸 Custom Wellness</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.4rem', padding: '0.6rem', fontSize: '0.85rem' }}>
                Save Custom Reminder
              </button>
            </div>
          </form>
        )}

        {/* Action bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>
            {activeReminders.length} Saved Reminders ({unreadCount} Pending)
          </span>

          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} className="btn btn-outline" style={{ fontSize: '0.725rem', padding: '0.25rem 0.55rem' }}>
              Mark All Read
            </button>
          )}
        </div>

        {/* Reminders List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {activeReminders.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-input)', borderRadius: 'var(--radius-lg)' }}>
              <Bell size={28} style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.85rem', margin: 0 }}>You haven't set any custom reminders yet. Click <strong>+ New</strong> to create one!</p>
            </div>
          ) : (
            activeReminders.map((n) => {
              const isEnabled = n.active !== false;
              return (
                <div key={n.id} style={{
                  background: isEnabled ? (n.read ? 'var(--bg-input)' : 'var(--primary-light)') : 'rgba(0,0,0,0.03)',
                  padding: '0.9rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${isEnabled ? (n.read ? 'var(--border-color)' : 'rgba(168, 85, 247, 0.35)') : 'var(--border-color)'}`,
                  opacity: isEnabled ? 1 : 0.65,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <strong style={{ fontSize: '0.875rem', color: isEnabled ? (n.read ? 'var(--text-main)' : 'var(--primary-dark)') : 'var(--text-muted)' }}>
                        {n.title}
                      </strong>
                      <span className="badge badge-primary" style={{ fontSize: '0.625rem', padding: '0.1rem 0.4rem' }}>
                        {n.time}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <button
                        onClick={() => handleToggleActive(n.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        title={isEnabled ? 'Pause Reminder' : 'Enable Reminder'}
                      >
                        {isEnabled ? <ToggleRight size={20} color="var(--primary)" /> : <ToggleLeft size={20} color="var(--text-muted)" />}
                      </button>

                      <button
                        onClick={() => handleDeleteReminder(n.id)}
                        className="btn btn-outline btn-icon"
                        style={{ width: '26px', height: '26px', border: 'none', color: 'var(--danger)' }}
                        title="Delete Reminder"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                    {n.message}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem' }}>
                    <span className="badge badge-secondary" style={{ fontSize: '0.65rem' }}>
                      {n.category || 'wellness'}
                    </span>

                    {!n.read && isEnabled && (
                      <button
                        onClick={() => handleAction(n)}
                        className="btn btn-primary"
                        style={{ fontSize: '0.725rem', padding: '0.25rem 0.6rem', gap: '0.25rem' }}
                      >
                        <Check size={12} /> Complete
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
