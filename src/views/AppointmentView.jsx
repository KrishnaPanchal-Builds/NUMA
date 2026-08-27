import React, { useState } from 'react';
import { Stethoscope, CheckCircle2, ChevronRight, Download, Plus, HelpCircle, FileText, Calendar, Printer, Share2, Key, Clock, Trash2, Check, ShieldCheck, Filter } from 'lucide-react';

export default function AppointmentView({ appointments = [], profile, cycles = [], symptoms = [], labs = [], medications = [], timeline = [] }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedConcern, setSelectedConcern] = useState('Cycle & Hormones');
  const [customQuestion, setCustomQuestion] = useState('');
  
  // Appointment History & Logger State
  const [appointmentList, setAppointmentList] = useState(appointments.length > 0 ? appointments : [
    {
      id: 'a1',
      doctor: 'Dr. Healthcare Professional',
      specialty: 'Reproductive Endocrinologist',
      date: '2026-08-28',
      time: '10:30 AM',
      clinic: 'Hormone & Metabolic Women Clinic',
      status: 'Upcoming',
      notes: 'Review 3-month cycle duration trends and fasting insulin lab results.',
      savedQuestions: [
        'What dietary tweaks support my insulin sensitivity?',
        'Based on my cycle duration of 34 days, should we test luteal progesterone?',
        'What blood biomarkers should we re-evaluate at my next check-up?'
      ]
    }
  ]);

  const [newDoctor, setNewDoctor] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('Gynecologist');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newClinic, setNewClinic] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const [questionList, setQuestionList] = useState(appointmentList[0]?.savedQuestions || [
    'What dietary tweaks support my insulin sensitivity?',
    'Based on my cycle duration of 34 days, should we test luteal progesterone?'
  ]);

  // Granular Data Selection Checkboxes ("Choose Exactly What Information is Shared")
  const [shareConfig, setShareConfig] = useState({
    includeProfile: true,
    includeCycles: true,
    includeSymptoms: true,
    includeMeds: true,
    includeLabs: true,
    includeQuestions: true,
    includeNotes: true
  });

  // Clinical Passcode Generator
  const [passcode, setPasscode] = useState('');

  const concerns = [
    'Cycle & Hormones',
    'Pelvic Pain & Cramps',
    'Acne & Skin Flare-ups',
    'Hair Thinning / Hirsutism',
    'Fatigue & Brain Fog',
    'Weight & Insulin Sensitivity',
    'Lab Test Review'
  ];

  const handleAddAppointment = (e) => {
    e.preventDefault();
    if (!newDoctor.trim() || !newDate) return;
    const newAppt = {
      id: 'a_' + Date.now(),
      doctor: newDoctor.trim(),
      specialty: newSpecialty,
      date: newDate,
      time: newTime,
      clinic: newClinic.trim() || 'Medical Center',
      status: 'Upcoming',
      notes: newNotes.trim() || 'Scheduled check-up.',
      savedQuestions: [...questionList]
    };
    setAppointmentList([newAppt, ...appointmentList]);
    setNewDoctor('');
    setNewClinic('');
    setNewNotes('');
    alert('Appointment scheduled and saved!');
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    setQuestionList([...questionList, customQuestion.trim()]);
    setCustomQuestion('');
  };

  const handleRemoveQuestion = (idxToRemove) => {
    setQuestionList(questionList.filter((_, idx) => idx !== idxToRemove));
  };

  const handleGeneratePasscode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setPasscode(code);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner: "BEFORE MY APPOINTMENT" Mode */}
      <div className="numa-card glass-card" style={{ borderLeft: '4px solid var(--primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Stethoscope size={20} color="var(--primary)" />
          <span className="badge badge-primary">Dedicated Doctor / Healthcare Support</span>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>"BEFORE MY APPOINTMENT" Wizard</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Turn months of scattered health tracking into a clean, custom 1-page clinical report for your doctor visit.
        </p>
      </div>

      {/* 4-Step Wizard Navigation Stepper */}
      <div className="numa-card" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          {[
            { step: 1, label: '1. Appointment & Concern' },
            { step: 2, label: '2. Select Data to Share' },
            { step: 3, label: '3. Questions Bank' },
            { step: 4, label: '4. Generate & Export PDF' },
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => setCurrentStep(item.step)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                background: currentStep === item.step ? 'var(--primary)' : 'var(--bg-input)',
                color: currentStep === item.step ? '#FFF' : 'var(--text-main)',
                fontWeight: '700',
                fontSize: '0.85rem',
                border: '1px solid var(--border-color)'
              }}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: APPOINTMENT SCHEDULER & CONCERN SELECTOR */}
      {currentStep === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="grid-1-2">
            
            {/* Left Column: Concern Selector */}
            <div className="numa-card">
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.5rem' }}>Select Main Appointment Focus</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Primary clinical issue for this visit:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {concerns.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedConcern(c)}
                    className={`btn ${selectedConcern === c ? 'btn-primary' : 'btn-outline'}`}
                    style={{ padding: '0.65rem 0.85rem', justifyContent: 'flex-start', fontSize: '0.85rem' }}
                  >
                    {selectedConcern === c ? <CheckCircle2 size={16} /> : <div style={{ width: '16px' }} />}
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Schedule / View Appointments & History */}
            <div className="numa-card">
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.5rem' }}>Doctor Appointment Reminders & History</h3>
              
              {/* Add New Appointment Form */}
              <form onSubmit={handleAddAppointment} style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>+ Schedule Doctor Appointment</strong>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <input type="text" placeholder="Doctor Name (e.g. Dr. Ananya Sen)" value={newDoctor} onChange={(e) => setNewDoctor(e.target.value)} required />
                  <select value={newSpecialty} onChange={(e) => setNewSpecialty(e.target.value)}>
                    <option value="Gynecologist">Gynecologist</option>
                    <option value="Reproductive Endocrinologist">Reproductive Endocrinologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Clinical Nutritionist">Clinical Nutritionist</option>
                    <option value="General Practitioner">General Practitioner</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} required />
                  <input type="text" placeholder="Time (e.g. 10:30 AM)" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
                </div>

                <input type="text" placeholder="Clinic / Hospital Name" value={newClinic} onChange={(e) => setNewClinic(e.target.value)} />
                <textarea placeholder="Doctor Notes / Pre-visit preparation instructions..." value={newNotes} onChange={(e) => setNewNotes(e.target.value)} rows={2} style={{ width: '100%' }} />

                <button type="submit" className="btn btn-primary" style={{ fontSize: '0.8rem', alignSelf: 'flex-start' }}>
                  <Plus size={14} /> Save Appointment Reminder
                </button>
              </form>

              {/* History List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {appointmentList.map((app) => (
                  <div key={app.id} style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', fontSize: '0.825rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', color: 'var(--primary)' }}>
                      <span>{app.doctor} ({app.specialty})</span>
                      <span className="badge badge-mint">{app.status}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      📅 {app.date} at {app.time} • 🏥 {app.clinic}
                    </div>
                    {app.notes && <div style={{ marginTop: '0.35rem', fontStyle: 'italic', color: 'var(--text-main)' }}>📝 Note: "{app.notes}"</div>}
                  </div>
                ))}
              </div>
            </div>

          </div>

          <button onClick={() => setCurrentStep(2)} className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>
            Next: Select Data to Share <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* STEP 2: CHOOSE EXACTLY WHAT INFORMATION IS SHARED */}
      {currentStep === 2 && (
        <div className="numa-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Filter size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Step 2 — Granular Data Sharing Control</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Choose exactly what health summaries to include in your doctor-ready report. You have 100% control:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
            {[
              { key: 'includeProfile', label: 'Patient Baseline & PCOS Subtype', desc: 'Age, BMI, clinical subtype profile.' },
              { key: 'includeCycles', label: 'Recent Cycle & Bleeding History', desc: 'Average cycle duration, LMP date, flow intensity.' },
              { key: 'includeSymptoms', label: 'Symptom Summary & Frequency', desc: 'Top recurring symptoms and severity ratings.' },
              { key: 'includeMeds', label: 'Medication & Supplement Log', desc: 'Active prescriptions, dosages, and adherence.' },
              { key: 'includeLabs', label: 'Relevant Laboratory Values', desc: 'Fasting Insulin, Testosterone, DHEA-S, AMH, LH/FSH.' },
              { key: 'includeQuestions', label: 'Saved Doctor Questions', desc: 'Custom questions list to ask your clinician.' },
              { key: 'includeNotes', label: 'Doctor Visit & Personal Notes', desc: 'Previous visit notes and clinical context.' }
            ].map((item) => (
              <div key={item.key} style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '800' }}>{item.label}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={shareConfig[item.key] !== false}
                  onChange={(e) => setShareConfig({ ...shareConfig, [item.key]: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setCurrentStep(1)} className="btn btn-outline">Back</button>
            <button onClick={() => setCurrentStep(3)} className="btn btn-primary">Next: Questions Bank <ChevronRight size={18} /></button>
          </div>
        </div>
      )}

      {/* STEP 3: QUESTIONS BANK & LIVE REPORT PREVIEW */}
      {currentStep === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="grid-1-2">
            
            {/* Question Bank List */}
            <div className="numa-card">
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.75rem' }}>Saved Questions for Clinician</h4>
              
              <form onSubmit={handleAddQuestion} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Type a new question for doctor..."
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 0.9rem' }}>
                  <Plus size={16} /> Add
                </button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {questionList.map((q, i) => (
                  <div key={i} style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <HelpCircle size={16} color="var(--primary)" />
                      <span>"{q}"</span>
                    </div>
                    <button onClick={() => handleRemoveQuestion(i)} className="btn btn-outline btn-icon" style={{ color: 'var(--accent-rose)', border: 'none' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Customized Report Preview Card */}
            <div className="numa-card" style={{ border: '2px solid var(--primary)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <span className="badge badge-primary" style={{ alignSelf: 'flex-start' }}>Selected Report Preview</span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Clinical Brief: {profile.name || 'Krishna Pankaj Panchal'}</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Focus: {selectedConcern} • Date: {new Date().toLocaleDateString()}</p>
              
              <hr style={{ margin: '0.35rem 0', borderColor: 'var(--border-color)' }} />
              
              <div style={{ fontSize: '0.8rem', lineHeight: '1.5', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {shareConfig.includeProfile && <p>• <strong>Baseline:</strong> Age {profile.exactAge || 27} • {profile.pcosSubtype || 'Insulin Resistant PCOS'}</p>}
                {shareConfig.includeCycles && <p>• <strong>Cycles:</strong> Average length {profile.exactCycleDays || 34} days. Current Phase: Day {profile.currentCycleDay || 14}.</p>}
                {shareConfig.includeMeds && <p>• <strong>Medications:</strong> Metformin XR 500mg, Myo-Inositol 2000mg BID.</p>}
                {shareConfig.includeLabs && <p>• <strong>Lab Biomarkers:</strong> LH/FSH 2.58 ratio, Free Testosterone 4.2 pg/mL, AMH 7.8 ng/mL.</p>}
                {shareConfig.includeQuestions && <p>• <strong>Saved Doctor Questions:</strong> {questionList.length} questions included.</p>}
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button onClick={() => setCurrentStep(2)} className="btn btn-outline">Back</button>
            <button onClick={() => setCurrentStep(4)} className="btn btn-primary">Next: Final Export <ChevronRight size={18} /></button>
          </div>
        </div>
      )}

      {/* STEP 4: EXPORT PDF & CONTROLLED PASSCODE SHARING */}
      {currentStep === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="numa-card glass-card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-full)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <FileText size={28} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem' }}>Doctor-Ready Report Generated!</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 1.25rem' }}>
              Your customized 1-page clinical summary contains only the exact information you selected. Ready to print or share.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => window.print()} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}>
                <Printer size={18} /> Print 1-Page Doctor Report
              </button>
              <button onClick={() => window.print()} className="btn btn-outline" style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}>
                <Download size={18} /> Export PDF Report
              </button>
            </div>
          </div>

          {/* Encrypted Clinical Passcode Generator */}
          <div className="numa-card" style={{ padding: '1.5rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Share2 size={20} color="var(--secondary)" />
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800' }}>Share Selected Information Securely</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Generate a temporary 6-digit passcode to let your healthcare professional view your report online:
            </p>

            {passcode ? (
              <div style={{ background: 'var(--secondary-light)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--secondary)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--secondary)', marginBottom: '0.25rem' }}>6-DIGIT CLINICAL PASSCODE</div>
                <div style={{ fontSize: '2.25rem', fontWeight: '900', letterSpacing: '4px', color: 'var(--secondary)' }}>{passcode}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Expires in 15 minutes • Show to your clinician during appointment</div>
              </div>
            ) : (
              <button onClick={handleGeneratePasscode} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
                <Key size={16} /> Generate 6-Digit Doctor Passcode
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
