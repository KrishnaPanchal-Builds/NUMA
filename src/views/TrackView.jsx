import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Activity, Plus, Check, Filter, Search, ChevronRight, Info, Edit2, TrendingUp, TrendingDown, Minus, List } from 'lucide-react';
import GoogleCalendarView from '../components/GoogleCalendarView';
import PersonalHealthTimeline from '../components/PersonalHealthTimeline';
import SymptomModal from '../components/SymptomModal';

export default function TrackView({
  cycles = [],
  timeline = [],
  symptoms = [],
  medications = [],
  labs = [],
  documents = [],
  appointments = [],
  onAddTimelineEntry,
  onUpdateTimelineEntry,
  onLogPeriod,
  onDeletePeriodLog,
  onDeleteTimelineEntry,
  onSaveSymptom,
  onAddCustomSymptom
}) {
  const [activeSubTab, setActiveSubTab] = useState('centralTimeline'); // 'centralTimeline' | 'googleCalendar' | 'symptoms'
  
  // Symptom Modal State
  const [showSymptomModal, setShowSymptomModal] = useState(false);
  const [editingSymptom, setEditingSymptom] = useState(null);

  // Symptom Search State
  const [symptomSearch, setSymptomSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Skin & Hair', 'Pain', 'Energy & Mood', 'Digestive', 'Metabolic', 'Sleep', 'Hormonal', 'Mental Health'];

  const filteredSymptoms = (Array.isArray(symptoms) ? symptoms : []).filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(symptomSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenEditSymptom = (sym) => {
    setEditingSymptom(sym);
    setShowSymptomModal(true);
  };

  const handleOpenAddCustom = () => {
    setEditingSymptom(null);
    setShowSymptomModal(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* View Sub-Navigation Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveSubTab('centralTimeline')}
          className={`btn ${activeSubTab === 'centralTimeline' ? 'btn-primary' : 'btn-outline'}`}
          style={{ fontSize: '0.875rem' }}
        >
          <List size={16} /> Central Health Timeline
        </button>

        <button
          onClick={() => setActiveSubTab('googleCalendar')}
          className={`btn ${activeSubTab === 'googleCalendar' ? 'btn-primary' : 'btn-outline'}`}
          style={{ fontSize: '0.875rem' }}
        >
          <CalendarIcon size={16} /> 3-Month Google Calendar
        </button>

        <button
          onClick={() => setActiveSubTab('symptoms')}
          className={`btn ${activeSubTab === 'symptoms' ? 'btn-primary' : 'btn-outline'}`}
          style={{ fontSize: '0.875rem' }}
        >
          <Activity size={16} /> Symptom Grid & Manager ({(symptoms || []).length})
        </button>
      </div>

      {/* TAB 1: SECTION 11 CENTRAL PERSONAL HEALTH TIMELINE */}
      {activeSubTab === 'centralTimeline' && (
        <PersonalHealthTimeline
          timeline={timeline}
          cycles={cycles}
          medications={medications}
          labs={labs}
          documents={documents}
          appointments={appointments}
          onUpdateTimelineEntry={onUpdateTimelineEntry}
          onDeleteTimelineEntry={onDeleteTimelineEntry}
          onAddTimelineEntry={onAddTimelineEntry}
        />
      )}

      {/* TAB 2: GOOGLE CALENDAR VIEW */}
      {activeSubTab === 'googleCalendar' && (
        <GoogleCalendarView
          events={timeline}
          cycles={cycles}
          onAddEvent={onAddTimelineEntry}
          onUpdateEvent={onUpdateTimelineEntry}
          onLogPeriod={onLogPeriod}
          onDeletePeriodLog={onDeletePeriodLog}
          onDeleteTimelineEntry={onDeleteTimelineEntry}
        />
      )}

      {/* TAB 3: SYMPTOM SEVERITY GRID & CONTINUOUS MANAGER */}
      {activeSubTab === 'symptoms' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="numa-card glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-teal" style={{ marginBottom: '0.25rem' }}>Full PCOS Symptom Suite</span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Symptom Severity & Progression Manager</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Track severity (1-5), duration, time of occurrence, and improvement/worsening trends.
              </p>
            </div>
            <button onClick={handleOpenAddCustom} className="btn btn-primary">
              <Plus size={18} /> Add Custom Symptom
            </button>
          </div>

          <div className="numa-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, position: 'relative', minWidth: '220px' }}>
                <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search PCOS symptoms (e.g. Acne, Fatigue)..."
                  value={symptomSearch}
                  onChange={(e) => setSymptomSearch(e.target.value)}
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid-1-2-3">
            {filteredSymptoms.map((sym) => (
              <div key={sym.id} className="numa-card numa-card-interactive" onClick={() => handleOpenEditSymptom(sym)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className="badge badge-teal">{sym.category}</span>
                  <span className={`badge ${sym.trend === 'improving' ? 'badge-mint' : sym.trend === 'worsening' ? 'badge-danger' : 'badge-amber'}`}>
                    {sym.trend === 'improving' ? <TrendingDown size={12} /> : sym.trend === 'worsening' ? <TrendingUp size={12} /> : <Minus size={12} />}
                    {sym.trend}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.4rem' }}>{sym.name}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Freq: <strong>{sym.frequency}</strong> • Duration: {sym.duration}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ flex: 1, height: '8px', background: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{
                      width: `${(sym.severity / 5) * 100}%`,
                      height: '100%',
                      background: sym.severity >= 4 ? 'var(--danger)' : sym.severity >= 3 ? 'var(--accent-amber)' : 'var(--accent-mint)'
                    }} />
                  </div>
                  <span style={{ fontWeight: '800', fontSize: '0.85rem' }}>{sym.severity}/5</span>
                </div>

                <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.75rem', padding: '0.35rem', gap: '0.3rem' }}>
                  <Edit2 size={13} /> Update / Edit Symptom
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SYMPTOM EDIT / CUSTOM SYMPTOM MODAL */}
      <SymptomModal
        isOpen={showSymptomModal}
        onClose={() => setShowSymptomModal(false)}
        symptom={editingSymptom}
        onSaveSymptom={onSaveSymptom}
        onAddCustomSymptom={onAddCustomSymptom}
      />

    </div>
  );
}
