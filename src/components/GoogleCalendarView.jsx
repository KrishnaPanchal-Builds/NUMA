import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, Check, Droplets, AlertCircle, Trash2, Edit2, X, Save } from 'lucide-react';
import QuickChips from './QuickChips';

export default function GoogleCalendarView({ events, cycles, onAddEvent, onUpdateEvent, onLogPeriod, onDeletePeriodLog, onDeleteTimelineEntry }) {
  // Present Month State (Defaults to August 2026)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(7); // 0-indexed (7 = August)
  const [selectedDate, setSelectedDate] = useState('2026-08-12');

  // Period Logging Modal State
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [periodType, setPeriodType] = useState('Period Start Date');
  const [periodFlow, setPeriodFlow] = useState('Medium');
  const [periodCramps, setPeriodCramps] = useState(3);
  const [periodNotes, setPeriodNotes] = useState('');

  // Time-Wise Hourly Event Modal State
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [targetHour, setTargetHour] = useState('10:00 AM');
  const [eventTitle, setEventTitle] = useState('');
  const [eventSeverity, setEventSeverity] = useState(3);
  const [eventBleeding, setEventBleeding] = useState('None');
  const [eventNotes, setEventNotes] = useState('');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // 24 Hours List
  const full24HoursList = [
    '12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM',
    '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'
  ];

  // Single Month Stepping for Mobile Controls
  const handlePrevMonth = () => {
    let newMonth = currentMonthIndex - 1;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    setCurrentMonthIndex(newMonth);
    setCurrentYear(newYear);
  };

  const handleNextMonth = () => {
    let newMonth = currentMonthIndex + 1;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setCurrentMonthIndex(newMonth);
    setCurrentYear(newYear);
  };

  // 3-Month Stepping for Desktop Controls
  const handlePrev3Months = () => {
    let newMonth = currentMonthIndex - 3;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth += 12;
      newYear -= 1;
    }
    setCurrentMonthIndex(newMonth);
    setCurrentYear(newYear);
  };

  const handleNext3Months = () => {
    let newMonth = currentMonthIndex + 3;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth -= 12;
      newYear += 1;
    }
    setCurrentMonthIndex(newMonth);
    setCurrentYear(newYear);
  };

  const handleJumpToday = () => {
    setCurrentYear(2026);
    setCurrentMonthIndex(7);
    setSelectedDate('2026-08-12');
  };

  // Helper to compute month metadata relative to currentMonthIndex
  const getMonthMetadata = (offset) => {
    let monthIdx = currentMonthIndex + offset;
    let yr = currentYear;
    if (monthIdx < 0) {
      monthIdx += 12;
      yr -= 1;
    } else if (monthIdx > 11) {
      monthIdx -= 12;
      yr += 1;
    }
    const daysCount = new Date(yr, monthIdx + 1, 0).getDate();
    const startPadding = new Date(yr, monthIdx, 1).getDay();
    return { year: yr, monthIndex: monthIdx, monthName: monthNames[monthIdx], daysCount, startPadding };
  };

  // 3 Consecutive Months for Desktop
  const threeMonths = [getMonthMetadata(-2), getMonthMetadata(-1), getMonthMetadata(0)];
  // Single Focused Month for Mobile
  const currentMobileMonth = getMonthMetadata(0);

  const getEventsForDate = (dateStr) => {
    const safeEvents = Array.isArray(events) ? events : [];
    return safeEvents.filter((e) => e && (e.date === dateStr || (!e.date && dateStr === '2026-08-12')));
  };

  const selectedDateEvents = getEventsForDate(selectedDate);
  const existingPeriodLog = selectedDateEvents.find((e) => e.symptom?.includes('Period') || e.bleedingLevel !== 'None');
  const hasPeriodMarkOnSelectedDate = Boolean(existingPeriodLog);

  // AUTOMATIC ENTRY RETENTION: Pre-populate existing saved details when opening modal
  useEffect(() => {
    if (showPeriodModal) {
      if (existingPeriodLog) {
        if (existingPeriodLog.symptom?.includes('Start')) setPeriodType('Period Start Date');
        else if (existingPeriodLog.symptom?.includes('End')) setPeriodType('Period End Date');
        else if (existingPeriodLog.symptom?.includes('Spotting')) setPeriodType('Spotting');
        else setPeriodType('Period Day');

        setPeriodFlow(existingPeriodLog.bleedingLevel && existingPeriodLog.bleedingLevel !== 'None' ? existingPeriodLog.bleedingLevel : 'Medium');
        setPeriodCramps(existingPeriodLog.severity || existingPeriodLog.painLevel || 3);
        setPeriodNotes(existingPeriodLog.notes || '');
      } else {
        setPeriodType('Period Start Date');
        setPeriodFlow('Medium');
        setPeriodCramps(3);
        setPeriodNotes('');
      }
    }
  }, [showPeriodModal, selectedDate]);

  // Save period log (Retains existing entry ID if updating)
  const handleSavePeriodLog = (e) => {
    if (e) e.preventDefault();

    if (existingPeriodLog && onUpdateEvent) {
      onUpdateEvent({
        ...existingPeriodLog,
        date: selectedDate,
        time: 'Whole Day',
        symptom: `${periodType}: ${periodFlow} Flow`,
        severity: parseInt(periodCramps),
        bleedingLevel: periodFlow,
        painLevel: parseInt(periodCramps),
        notes: periodNotes || `${periodType} recorded`
      });
    } else if (onAddEvent) {
      onAddEvent({
        id: 'p_log_' + Date.now(),
        date: selectedDate,
        time: 'Whole Day',
        symptom: `${periodType}: ${periodFlow} Flow`,
        severity: parseInt(periodCramps),
        bleedingLevel: periodFlow,
        painLevel: parseInt(periodCramps),
        notes: periodNotes || `${periodType} recorded`
      });
    }

    if (periodType === 'Period Start Date' && onLogPeriod) {
      onLogPeriod({
        id: 'c_' + Date.now(),
        startDate: selectedDate,
        flow: periodFlow,
        crampsSeverity: parseInt(periodCramps),
        spotting: periodFlow === 'Spotting'
      });
    }

    setShowPeriodModal(false);
  };

  // Delete Period Mark
  const handleDeletePeriodMark = () => {
    if (onDeletePeriodLog) {
      onDeletePeriodLog(selectedDate);
    }
    setShowPeriodModal(false);
  };

  // Open Event Modal
  const handleOpenAddEventForHour = (hour) => {
    setEditingEventId(null);
    setTargetHour(hour);
    setEventTitle('');
    setEventSeverity(3);
    setEventBleeding('None');
    setEventNotes('');
    setShowEventModal(true);
  };

  const handleOpenEditEvent = (ev) => {
    setEditingEventId(ev.id);
    setTargetHour(ev.time || '10:00 AM');
    setEventTitle(ev.symptom || '');
    setEventSeverity(ev.severity || 3);
    setEventBleeding(ev.bleedingLevel || 'None');
    setEventNotes(ev.notes || '');
    setShowEventModal(true);
  };

  // Save or Update Hourly Event
  const handleSaveHourlyEvent = (e) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    if (editingEventId && onUpdateEvent) {
      onUpdateEvent({
        id: editingEventId,
        date: selectedDate,
        time: targetHour,
        symptom: eventTitle,
        severity: parseInt(eventSeverity),
        bleedingLevel: eventBleeding,
        painLevel: parseInt(eventSeverity),
        notes: eventNotes
      });
    } else if (onAddEvent) {
      onAddEvent({
        id: 'e_' + Date.now(),
        date: selectedDate,
        time: targetHour,
        symptom: eventTitle,
        severity: parseInt(eventSeverity),
        bleedingLevel: eventBleeding,
        painLevel: parseInt(eventSeverity),
        notes: eventNotes
      });
    }

    setShowEventModal(false);
    setEventTitle('');
    setEventNotes('');
  };

  // EXACT AM/PM HOURLY MATCHING FIX
  const isEventMatchingHour = (eventTime, hourSlot) => {
    if (!eventTime) return false;
    if (eventTime === hourSlot) return true;

    const normalize = (t) => {
      if (!t) return '';
      const parts = t.trim().split(' ');
      if (parts.length < 2) return t.trim().toUpperCase();
      const timePart = parts[0];
      const ampm = parts[1].toUpperCase();
      const [h, m] = timePart.split(':');
      const hNum = parseInt(h);
      const hStr = hNum < 10 ? '0' + hNum : '' + hNum;
      return `${hStr}:${m || '00'} ${ampm}`;
    };

    return normalize(eventTime) === normalize(hourSlot);
  };

  // Reusable Single Month Grid Renderer
  const renderSingleMonthGrid = (m) => (
    <div key={m.monthName + '_' + m.year} className="numa-card" style={{ padding: '1rem' }}>
      
      <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontSize: '1.05rem', fontWeight: '800' }}>
          {m.monthName} {m.year}
        </h4>
        <span style={{ fontSize: '0.725rem', color: 'var(--primary)', fontWeight: '700' }}>Tap day to select</span>
      </div>

      {/* Day Headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.2rem', textAlign: 'center', fontWeight: '700', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
      </div>

      {/* Day Cells Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem' }}>
        {Array.from({ length: m.startPadding }).map((_, i) => (
          <div key={'blank_' + i} style={{ height: '42px', opacity: 0.2 }} />
        ))}

        {Array.from({ length: m.daysCount }, (_, i) => i + 1).map((dayNum) => {
          const dayStr = dayNum < 10 ? '0' + dayNum : '' + dayNum;
          const monthStr = (m.monthIndex + 1) < 10 ? '0' + (m.monthIndex + 1) : '' + (m.monthIndex + 1);
          const dateStr = `${m.year}-${monthStr}-${dayStr}`;
          
          const isSelected = selectedDate === dateStr;
          const dayEvents = getEventsForDate(dateStr);
          const hasPeriodLog = dayEvents.some((e) => e.symptom?.includes('Period'));

          return (
            <button
              key={dayNum}
              onClick={() => setSelectedDate(dateStr)}
              style={{
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                background: isSelected 
                  ? 'var(--primary)' 
                  : hasPeriodLog 
                  ? 'var(--secondary-light)' 
                  : 'var(--bg-input)',
                color: isSelected ? '#FFF' : hasPeriodLog ? 'var(--secondary)' : 'var(--text-main)',
                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.25rem 0.1rem',
                fontWeight: isSelected || hasPeriodLog ? '800' : '600',
                fontSize: '0.75rem',
                position: 'relative'
              }}
              title={`Click to view 24-hr log for ${dateStr}`}
            >
              <span>{dayNum}</span>
              <div style={{ display: 'flex', gap: '2px' }}>
                {hasPeriodLog && <span style={{ fontSize: '0.6rem' }}>🩸</span>}
                {dayEvents.slice(0, 2).map((_, evIdx) => (
                  <div key={evIdx} style={{ width: '3px', height: '3px', borderRadius: 'var(--radius-full)', background: isSelected ? '#FFF' : 'var(--primary)' }} />
                ))}
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Calendar Header Bar with Adaptive Navigation */}
      <div className="numa-card glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CalendarIcon size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800' }}>
              <span className="hide-mobile">3-Month Calendar View</span>
              <span className="hide-desktop">Calendar Tracker</span>
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Selected Date: <strong>{selectedDate}</strong> {hasPeriodMarkOnSelectedDate ? '(🔴 Period Marked)' : ''}
            </p>
          </div>
        </div>

        {/* Desktop Multi-Month Navigation Controls */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={handleJumpToday} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
            Today
          </button>
          <button onClick={handlePrev3Months} className="btn btn-outline btn-icon" title="Previous 3 Months">
            <ChevronLeft size={18} />
          </button>
          <span style={{ fontWeight: '800', fontSize: '1rem', minWidth: '220px', textAlign: 'center' }}>
            {threeMonths[0].monthName.slice(0, 3)} - {threeMonths[2].monthName} {threeMonths[2].year}
          </span>
          <button onClick={handleNext3Months} className="btn btn-outline btn-icon" title="Next 3 Months">
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Mobile Single-Month Navigation Controls */}
        <div className="hide-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button onClick={handleJumpToday} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>
            Today
          </button>
          <button onClick={handlePrevMonth} className="btn btn-outline btn-icon" style={{ width: '32px', height: '32px' }} title="Previous Month">
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontWeight: '800', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
            {currentMobileMonth.monthName} {currentMobileMonth.year}
          </span>
          <button onClick={handleNextMonth} className="btn btn-outline btn-icon" style={{ width: '32px', height: '32px' }} title="Next Month">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Dedicated Explicit Period Logger Button */}
        <button onClick={() => setShowPeriodModal(true)} className="btn btn-primary" style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}>
          <Droplets size={16} /> + Log Period
        </button>
      </div>

      {/* MAIN VIEW: ADAPTIVE CALENDAR GRID & 24-HR SCHEDULE PANEL */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* DESKTOP VIEW: 3-MONTH SIDE-BY-SIDE GRID */}
        <div className="hide-mobile" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {threeMonths.map((m) => renderSingleMonthGrid(m))}
        </div>

        {/* MOBILE VIEW: SINGLE CURRENT MONTH FOCUSED GRID */}
        <div className="hide-desktop">
          {renderSingleMonthGrid(currentMobileMonth)}
        </div>

        {/* FULL 24-HOUR HOURLY SCHEDULE & EDITABLE SLOTS FOR SELECTED DATE */}
        <div className="numa-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>24-Hour Schedule for {selectedDate}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click any slot to add/edit hourly symptom or schedule logs</p>
            </div>
            <button onClick={() => handleOpenAddEventForHour('10:00 AM')} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
              <Plus size={14} /> Add Event
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.5rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.25rem' }}>
            {full24HoursList.map((hour) => {
              const hourEvents = selectedDateEvents.filter((e) => isEventMatchingHour(e.time, hour));

              return (
                <div key={hour} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.45rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: hourEvents.length > 0 ? 'var(--primary-light)' : 'var(--bg-input)',
                  border: `1px solid ${hourEvents.length > 0 ? 'rgba(139, 92, 246, 0.3)' : 'var(--border-color)'}`,
                  cursor: 'pointer'
                }} onClick={() => hourEvents.length > 0 ? handleOpenEditEvent(hourEvents[0]) : handleOpenAddEventForHour(hour)}>
                  
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', width: '68px', flexShrink: 0 }}>
                    {hour}
                  </span>

                  <div style={{ flex: 1 }}>
                    {hourEvents.length > 0 ? (
                      hourEvents.map((ev) => (
                        <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-main)' }}>
                            {ev.symptom} {ev.notes ? `— "${ev.notes}"` : ''}
                          </div>
                          <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleOpenEditEvent(ev); }}
                              className="btn btn-outline btn-icon"
                              style={{ width: '24px', height: '24px', padding: 0 }}
                              title="Edit Event"
                            >
                              <Edit2 size={12} />
                            </button>
                            {onDeleteTimelineEntry && (
                              <button
                                onClick={(e) => { e.stopPropagation(); onDeleteTimelineEntry(ev.id); }}
                                className="btn btn-outline btn-icon"
                                style={{ width: '24px', height: '24px', padding: 0, color: 'var(--danger)' }}
                                title="Delete event"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                        Click to add event for {hour}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* EXPLICIT PERIOD LOGGING MODAL WITH TOP ACTION BUTTONS & PRE-POPULATION */}
      {showPeriodModal && (
        <div className="modal-overlay" onClick={() => setShowPeriodModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem', maxWidth: '580px' }}>
            
            {/* TOP HEADER WITH TITLE & ACTION BUTTONS RIGHT BESIDE TITLE */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Droplets size={22} color="var(--secondary)" />
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>Log Period & Monthly Track</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                    Mark period details for <strong>{selectedDate}</strong>
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS DIRECTLY AT TOP RIGHT OF MODAL */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                {hasPeriodMarkOnSelectedDate && (
                  <button
                    type="button"
                    onClick={handleDeletePeriodMark}
                    className="btn btn-outline"
                    style={{ color: 'var(--danger)', borderColor: 'var(--danger)', fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                    title="Delete / Clear Period Mark"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSavePeriodLog}
                  className="btn btn-primary"
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                  title="Save Period Log"
                >
                  <Save size={14} /> Save Log
                </button>

                <button
                  type="button"
                  onClick={() => setShowPeriodModal(false)}
                  className="btn btn-outline btn-icon"
                  style={{ width: '32px', height: '32px', padding: 0 }}
                  title="Cancel / Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSavePeriodLog} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>Period Event Type (Tap to Select / Deselect)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {['Period Start Date', 'Period Day', 'Period End Date', 'Spotting'].map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setPeriodType(periodType === type ? '' : type)}
                      className={`btn ${periodType === type ? 'btn-primary' : 'btn-outline'}`}
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
                    >
                      {periodType === type && <Check size={14} />} {type}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Flow Intensity</label>
                  <select value={periodFlow} onChange={(e) => setPeriodFlow(e.target.value)} style={{ width: '100%' }}>
                    {['Spotting', 'Light', 'Medium', 'Heavy'].map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Cramps Severity (1-5)</label>
                  <select value={periodCramps} onChange={(e) => setPeriodCramps(e.target.value)} style={{ width: '100%' }}>
                    {[1, 2, 3, 4, 5].map((c) => <option key={c} value={c}>{c} {c === 1 ? '- Mild' : c === 5 ? '- Severe' : ''}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Notes & Details</label>
                <QuickChips value={periodNotes} onChange={setPeriodNotes} category="period" />
                <textarea rows="2" placeholder="Tap chips above or type custom details here..." value={periodNotes} onChange={(e) => setPeriodNotes(e.target.value)} style={{ width: '100%', resize: 'none' }} />
              </div>

            </form>
          </div>
        </div>
      )}

      {/* HOURLY ADD/EDIT EVENT MODAL */}
      {showEventModal && (
        <div className="modal-overlay" onClick={() => setShowEventModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.25rem' }}>
              {editingEventId ? 'Edit Event' : 'Add Hourly Event'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Date: <strong>{selectedDate}</strong> at <strong>{targetHour}</strong>
            </p>

            <form onSubmit={handleSaveHourlyEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Event Title / Symptom</label>
                <input
                  type="text"
                  placeholder="e.g. Inositol Supplement, Afternoon Fatigue..."
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Severity (1-5)</label>
                  <select value={eventSeverity} onChange={(e) => setEventSeverity(e.target.value)} style={{ width: '100%' }}>
                    {[1, 2, 3, 4, 5].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Bleeding Level</label>
                  <select value={eventBleeding} onChange={(e) => setEventBleeding(e.target.value)} style={{ width: '100%' }}>
                    {['None', 'Spotting', 'Light', 'Medium', 'Heavy'].map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Notes & Additional Details</label>
                <QuickChips value={eventNotes} onChange={setEventNotes} category="general" />
                <textarea rows="2" placeholder="Tap chips above or type custom details here..." value={eventNotes} onChange={(e) => setEventNotes(e.target.value)} style={{ width: '100%', resize: 'none' }} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowEventModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  <Check size={16} /> {editingEventId ? 'Update Event' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
