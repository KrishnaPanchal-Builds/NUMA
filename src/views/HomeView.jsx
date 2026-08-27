import React from 'react';
import { Activity, Calendar, Clock, Plus, ArrowRight, ShieldCheck, Heart, Sparkles, AlertCircle, FileText, Folder, Eye, Stethoscope, Award, Smile, Sun, Moon, Utensils, Feather, Droplets } from 'lucide-react';

export default function HomeView({
  profile,
  dailyCheckIn,
  timeline,
  patterns,
  appointments,
  hydration = { amountMl: 0, targetMl: 2500 },
  onAddWater,
  onOpenHydration,
  onOpenCheckIn,
  onNavigate,
  onOpenMealLog,
  onOpenHealthData,
  onOpenBreathing
}) {
  const safeProfile = profile || {};

  // DYNAMIC CYCLE ENGINE: Calculate actual cycle day, phase, and next period from user's logged LMP
  const getCycleCalculation = () => {
    const lmpStr = safeProfile.lmpDate || '2026-08-01';
    const lmpDate = new Date(lmpStr);
    const today = new Date();
    
    // Elapsed Days
    const diffTime = today - lmpDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const targetCycleDays = safeProfile.exactCycleDays || 34;
    const periodDuration = safeProfile.exactPeriodDays || 5;

    let currentDay = (diffDays >= 0) ? (diffDays % targetCycleDays) + 1 : 1;
    
    // Cycle Phase
    let phase = 'Follicular Phase';
    let phaseBadge = 'Follicular / Pre-Ovulatory';
    let fertileEstimate = 'Estimated mid-cycle window';
    let phaseAffirmation = 'Your energy is naturally rising today! Ideal time for nourishing meals & gentle movement.';

    if (currentDay <= periodDuration) {
      phase = 'Menstrual Phase';
      phaseBadge = 'Menstrual Phase';
      fertileEstimate = 'Low probability window';
      phaseAffirmation = 'Rest & honor your body. Prioritize warmth, iron-rich foods, and gentle relaxation.';
    } else if (currentDay >= (targetCycleDays - 16) && currentDay <= (targetCycleDays - 12)) {
      phase = 'Ovulatory Phase';
      phaseBadge = 'Ovulatory Window';
      fertileEstimate = 'Estimated peak fertile window';
      phaseAffirmation = 'Peak vitality & brightness! High energy and fertile cervical fluid changes occur now.';
    } else if (currentDay > (targetCycleDays - 12)) {
      phase = 'Luteal Phase';
      phaseBadge = 'Luteal Phase';
      fertileEstimate = 'Post-ovulatory window';
      phaseAffirmation = 'Progesterone is rising. Slow down, prioritize magnesium, warm herbal teas, and soothing rest.';
    }

    // Next Period Date Estimate
    const nextPeriodDate = new Date(lmpDate);
    nextPeriodDate.setDate(lmpDate.getDate() + targetCycleDays);
    const nextPeriodStr = nextPeriodDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return { currentDay, targetCycleDays, phase, phaseBadge, fertileEstimate, phaseAffirmation, nextPeriodStr };
  };

  const cycleCalc = getCycleCalculation();
  const safeTimeline = Array.isArray(timeline) ? timeline : [];
  const todayTimeline = safeTimeline.filter((t) => !t.date || t.date === new Date().toISOString().split('T')[0]);

  const currentWater = hydration.amountMl || 0;
  const targetWater = hydration.targetMl || 2500;
  const waterPercent = Math.min(100, Math.round((currentWater / targetWater) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.65rem' }}>
      
      {/* Humanoid Hero Card: Your Daily Rhythm & Cycle Sanctuary */}
      <div className="numa-card glass-card" style={{
        padding: '2rem',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--bg-glass)',
        border: '1px solid rgba(168, 85, 247, 0.25)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-primary" style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', fontSize: '0.75rem', fontWeight: '800' }}>
                ✨ Your Cycle Sanctuary
              </span>
              <span className="badge badge-mint" style={{ fontSize: '0.75rem' }}>
                Day {cycleCalc.currentDay} of {cycleCalc.targetCycleDays}
              </span>
            </div>

            <h2 style={{ fontSize: '1.85rem', fontWeight: '800', marginBottom: '0.45rem', lineHeight: '1.2' }}>
              Welcome to your rhythm, <span className="gradient-text">{safeProfile.name || 'Krishna'}</span> 🌸
            </h2>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', maxWidth: '780px', lineHeight: '1.6' }}>
              You are currently in your <strong style={{ color: 'var(--primary)' }}>{cycleCalc.phase}</strong> ({cycleCalc.phaseBadge}). 
              <br />
              <em style={{ color: 'var(--text-muted)' }}>"{cycleCalc.phaseAffirmation}"</em>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button onClick={onOpenCheckIn} className="btn btn-primary" style={{ padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-full)' }}>
              <Plus size={18} /> 30s Daily Check-in
            </button>
            <button onClick={onOpenMealLog} className="btn btn-outline" style={{ borderRadius: 'var(--radius-full)' }}>
              <Utensils size={16} /> Nourish Log
            </button>
            <button onClick={onOpenHealthData} className="btn btn-outline" style={{ borderRadius: 'var(--radius-full)' }}>
              <Heart size={16} color="var(--secondary)" /> Vital Check
            </button>
          </div>
        </div>

        {/* Dynamic Living Cycle Progress Bar */}
        <div style={{ marginTop: '1.75rem', background: 'var(--bg-input)', padding: '1.15rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: '700', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ color: 'var(--secondary)' }}>🩸 Period (Days 1–{safeProfile.exactPeriodDays || 5})</span>
            <span style={{ color: 'var(--primary)', fontWeight: '800' }}>{cycleCalc.phase} • Day {cycleCalc.currentDay}</span>
            <span style={{ color: 'var(--accent-mint)' }}>🌸 Next Period ~ {cycleCalc.nextPeriodStr}</span>
          </div>

          <div style={{ height: '12px', width: '100%', background: 'rgba(0,0,0,0.06)', borderRadius: 'var(--radius-full)', overflow: 'hidden', display: 'flex', padding: '2px' }}>
            <div style={{ width: `${((safeProfile.exactPeriodDays || 5) / cycleCalc.targetCycleDays) * 100}%`, background: 'var(--secondary)', borderRadius: 'var(--radius-full)' }} title="Menstrual Phase" />
            <div style={{ width: `${((cycleCalc.currentDay) / cycleCalc.targetCycleDays) * 100}%`, background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)', borderRadius: 'var(--radius-full)' }} title="Elapsed Days" />
            <div style={{ flex: 1, background: 'var(--accent-mint-light)', borderRadius: 'var(--radius-full)' }} title="Remaining Days" />
          </div>
        </div>
      </div>

      {/* COMPULSORY HYDRATION TRACKER WIDGET */}
      <div className="numa-card glass-card" style={{
        padding: '1.25rem',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(14,165,233,0.08) 0%, rgba(59,130,246,0.08) 100%)',
        border: '1px solid rgba(14,165,233,0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: '#0EA5E9', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(14,165,233,0.3)' }}>
            <Droplets size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="badge badge-teal" style={{ fontSize: '0.65rem' }}>COMPULSORY HYDRATION TARGET</span>
              <strong style={{ fontSize: '1.05rem', color: '#0EA5E9' }}>{currentWater} / {targetWater} ml</strong>
            </div>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', margin: 0 }}>
              {waterPercent}% of daily goal logged ({targetWater - currentWater > 0 ? `${targetWater - currentWater} ml left` : 'Goal Reached! 🎉'})
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {onAddWater && (
            <>
              <button onClick={() => onAddWater(250)} className="btn btn-outline" style={{ fontSize: '0.78rem', padding: '0.35rem 0.7rem', borderColor: '#0EA5E9', color: '#0EA5E9' }}>
                + 250ml
              </button>
              <button onClick={() => onAddWater(500)} className="btn btn-outline" style={{ fontSize: '0.78rem', padding: '0.35rem 0.7rem', borderColor: '#0EA5E9', color: '#0EA5E9' }}>
                + 500ml
              </button>
            </>
          )}
          <button onClick={onOpenHydration} className="btn btn-primary" style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', background: '#0EA5E9' }}>
            💧 Manage Water Target
          </button>
        </div>
      </div>

      {/* THREE PILLARS HUMANOID CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.35rem' }}>
        
        {/* Pillar 1: MY BODY STORY */}
        <div
          onClick={() => onNavigate('pcosFile')}
          className="numa-card glass-card numa-card-interactive"
          style={{ padding: '1.5rem', border: '2px solid rgba(168, 85, 247, 0.3)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.1rem' }}>
              1
            </div>
            <div>
              <span className="badge badge-mint" style={{ fontSize: '0.65rem' }}>PILLAR 1</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>MY BODY STORY</h3>
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Your complete longitudinal health story. Cycles, lab findings, prescription timeline, and documents organized in one place.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: '700', fontSize: '0.85rem', marginTop: 'auto' }}>
            Explore My Body Story <ArrowRight size={16} />
          </div>
        </div>

        {/* Pillar 2: OBSERVED PATTERN ENGINE */}
        <div
          onClick={() => onNavigate('insights')}
          className="numa-card glass-card numa-card-interactive"
          style={{ padding: '1.5rem', border: '2px solid rgba(236, 72, 153, 0.3)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'var(--secondary-light)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.1rem' }}>
              2
            </div>
            <div>
              <span className="badge badge-secondary" style={{ fontSize: '0.65rem' }}>PILLAR 2</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>LIVING PATTERNS</h3>
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Understand changes & non-causal relationships within your own recorded data across sleep, meals, energy, and symptoms.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--secondary)', fontWeight: '700', fontSize: '0.85rem', marginTop: 'auto' }}>
            View Body Patterns <ArrowRight size={16} />
          </div>
        </div>

        {/* Pillar 3: BEFORE MY APPOINTMENT */}
        <div
          onClick={() => onNavigate('appointment')}
          className="numa-card glass-card numa-card-interactive"
          style={{ padding: '1.5rem', border: '2px solid rgba(20, 184, 166, 0.3)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'var(--accent-teal-light)', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.1rem' }}>
              3
            </div>
            <div>
              <span className="badge badge-teal" style={{ fontSize: '0.65rem' }}>PILLAR 3</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>BEFORE MY APPOINTMENT</h3>
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Turn months of scattered health logs into a clear, doctor-ready conversation report with saved questions.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-teal)', fontWeight: '700', fontSize: '0.85rem', marginTop: 'auto' }}>
            Prepare Doctor Report <ArrowRight size={16} />
          </div>
        </div>

      </div>

      {/* TODAY'S 24-HR TIMELINE & QUICK LOGGED EVENTS */}
      <div className="numa-card glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Today's 24-Hr Body Timeline</h3>
          </div>
          <button onClick={onOpenCheckIn} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
            <Plus size={14} /> Add Symptom Entry
          </button>
        </div>

        {todayTimeline.length === 0 ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
            <Feather size={28} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.875rem', margin: 0 }}>No entries logged yet today. Tap <strong>+ 30s Check-in</strong> to log your mood, flow, or symptoms!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {todayTimeline.map((item) => (
              <div key={item.id || Math.random()} style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary)' }}>{item.time || '10:00 AM'}</span>
                  <div>
                    <strong style={{ fontSize: '0.9rem', display: 'block' }}>{item.symptom || 'Symptom Entry'}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.notes || 'Logged event'}</span>
                  </div>
                </div>
                <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>Severity {item.severity || 2}/5</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
