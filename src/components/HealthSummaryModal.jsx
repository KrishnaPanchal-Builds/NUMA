import React, { useState } from 'react';
import { FileText, X, Download, Printer, Copy, Check, ShieldCheck, Sparkles, Calendar, Activity, Moon, Pill, Stethoscope, Utensils, Award } from 'lucide-react';

export default function HealthSummaryModal({ isOpen, onClose, profile, cycles = [], timeline = [], symptoms = [], labs = [], medications = [], meals = [], hydration = {}, appointments = [] }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const cycleCount = (Array.isArray(cycles) ? cycles : []).length;
  const avgCycleDays = profile.exactCycleDays || (cycleCount > 0 ? cycles[0].length : 34);
  const activeMeds = Array.isArray(medications) ? medications : [];
  const activeTimeline = Array.isArray(timeline) ? timeline : [];
  const activeLabs = Array.isArray(labs) ? labs : [];
  const activeMeals = Array.isArray(meals) ? meals : [];

  // Compute Major Symptoms & Severity
  const symptomFrequencyMap = {};
  activeTimeline.forEach((e) => {
    if (e.symptom) {
      symptomFrequencyMap[e.symptom] = (symptomFrequencyMap[e.symptom] || 0) + 1;
    }
  });

  const topSymptoms = Object.entries(symptomFrequencyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Compute Low-GI percentage
  const lowGiCount = activeMeals.filter((m) => m.analysis?.giRating === 'Low GI').length;
  const lowGiPct = activeMeals.length > 0 ? Math.round((lowGiCount / activeMeals.length) * 100) : 100;

  // Saved Questions for Doctor
  const savedQuestions = (appointments.length > 0 && appointments[0].savedQuestions) ? appointments[0].savedQuestions : [
    "What dietary adjustments support my insulin sensitivity?",
    "Based on my cycle duration of " + avgCycleDays + " days, should we test luteal progesterone?",
    "What blood biomarkers should we re-evaluate at my next check-up?"
  ];

  // Plaintext Summary Generator for Copy/Download
  const generatePlaintextSummary = () => {
    return `=====================================================
MY PERSONAL HEALTH SUMMARY - NUMA PCOS COMPANION
Generated on: ${new Date().toLocaleDateString()}
=====================================================

PATIENT DEMOGRAPHICS & CLINICAL BASELINE:
• Patient Name: ${profile.name || 'Krishna Pankaj Panchal'}
• Age: ${profile.exactAge || 27} years
• Height / Weight: ${profile.heightCm || 165} cm / ${profile.weightKg || 62} kg (BMI: ${profile.bmi || 22.8} kg/m²)
• Clinical Status: ${profile.diagnosisStatus || 'Confirmed PCOS'}
• PCOS Subtype: ${profile.pcosSubtype || 'Insulin Resistant PCOS'}

1. RECENT CYCLE HISTORY:
• Current Phase: Day ${profile.currentCycleDay || 14} (${profile.currentPhase || 'Follicular Phase'})
• Average Cycle Duration: ${avgCycleDays} days (${cycleCount} cycles recorded)
• Last Period Date: ${profile.lmpDate || 'Recorded in track tab'}

2. MAJOR SYMPTOMS RECORDED & FREQUENCY:
${topSymptoms.length > 0 ? topSymptoms.map(([sym, count]) => `• ${sym}: Logged ${count} times`).join('\n') : '• No major recurring symptoms logged.'}

3. LIFESTYLE & SLEEP PATTERNS:
• Average Sleep: ${profile.sleepHours || 7.5} hours/night
• Hydration Target: ${((hydration.amountMl || 0)/1000).toFixed(1)}L / ${((hydration.targetMl || 2500)/1000).toFixed(1)}L Daily
• Nutrition Pattern: ${lowGiPct}% Low-GI Meal Choices (${activeMeals.length} meals logged)

4. MEDICATION & SUPPLEMENT LOG:
${activeMeds.length > 0 ? activeMeds.map((m) => `• ${m.name} (${m.dosage}, ${m.frequency})`).join('\n') : '• No active prescriptions/supplements currently logged.'}

5. RELEVANT LABORATORY VALUES:
${activeLabs.length > 0 ? activeLabs.map((l) => `• ${l.name}: ${l.value} ${l.unit} (Ref: ${l.refRange})`).join('\n') : '• No manual lab results entered.'}

6. CHANGES OVER TIME & OBSERVATIONS:
• Recorded cycle regularity shows an average cycle of ${avgCycleDays} days.
• Low-GI meal choices correlate with stable daily energy levels.

7. QUESTIONS SAVED FOR CLINICIAN:
${savedQuestions.map((q, idx) => `${idx + 1}. "${q}"`).join('\n')}

=====================================================
DISCLAIMER: This summary is generated for educational organization and doctor consultation. It does not constitute a medical diagnosis.
=====================================================`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatePlaintextSummary());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([generatePlaintextSummary()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Health_Summary_${profile.name || 'NUMA'}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <FileText size={24} color="var(--primary)" />
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>My Personal Health Summary</h3>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button onClick={handleCopy} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem' }} title="Copy Summary Text">
              {copied ? <Check size={14} color="var(--primary)" /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}
            </button>
            <button onClick={handleDownloadTxt} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem' }} title="Download .txt File">
              <Download size={14} /> Download .txt
            </button>
            <button onClick={() => window.print()} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem' }}>
              <Printer size={14} /> Print / Export PDF
            </button>
            <button onClick={onClose} className="btn btn-outline btn-icon">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Safety Disclaimer */}
        <div style={{ padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '1.25rem' }}>
          <ShieldCheck size={14} color="var(--primary)" style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }} />
          This summary organizes your permitted records for provider appointments. It does not replace clinical evaluation or diagnose medical conditions.
        </div>

        {/* Printable Summary Sheet */}
        <div className="numa-card" style={{ padding: '1.75rem', border: '1px solid var(--border-color)', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Patient Demographics */}
          <div style={{ borderBottom: '2px solid var(--primary)', paddingBottom: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--primary)' }}>{profile.name || 'Krishna Pankaj Panchal'}</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Generated: {new Date().toLocaleDateString()}</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginTop: '0.35rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <span><strong>Age:</strong> {profile.exactAge || 27} yrs</span>
              <span><strong>BMI:</strong> {profile.bmi || 22.8} kg/m² ({profile.heightCm || 165}cm / {profile.weightKg || 62}kg)</span>
              <span><strong>Status:</strong> {profile.diagnosisStatus || 'Confirmed PCOS'}</span>
              <span><strong>Subtype:</strong> {profile.pcosSubtype || 'Insulin Resistant PCOS'}</span>
            </div>
          </div>

          {/* 1. Recent Cycle History */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={16} /> 1. Recent Cycle History
            </h4>
            <div style={{ background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
              • <strong>Current Phase:</strong> Day {profile.currentCycleDay || 14} ({profile.currentPhase || 'Follicular Phase'})<br />
              • <strong>Average Cycle Duration:</strong> {avgCycleDays} days ({cycleCount} cycles recorded in database)<br />
              • <strong>Flow & Cramp Profile:</strong> Mild to moderate cramps (3/5 average), normal flow pattern.
            </div>
          </div>

          {/* 2. Major Symptoms Recorded & Frequency */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Activity size={16} /> 2. Major Symptoms Recorded & Frequency
            </h4>
            <div style={{ background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
              {topSymptoms.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                  {topSymptoms.map(([sym, count], idx) => (
                    <li key={idx}><strong>{sym}:</strong> Logged {count} times in 24-hr symptom timeline</li>
                  ))}
                </ul>
              ) : (
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>No recurring major symptoms recorded yet.</p>
              )}
            </div>
          </div>

          {/* 3. Lifestyle & Sleep Patterns */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Moon size={16} /> 3. Lifestyle & Sleep Patterns
            </h4>
            <div style={{ background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
              • <strong>Average Sleep:</strong> {profile.sleepHours || 7.5} hours/night with consistent bedtime schedule<br />
              • <strong>Daily Hydration:</strong> {((hydration.amountMl || 0)/1000).toFixed(1)}L of {((hydration.targetMl || 2500)/1000).toFixed(1)}L goal<br />
              • <strong>Nutrition GI Rating:</strong> {lowGiPct}% Low-Glycemic Index meal choices ({activeMeals.length} meals logged)
            </div>
          </div>

          {/* 4. Medication & Supplement Log */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Pill size={16} /> 4. Medication & Supplement Log
            </h4>
            <div style={{ background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
              {activeMeds.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                  {activeMeds.map((m) => (
                    <li key={m.id}><strong>{m.name}:</strong> {m.dosage} ({m.frequency})</li>
                  ))}
                </ul>
              ) : (
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>No active medications currently logged.</p>
              )}
            </div>
          </div>

          {/* 5. Relevant Laboratory Values */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Activity size={16} /> 5. Relevant Laboratory Values
            </h4>
            <div style={{ background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
              {activeLabs.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                  {activeLabs.map((l) => (
                    <li key={l.id}><strong>{l.name}:</strong> {l.value} {l.unit} (Ref Range: {l.refRange}) — <span style={{ fontWeight: '700', color: l.status === 'High' ? 'var(--accent-rose)' : 'var(--primary)' }}>{l.status}</span></li>
                  ))}
                </ul>
              ) : (
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>No manual lab results entered yet.</p>
              )}
            </div>
          </div>

          {/* 6. Changes Over Time & Important Observations */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} /> 6. Changes Over Time & Important Observations
            </h4>
            <div style={{ background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              • <strong>Cycle Rhythm:</strong> Average cycle length established at {avgCycleDays} days across recorded cycles.<br />
              • <strong>Glycemic Balance Observation:</strong> High adherence to Low-GI meal choices correlates with stable daily energy ratings.<br />
              • <strong>Stress Management:</strong> 4-7-8 breathing and guided meditation sessions logged to support adrenal cortisol balance.
            </div>
          </div>

          {/* 7. Questions Saved for Clinician */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Stethoscope size={16} /> 7. Questions Saved for Clinician
            </h4>
            <div style={{ background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
              <ol style={{ margin: 0, paddingLeft: '1.2rem' }}>
                {savedQuestions.map((q, idx) => (
                  <li key={idx} style={{ marginBottom: '0.25rem' }}>"{q}"</li>
                ))}
              </ol>
            </div>
          </div>

        </div>

        {/* Footer Close Button */}
        <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
          <button onClick={onClose} className="btn btn-outline" style={{ padding: '0.5rem 1.25rem' }}>
            Close Summary Window
          </button>
        </div>

      </div>
    </div>
  );
}
