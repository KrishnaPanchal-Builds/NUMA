import React, { useState } from 'react';
import { Calendar, Search, Filter, Download, Printer, Edit2, Trash2, Check, X, Droplets, Activity, Utensils, Moon, Brain, Pill, FileText, Stethoscope, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { aggregatePersonalTimeline } from '../utils/timelineAggregator';

export default function PersonalHealthTimeline({
  timeline = [],
  cycles = [],
  medications = [],
  labs = [],
  documents = [],
  appointments = [],
  onUpdateTimelineEntry,
  onDeleteTimelineEntry,
  onAddTimelineEntry
}) {
  const [viewMode, setViewMode] = useState('monthly'); // 'daily' | 'weekly' | 'monthly' | 'cycle'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  // Edit Modal Form State
  const [editForm, setEditForm] = useState({
    title: '',
    date: '',
    time: '',
    severity: 1,
    notes: ''
  });

  // Aggregate all events across all 14 health domains
  const allEvents = aggregatePersonalTimeline({
    timeline,
    cycles,
    medications,
    labs,
    documents,
    appointments
  });

  // Filter by Category
  const categoryFiltered = allEvents.filter((item) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'period' && (item.category === 'period' || item.category === 'symptoms')) return true;
    if (selectedCategory === 'lifestyle' && (item.category === 'nutrition' || item.category === 'exercise')) return true;
    if (selectedCategory === 'wellness' && (item.category === 'sleep' || item.category === 'mood')) return true;
    if (selectedCategory === 'clinical' && (item.category === 'meds' || item.category === 'labs')) return true;
    if (selectedCategory === 'medical' && (item.category === 'documents' || item.category === 'appointments')) return true;
    return item.category === selectedCategory;
  });

  // Filter by Search Query
  const searchFiltered = categoryFiltered.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      (item.notes || '').toLowerCase().includes(query) ||
      (item.date || '').includes(query)
    );
  });

  // Filter by View Mode Date Span
  const now = new Date();
  const finalFilteredEvents = searchFiltered.filter((item) => {
    const eventDate = new Date(item.date);
    if (isNaN(eventDate.getTime())) return true;

    if (viewMode === 'daily') {
      const todayStr = new Date().toISOString().split('T')[0];
      return item.date === todayStr;
    }
    if (viewMode === 'weekly') {
      const diffTime = Math.abs(now - eventDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }
    if (viewMode === 'monthly') {
      const diffTime = Math.abs(now - eventDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    }
    return true; // 'cycle' shows all grouped events
  });

  // Category Icon & Color Resolver
  const getCategoryMeta = (cat) => {
    switch (cat) {
      case 'period':
        return { icon: Droplets, color: '#EC4899', badge: 'badge-pink', label: 'Period & Bleeding' };
      case 'symptoms':
        return { icon: Activity, color: '#8B5CF6', badge: 'badge-primary', label: 'Symptom Log' };
      case 'nutrition':
        return { icon: Utensils, color: '#10B981', badge: 'badge-mint', label: 'Meal & Nutrition' };
      case 'exercise':
        return { icon: Activity, color: '#3B82F6', badge: 'badge-primary', label: 'Exercise & Activity' };
      case 'sleep':
        return { icon: Moon, color: '#6366F1', badge: 'badge-primary', label: 'Sleep Tracking' };
      case 'mood':
        return { icon: Brain, color: '#F59E0B', badge: 'badge-amber', label: 'Mood & Mental Well-Being' };
      case 'meds':
        return { icon: Pill, color: '#EC4899', badge: 'badge-pink', label: 'Medication & Supplement' };
      case 'labs':
        return { icon: FileText, color: '#8B5CF6', badge: 'badge-primary', label: 'Laboratory Result' };
      case 'documents':
        return { icon: FileText, color: '#10B981', badge: 'badge-mint', label: 'Medical Document' };
      case 'appointments':
        return { icon: Stethoscope, color: '#3B82F6', badge: 'badge-primary', label: 'Doctor Visit' };
      default:
        return { icon: Clock, color: 'var(--primary)', badge: 'badge-primary', label: 'Health Event' };
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setEditForm({
      title: item.title,
      date: item.date,
      time: item.time || '12:00 PM',
      severity: item.severity || 1,
      notes: item.notes || ''
    });
  };

  // Save Rectified Timeline Entry
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingItem) return;

    if (onUpdateTimelineEntry && editingItem.source === 'timeline') {
      onUpdateTimelineEntry({
        ...editingItem.raw,
        symptom: editForm.title,
        date: editForm.date,
        time: editForm.time,
        severity: editForm.severity,
        notes: editForm.notes
      });
    }

    setEditingItem(null);
  };

  // Delete Timeline Entry
  const handleDelete = (item) => {
    if (onDeleteTimelineEntry && item.source === 'timeline') {
      onDeleteTimelineEntry(item.id);
    } else {
      alert(`Note: Only custom timeline entries can be directly deleted from here. To delete prescriptions or lab records, please use their respective tabs.`);
    }
  };

  // Export Timeline to CSV
  const handleExportCSV = () => {
    if (finalFilteredEvents.length === 0) return alert('No timeline events to export.');
    let csvContent = 'data:text/csv;charset=utf-8,Date,Time,Category,Title,Severity,Notes\n';
    finalFilteredEvents.forEach((e) => {
      csvContent += `"${e.date}","${e.time}","${e.category}","${e.title.replace(/"/g, '""')}","${e.severity}","${(e.notes || '').replace(/"/g, '""')}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NUMA_Personal_Health_Timeline_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Banner & Control Toolbar */}
      <div className="numa-card glass-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Central Personal Health Timeline</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Unified chronological stream of all 14 health event types across your PCOS companion.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={handleExportCSV} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}>
            <Download size={15} /> Export CSV
          </button>

          <button onClick={() => window.print()} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}>
            <Printer size={15} /> Print Timeline Report
          </button>
        </div>
      </div>

      {/* Toolbar Controls: View Mode Switcher & Category Filters & Search */}
      <div className="numa-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        
        {/* Row 1: View Modes Switcher & Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          
          {/* View Modes */}
          <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-input)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
            {[
              { id: 'daily', label: 'Daily View' },
              { id: 'weekly', label: 'Weekly View (7d)' },
              { id: 'monthly', label: 'Monthly View (30d)' },
              { id: 'cycle', label: 'Cycle Phase View' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                style={{
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: viewMode === mode.id ? '800' : '600',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: viewMode === mode.id ? 'var(--primary)' : 'transparent',
                  color: viewMode === mode.id ? '#FFF' : 'var(--text-main)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Real-time Text Search */}
          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search health events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: '2.1rem', fontSize: '0.8rem' }}
            />
          </div>

        </div>

        {/* Row 2: Category Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
          {[
            { id: 'all', label: `All Events (${allEvents.length})` },
            { id: 'period', label: '🩸 Period & Symptoms' },
            { id: 'lifestyle', label: '🥗 Meals & Workouts' },
            { id: 'wellness', label: '😴 Sleep & Mood' },
            { id: 'clinical', label: '💊 Meds & Lab Results' },
            { id: 'medical', label: '📁 Documents & Doctor Visits' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`btn ${selectedCategory === cat.id ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* CHRONOLOGICAL TIMELINE STREAM */}
      {finalFilteredEvents.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {finalFilteredEvents.map((item) => {
            const meta = getCategoryMeta(item.category);
            const IconComp = meta.icon;

            return (
              <div
                key={item.id}
                className="numa-card"
                style={{
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'flex-start',
                  borderLeft: `4px solid ${meta.color}`,
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                  
                  {/* Category Icon */}
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-input)',
                    color: meta.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <IconComp size={18} />
                  </div>

                  <div>
                    {/* Date & Time Header Badges */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-primary" style={{ fontSize: '0.725rem' }}>📅 {item.date}</span>
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: '600' }}>⏰ {item.time}</span>
                      <span className={`badge ${meta.badge}`} style={{ fontSize: '0.725rem' }}>{meta.label}</span>
                      
                      {item.severity > 1 && (
                        <span className="badge badge-danger" style={{ fontSize: '0.725rem' }}>
                          Sev {item.severity}/5
                        </span>
                      )}
                    </div>

                    {/* Event Title */}
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.25rem', color: 'var(--text-main)' }}>
                      {item.title}
                    </h4>

                    {/* Detailed Notes */}
                    {item.notes && (
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                        {item.notes}
                      </p>
                    )}
                  </div>

                </div>

                {/* Event Actions: Edit & Delete */}
                <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="btn btn-outline btn-icon"
                    style={{ width: '28px', height: '28px', padding: 0 }}
                    title="Edit / Rectify Event"
                  >
                    <Edit2 size={13} />
                  </button>

                  <button
                    onClick={() => handleDelete(item)}
                    className="btn btn-outline btn-icon"
                    style={{ width: '28px', height: '28px', padding: 0, color: 'var(--danger)', borderColor: 'var(--danger)' }}
                    title="Delete Event"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* CLEAN EMPTY STATE */
        <div className="numa-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-full)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Calendar size={28} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.4rem' }}>No Timeline Events Found</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
            No health events match your active category filter or search query. Log your daily symptoms, meals, sleep, or medications to populate your personal timeline.
          </p>
        </div>
      )}

      {/* EDIT / RECTIFY TIMELINE EVENT MODAL */}
      {editingItem && (
        <div className="modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem', maxWidth: '520px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit2 size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Edit / Rectify Timeline Event</h3>
              </div>
              <button onClick={() => setEditingItem(null)} className="btn btn-outline btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Event Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Date</label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    required
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 08:30 AM"
                    value={editForm.time}
                    onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Severity Level ({editForm.severity}/5)</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={editForm.severity}
                  onChange={(e) => setEditForm({ ...editForm, severity: parseInt(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Notes & Event Details</label>
                <textarea
                  rows="3"
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setEditingItem(null)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  <Check size={16} /> Save Changes
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
