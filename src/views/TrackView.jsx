import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Activity, Plus, Check, Filter, Search, ChevronRight, Info, Edit2, TrendingUp, TrendingDown, Minus, List, Layers } from 'lucide-react';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Mobile-Optimized Sub-Navigation Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        
        {/* Desktop Buttons Navigation */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
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

        {/* Mobile Segmented View Selector */}
        <div className="hide-desktop" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem', background: 'var(--bg-input)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveSubTab('centralTimeline')}
            style={{
              padding: '0.5rem 0.25rem',
              borderRadius: 'var(--radius-sm)',
              background: activeSubTab === 'centralTimeline' ? 'var(--primary)' : 'transparent',
              color: activeSubTab === 'centralTimeline' ? '#FFF' : 'var(--text-muted)',
              fontWeight: activeSubTab === 'centralTimeline' ? '800' : '600',
              fontSize: '0.75rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.15rem'
            }}
          >
            <List size={14} /> Timeline
          </button>

          <button
            onClick={() => setActiveSubTab('googleCalendar')}
            style={{
              padding: '0.5rem 0.25rem',
              borderRadius: 'var(--radius-sm)',
              background: activeSubTab === 'googleCalendar' ? 'var(--primary)' : 'transparent',
              color: activeSubTab === 'googleCalendar' ? '#FFF' : 'var(--text-muted)',
              fontWeight: activeSubTab === 'googleCalendar' ? '800' : '600',
              fontSize: '0.75rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.15rem'
            }}
          >
            <CalendarIcon size={14} /> Calendar
          </button>

          <button
            onClick={() => setActiveSubTab('symptoms')}
            style={{
              padding: '0.5rem 0.25rem',
              borderRadius: 'var(--radius-sm)',
              background: activeSubTab === 'symptoms' ? 'var(--primary)' : 'transparent',
              color: activeSubTab === 'symptoms' ? '#FFF' : 'var(--text-muted)',
              fontWeight: activeSubTab === 'symptoms' ? '800' : '600',
              fontSize: '0.75rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.15rem'
            }}
          >
            <Activity size={14} /> Symptoms
          </button>
        </div>

      </div>

      {/* SUB-TAB 1: CENTRAL PERSONAL HEALTH TIMELINE */}
      {activeSubTab === 'centralTimeline' && (
        <PersonalHealthTimeline
          timeline={timeline}
          cycles={cycles}
          medications={medications}
          labs={labs}
          documents={documents}
          appointments={appointments}
          onAddEntry={onAddTimelineEntry}
          onUpdateEntry={onUpdateTimelineEntry}
          onLogPeriod={onLogPeriod}
          onDeletePeriodLog={onDeletePeriodLog}
          onDeleteTimelineEntry={onDeleteTimelineEntry}
        />
      )}

      {/* SUB-TAB 2: GOOGLE CALENDAR VIEW */}
      {activeSubTab === 'googleCalendar' && (
        <GoogleCalendarView
          events={timeline || []}
          timeline={timeline || []}
          cycles={cycles || []}
          appointments={appointments || []}
          onAddEvent={onAddTimelineEntry}
          onUpdateEvent={onUpdateTimelineEntry}
          onLogPeriod={onLogPeriod}
          onDeletePeriodLog={onDeletePeriodLog}
          onDeleteTimelineEntry={onDeleteTimelineEntry}
        />
      )}

      {/* SUB-TAB 3: SYMPTOM GRID & MANAGER */}
      {activeSubTab === 'symptoms' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Header Bar */}
          <div className="numa-card glass-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Symptom Grid & Custom Tracker</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Track severity (0–5), custom user parameters, and trend indicators across 9 clinical categories.
              </p>
            </div>

            <button onClick={handleOpenAddCustom} className="btn btn-primary" style={{ padding: '0.5rem 0.9rem', fontSize: '0.825rem' }}>
              <Plus size={16} /> + Add Custom Symptom
            </button>
          </div>

          {/* Search & Category Filter Bar */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={symptomSearch}
                onChange={(e) => setSymptomSearch(e.target.value)}
                placeholder="Search symptom or parameter..."
                style={{ width: '100%', paddingLeft: '2.3rem' }}
              />
            </div>

            {/* Category Select Filter */}
            <div style={{ minWidth: '160px' }}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    Category: {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Symptom Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {filteredSymptoms.map((sym) => (
              <div
                key={sym.id}
                className="numa-card glass-card"
                style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', border: '1px solid var(--border-color)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="badge badge-primary" style={{ fontSize: '0.65rem', marginBottom: '0.25rem' }}>
                      {sym.category}
                    </span>
                    <h4 style={{ fontSize: '1rem', fontWeight: '800' }}>{sym.name}</h4>
                  </div>

                  <button
                    onClick={() => handleOpenEditSymptom(sym)}
                    className="btn btn-outline btn-icon"
                    style={{ width: '30px', height: '30px' }}
                    title="Edit Symptom Severity & Notes"
                  >
                    <Edit2 size={13} />
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-input)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current Severity</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '800', color: sym.severity >= 4 ? 'var(--danger)' : 'var(--primary)' }}>
                    {sym.severity || 0} / 5
                  </span>
                </div>

                <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                  {sym.notes || 'No recent notes.'}
                </p>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Symptom Manager Modal */}
      {showSymptomModal && (
        <SymptomModal
          isOpen={showSymptomModal}
          onClose={() => setShowSymptomModal(false)}
          editingSymptom={editingSymptom}
          onSaveSymptom={onSaveSymptom}
          onAddCustomSymptom={onAddCustomSymptom}
        />
      )}

    </div>
  );
}
