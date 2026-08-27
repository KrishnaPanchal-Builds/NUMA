import React from 'react';
import { Activity, Calendar, Clock, Plus, ArrowRight, ShieldCheck, Heart, Sparkles, AlertCircle, FileText, Folder, Eye, Stethoscope, Award } from 'lucide-react';

export default function HomeView({
  profile,
  dailyCheckIn,
  timeline,
  patterns,
  appointments,
  onOpenCheckIn,
  onNavigate,
  onOpenMealLog,
  onOpenHealthData,
  onOpenBreathing
}) {
  // DYNAMIC CYCLE ENGINE: Calculate actual cycle day, phase, and next period from user's logged LMP
  const getCycleCalculation = () => {
    const lmpStr = profile.lmpDate || '2026-08-01';
    const lmpDate = new Date(lmpStr);
    const today = new Date();
    
    // Elapsed Days
    const diffTime = today - lmpDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const targetCycleDays = profile.exactCycleDays || 34;
    const periodDuration = profile.exactPeriodDays || 5;

    let currentDay = (diffDays >= 0) ? (diffDays % targetCycleDays) + 1 : 1;
    
    // Cycle Phase
    let phase = 'Follicular Phase';
    let phaseBadge = 'Follicular / Pre-Ovulatory';
    let fertileEstimate = 'Estimated mid-cycle window';

    if (currentDay <= periodDuration) {
      phase = 'Menstrual Phase';
      phaseBadge = 'Menstrual Phase';
      fertileEstimate = 'Low probability window';
    } else if (currentDay >= (targetCycleDays - 16) && currentDay <= (targetCycleDays - 12)) {
      phase = 'Ovulatory Phase';
      phaseBadge = 'Ovulatory Window';
      fertileEstimate = 'Estimated peak fertile window';
    } else if (currentDay > (targetCycleDays - 12)) {
      phase = 'Luteal Phase';
      phaseBadge = 'Luteal Phase';
      fertileEstimate = 'Post-ovulatory window';
    }

    // Next Period Date Estimate
    const nextPeriodDate = new Date(lmpDate);
    nextPeriodDate.setDate(lmpDate.getDate() + targetCycleDays);
    const nextPeriodStr = nextPeriodDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return { currentDay, targetCycleDays, phase, phaseBadge, fertileEstimate, nextPeriodStr };
  };

  const cycleCalc = getCycleCalculation();
  const todayTimeline = timeline.filter((t) => !t.date || t.date === new Date().toISOString().split('T')[0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Dynamic Welcome & Calculated Cycle Status Banner */}
      <div className="numa-card glass-card" style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Personalized Health Companion</span>
              <h2 style={{ fontSize: '1.65rem', fontWeight: '800', marginBottom: '0.4rem' }}>
                Welcome back, {profile.name || 'Krishna Pankaj Panchal'}! 👋
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                You are currently on <strong style={{ color: 'var(--primary)' }}>Day {cycleCalc.currentDay}</strong> ({cycleCalc.phaseBadge}). Estimated fertile window: <strong>{cycleCalc.fertileEstimate}</strong>.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button onClick={onOpenCheckIn} className="btn btn-primary">
                <Plus size={16} /> 30s Check-in
              </button>
              <button onClick={onOpenMealLog} className="btn btn-outline">
                🍽️ AI Meal Log
              </button>
              <button onClick={onOpenHealthData} className="btn btn-outline">
                ❤️ Health Log
              </button>
            </div>
          </div>

          {/* Dynamic Calculated Progress Bar */}
          <div style={{ marginTop: '1.5rem', background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              <span>Period (Days 1–{profile.exactPeriodDays || 5})</span>
              <span style={{ color: 'var(--primary)', fontWeight: '800' }}>Day {cycleCalc.currentDay} of {cycleCalc.targetCycleDays} ({cycleCalc.phase})</span>
              <span>Next Period ~ {cycleCalc.nextPeriodStr}</span>
            </div>

            <div style={{ height: '10px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-full)', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${((profile.exactPeriodDays || 5) / cycleCalc.targetCycleDays) * 100}%`, background: 'var(--secondary)' }} title="Menstrual Phase" />
              <div style={{ width: `${((cycleCalc.currentDay) / cycleCalc.targetCycleDays) * 100}%`, background: 'var(--primary)' }} title="Elapsed Days" />
              <div style={{ flex: 1, background: 'var(--accent-mint)' }} title="Remaining Days" />
            </div>
          </div>
        </div>
      </div>

      {/* THREE PILLARS HERO SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        
        {/* Pillar 1 */}
        <div onClick={() => onNavigate('pcosFile')} className="numa-card glass-card" style={{ padding: '1.35rem', cursor: 'pointer', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem', transition: 'transform 0.2s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
              1
            </div>
            <div>
              <span className="badge badge-mint" style={{ fontSize: '0.65rem' }}>PILLAR 1</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>MY PCOS FILE</h3>
            </div>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
            Your complete longitudinal health story. Aggregates cycles, symptoms, labs, documents, meds, and 13 health domains.
          </p>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: 'auto' }}>
            Open My PCOS File <ArrowRight size={14} />
          </div>
        </div>

        {/* Pillar 2 */}
        <div onClick={() => onNavigate('insights')} className="numa-card glass-card" style={{ padding: '1.35rem', cursor: 'pointer', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem', transition: 'transform 0.2s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'var(--secondary-light)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
              2
            </div>
            <div>
              <span className="badge badge-rose" style={{ fontSize: '0.65rem' }}>PILLAR 2</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>OBSERVED-PATTERN ENGINE</h3>
            </div>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
            Understand changes and relationships within your own recorded data (cycle trends, sleep, GI choices, symptoms).
          </p>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: 'auto' }}>
            View Pattern Insights <ArrowRight size={14} />
          </div>
        </div>

        {/* Pillar 3 */}
        <div onClick={() => onNavigate('appointment')} className="numa-card glass-card" style={{ padding: '1.35rem', cursor: 'pointer', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem', transition: 'transform 0.2s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
              3
            </div>
            <div>
              <span className="badge badge-lavender" style={{ fontSize: '0.65rem' }}>PILLAR 3</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>BEFORE MY APPOINTMENT</h3>
            </div>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
            Turn months of scattered information into a clear healthcare conversation with a 1-page printable clinical summary.
          </p>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: 'auto' }}>
            Prepare Appointment Brief <ArrowRight size={14} />
          </div>
        </div>

      </div>

      {/* Main Grid: 24-Hr Timeline Snippet & Observed Patterns */}
      <div className="grid-2-1">
        
        {/* Left Column: Today's 24-Hour Timeline */}
        <div className="numa-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Today's 24-Hr Timeline</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Chronological symptom & schedule entries</p>
            </div>
            <button onClick={() => onNavigate('track')} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
              View Full Timeline <ArrowRight size={14} />
            </button>
          </div>

          {todayTimeline.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              <Clock size={28} color="var(--primary)" style={{ margin: '0 auto 0.5rem', display: 'block' }} />
              <p style={{ fontSize: '0.85rem' }}>No timeline entries logged for today yet.</p>
              <button onClick={() => onNavigate('track')} className="btn btn-outline" style={{ marginTop: '0.75rem', fontSize: '0.8rem' }}>
                <Plus size={14} /> Add Event to Timeline
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {todayTimeline.slice(0, 5).map((entry) => (
                <div key={entry.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: 'var(--radius-full)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.7rem', flexShrink: 0 }}>
                    {entry.time ? entry.time.split(' ')[0] : 'All'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '800' }}>{entry.symptom}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{entry.notes || 'No extra notes'}</p>
                  </div>
                  <span className="badge badge-mint">Severity {entry.severity}/5</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Observed Pattern Intelligence & Doctor Prep */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="numa-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Sparkles size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>Observed Pattern Engine</h3>
            </div>
            
            {patterns.slice(0, 1).map((pat) => (
              <div key={pat.id} style={{ background: 'var(--primary-light)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                <span className="badge badge-primary" style={{ marginBottom: '0.35rem' }}>{pat.type}</span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '0.3rem' }}>{pat.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: '1.4', marginBottom: '0.5rem' }}>
                  "{pat.observation}"
                </p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  💡 {pat.recommendation}
                </div>
              </div>
            ))}
          </div>

          <div className="numa-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <FileText size={18} color="var(--secondary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>"Before My Appointment"</h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Generate your 1-page printable brief with timeline logs & lab ranges for your doctor.
            </p>
            <button onClick={() => onNavigate('appointment')} className="btn btn-outline" style={{ width: '100%', fontSize: '0.8rem' }}>
              Open Appointment Prep Wizard
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
