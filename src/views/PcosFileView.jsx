import React, { useState } from 'react';
import { FileText, Plus, Upload, Eye, Download, Trash2, Edit2, ShieldCheck, AlertCircle, Folder, Check, Sparkles, Activity, FileSpreadsheet, Search, Calendar, Moon, Brain, Pill, Stethoscope, Utensils, TrendingUp, HelpCircle, FileCheck, User } from 'lucide-react';
import QuickChips from '../components/QuickChips';

export default function PcosFileView({ labs = [], documents = [], profile, cycles = [], symptoms = [], timeline = [], medications = [], meals = [], hydration = {}, appointments = [], onAddLabResult, onUpdateLabs, onUpdateDocuments }) {
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'labs' | 'documents' | 'cycles' | 'symptoms' | 'meds' | 'lifestyle' | 'appointments'
  const [showAddLabModal, setShowAddLabModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [folderFilter, setFolderFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for Manual Lab Entry
  const [labForm, setLabForm] = useState({
    name: 'Fasting Insulin',
    value: '',
    unit: 'uIU/mL',
    date: new Date().toISOString().split('T')[0],
    facility: '',
    refRange: '2.0 - 10.0 uIU/mL',
    status: 'Normal',
    notes: ''
  });

  // Form State for Medical Document Upload
  const [docForm, setDocForm] = useState({
    title: '',
    category: 'Bloodwork',
    doctor: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    fileName: ''
  });

  const [isOcrProcessing, setIsOcrProcessing] = useState(false);

  // Common PCOS Biomarkers presets
  const biomarkerOptions = [
    { name: 'Fasting Insulin', defaultUnit: 'uIU/mL', defaultRange: '2.0 - 10.0 uIU/mL' },
    { name: 'Fasting Blood Glucose', defaultUnit: 'mg/dL', defaultRange: '70 - 99 mg/dL' },
    { name: 'Total Testosterone', defaultUnit: 'ng/dL', defaultRange: '15 - 45 ng/dL' },
    { name: 'Free Testosterone', defaultUnit: 'pg/mL', defaultRange: '0.1 - 6.4 pg/mL' },
    { name: 'DHEA-Sulfate (DHEA-S)', defaultUnit: 'mcg/dL', defaultRange: '35 - 430 mcg/dL' },
    { name: 'AMH (Anti-Müllerian Hormone)', defaultUnit: 'ng/mL', defaultRange: '1.0 - 4.0 ng/mL' },
    { name: 'LH (Luteinizing Hormone)', defaultUnit: 'mIU/mL', defaultRange: '2.0 - 10.0 mIU/mL' },
    { name: 'FSH (Follicle-Stimulating)', defaultUnit: 'mIU/mL', defaultRange: '3.5 - 12.5 mIU/mL' },
    { name: 'TSH (Thyroid Stimulating)', defaultUnit: 'uIU/mL', defaultRange: '0.45 - 4.5 uIU/mL' },
    { name: '25-OH Vitamin D3', defaultUnit: 'ng/mL', defaultRange: '30 - 100 ng/mL' }
  ];

  const handleBiomarkerChange = (bName) => {
    const matched = biomarkerOptions.find((b) => b.name === bName);
    setLabForm({
      ...labForm,
      name: bName,
      unit: matched ? matched.defaultUnit : labForm.unit,
      refRange: matched ? matched.defaultRange : labForm.refRange
    });
  };

  // Save Manual Lab Entry
  const handleSaveLab = (e) => {
    e.preventDefault();
    if (!labForm.value.trim()) return;

    const newLabEntry = {
      id: 'lab_' + Date.now(),
      ...labForm,
      valueNum: parseFloat(labForm.value)
    };

    if (onAddLabResult) {
      onAddLabResult(newLabEntry);
    }
    setShowAddLabModal(false);
    setLabForm({
      name: 'Fasting Insulin',
      value: '',
      unit: 'uIU/mL',
      date: new Date().toISOString().split('T')[0],
      facility: '',
      refRange: '2.0 - 10.0 uIU/mL',
      status: 'Normal',
      notes: ''
    });
  };

  // Delete Lab Result
  const handleDeleteLab = (labId) => {
    if (onUpdateLabs) {
      onUpdateLabs(labs.filter((l) => l.id !== labId));
    }
  };

  // Handle Document Upload & Simulated OCR Extraction
  const handleFileUploadSimulated = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setDocForm((prev) => ({ ...prev, fileName: file.name, title: file.name.replace(/\.[^/.]+$/, "") }));
    setIsOcrProcessing(true);

    setTimeout(() => {
      setIsOcrProcessing(false);
      setDocForm((prev) => ({
        ...prev,
        notes: `Simulated OCR Extracted Text: Report scanned from ${file.name}. Biomarkers verified.`
      }));
    }, 1200);
  };

  const handleSaveDocument = (e) => {
    e.preventDefault();
    if (!docForm.title.trim()) return;

    const newDoc = {
      id: 'doc_' + Date.now(),
      ...docForm,
      fileType: docForm.fileName.endsWith('.pdf') ? 'PDF' : 'IMAGE',
      size: '1.4 MB'
    };

    if (onUpdateDocuments) {
      onUpdateDocuments([newDoc, ...documents]);
    }
    setShowUploadModal(false);
    setDocForm({
      title: '',
      category: 'Bloodwork',
      doctor: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      fileName: ''
    });
  };

  // Delete Document
  const handleDeleteDocument = (docId) => {
    if (onUpdateDocuments) {
      onUpdateDocuments(documents.filter((d) => d.id !== docId));
    }
  };

  // Filter Documents by Category Folder
  const filteredDocs = documents.filter((d) => {
    const matchesCategory = folderFilter === 'all' || d.category.toLowerCase() === folderFilter.toLowerCase();
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.doctor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeMeds = Array.isArray(medications) ? medications : [];
  const activeTimeline = Array.isArray(timeline) ? timeline : [];
  const activeCycles = Array.isArray(cycles) ? cycles : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Banner */}
      <div className="numa-card glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow)' }}>
            <FileText size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>MY PCOS FILE — Master Personal Health Record</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Continuously updated record of cycles, symptoms, labs, documents, medications, appointments & changes over time.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setShowAddLabModal(true)} className="btn btn-primary" style={{ padding: '0.5rem 0.9rem', fontSize: '0.825rem' }}>
            <Plus size={16} /> + Add Lab Result
          </button>

          <button onClick={() => setShowUploadModal(true)} className="btn btn-secondary" style={{ padding: '0.5rem 0.9rem', fontSize: '0.825rem' }}>
            <Upload size={16} /> Upload Report (PDF/Image)
          </button>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.775rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ShieldCheck size={16} color="var(--primary)" />
        MY PCOS FILE organizes and summarizes all 13 health domains. It does not replace a doctor or independently diagnose medical conditions.
      </div>

      {/* Main Health Record Category Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', overflowX: 'auto' }}>
        <button onClick={() => setActiveTab('summary')} className={`btn ${activeTab === 'summary' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
          <Sparkles size={14} /> Master Health Summary
        </button>
        <button onClick={() => setActiveTab('cycles')} className={`btn ${activeTab === 'cycles' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
          <Calendar size={14} /> Cycles & Bleeding ({activeCycles.length})
        </button>
        <button onClick={() => setActiveTab('symptoms')} className={`btn ${activeTab === 'symptoms' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
          <Activity size={14} /> Symptom Timeline ({activeTimeline.length})
        </button>
        <button onClick={() => setActiveTab('labs')} className={`btn ${activeTab === 'labs' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
          <Activity size={14} /> Labs & Biomarkers ({labs.length})
        </button>
        <button onClick={() => setActiveTab('documents')} className={`btn ${activeTab === 'documents' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
          <Folder size={14} /> Documents Vault ({documents.length})
        </button>
        <button onClick={() => setActiveTab('meds')} className={`btn ${activeTab === 'meds' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
          <Pill size={14} /> Meds & Supplements ({activeMeds.length})
        </button>
        <button onClick={() => setActiveTab('appointments')} className={`btn ${activeTab === 'appointments' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
          <Stethoscope size={14} /> Appointments & Questions ({appointments.length})
        </button>
      </div>

      {/* TAB 1: MASTER HEALTH SUMMARY BRIEF */}
      {activeTab === 'summary' && (
        <div className="numa-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>MY PCOS FILE — Clinical Summary Brief</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Aggregated personal record across all 13 health domains for provider review.</p>
            </div>
            <button onClick={() => window.print()} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>
              🖨️ Export PDF / Print File
            </button>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
            
            {/* Patient Profile Header */}
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.35rem' }}>Patient Demographics & Clinical Baseline</h4>
              <p style={{ margin: 0 }}>
                <strong>Name:</strong> {profile.name || 'Krishna Pankaj Panchal'} • <strong>Age:</strong> {profile.exactAge || 27} • <strong>BMI:</strong> {profile.bmi || 22.8} kg/m² ({profile.heightCm || 165}cm / {profile.weightKg || 62}kg)
              </p>
              <p style={{ margin: '0.2rem 0 0 0' }}>
                <strong>PCOS Status:</strong> {profile.diagnosisStatus || 'Confirmed PCOS'} • <strong>Subtype:</strong> {profile.pcosSubtype || 'Insulin Resistant PCOS'}
              </p>
            </div>

            {/* Cycle & Bleeding History */}
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '0.35rem' }}>1. Cycle & Bleeding History</h4>
              <p style={{ margin: 0 }}>
                <strong>Current Phase:</strong> Day {profile.currentCycleDay || 14} ({profile.currentPhase || 'Follicular Phase'}) • <strong>Average Cycle Duration:</strong> {profile.exactCycleDays || 34} days ({activeCycles.length} cycles logged)
              </p>
            </div>

            {/* Active Meds & Supplements */}
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.35rem' }}>2. Active Prescriptions & Supplements</h4>
              <p style={{ margin: 0 }}>
                {activeMeds.length > 0 ? activeMeds.map((m) => `${m.name} (${m.dosage}, ${m.frequency})`).join(' • ') : 'No active medications currently logged.'}
              </p>
            </div>

            {/* Biomarkers */}
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '0.35rem' }}>3. Laboratory Biomarkers</h4>
              <p style={{ margin: 0 }}>
                {labs.length > 0 ? labs.map((l) => `${l.name}: ${l.value} ${l.unit} (Ref: ${l.refRange})`).join(' • ') : 'No manual lab results entered yet.'}
              </p>
            </div>

            {/* Medical Documents */}
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.35rem' }}>4. Medical Document Vault</h4>
              <p style={{ margin: 0 }}>
                {documents.length > 0 ? documents.map((d) => `${d.title} (${d.category}, ${d.date})`).join(' • ') : 'No medical documents stored in vault yet.'}
              </p>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: CYCLES & BLEEDING */}
      {activeTab === 'cycles' && (
        <div className="numa-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '1rem' }}>Cycle & Bleeding History Log</h3>
          {activeCycles.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activeCycles.map((c) => (
                <div key={c.id} style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>Period Start: {c.startDate} • Cycle Length: {c.length} Days</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Flow: {c.flow || 'Normal'} • Cramps Severity: {c.crampsSeverity}/5</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No cycles logged yet. Use Track & Calendar to mark your periods.</p>
          )}
        </div>
      )}

      {/* TAB 3: SYMPTOMS TIMELINE */}
      {activeTab === 'symptoms' && (
        <div className="numa-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '1rem' }}>Symptom & Event History ({activeTimeline.length})</h3>
          {activeTimeline.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activeTimeline.map((item) => (
                <div key={item.id} style={{ background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{item.date} {item.time ? `• ${item.time}` : ''}: {item.symptom}</div>
                  {item.notes && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>"{item.notes}"</div>}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No symptom events logged yet.</p>
          )}
        </div>
      )}

      {/* TAB 4: LABORATORY TRACKING & REFERENCE RANGES */}
      {activeTab === 'labs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {labs.length > 0 ? (
            <div className="grid-1-2">
              {labs.map((lab) => (
                <div key={lab.id} className="numa-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>📅 {lab.date}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className={`badge ${lab.status === 'High' || lab.status === 'Elevated' ? 'badge-danger' : lab.status === 'Low' ? 'badge-amber' : 'badge-mint'}`}>
                          {lab.status || 'Recorded'}
                        </span>
                        {onUpdateLabs && (
                          <button onClick={() => handleDeleteLab(lab.id)} className="btn btn-outline btn-icon" style={{ width: '26px', height: '26px', padding: 0, color: 'var(--danger)' }} title="Delete Lab Result">
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.2rem' }}>{lab.name}</h3>
                    <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '0.4rem' }}>
                      {lab.value} <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>{lab.unit}</span>
                    </div>

                    <div style={{ background: 'var(--bg-input)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                      📊 Reference Range: <strong>{lab.refRange}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="numa-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <Activity size={32} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>No Laboratory Results Logged</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click "+ Add Lab Result" above to add your actual bloodwork.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: MEDICAL DOCUMENTS & VAULT */}
      {activeTab === 'documents' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {['all', 'Bloodwork', 'Ultrasound', 'Prescription', 'Clinical Brief'].map((folder) => (
                <button key={folder} onClick={() => setFolderFilter(folder)} className={`btn ${folderFilter === folder ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
                  <Folder size={13} /> {folder === 'all' ? 'All Folders' : folder}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" placeholder="Search reports..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', paddingLeft: '2.1rem', fontSize: '0.8rem' }} />
            </div>
          </div>

          {filteredDocs.length > 0 ? (
            <div className="grid-1-2">
              {filteredDocs.map((doc) => (
                <div key={doc.id} className="numa-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div>
                    <span className="badge badge-mint" style={{ fontSize: '0.7rem', marginBottom: '0.3rem' }}>📁 {doc.category}</span>
                    <h4 style={{ fontSize: '1rem', fontWeight: '800' }}>{doc.title}</h4>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date: {doc.date}</div>
                  </div>
                  <button onClick={() => setPreviewDoc(doc)} className="btn btn-outline btn-icon"><Eye size={15} /></button>
                </div>
              ))}
            </div>
          ) : (
            <div className="numa-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <Folder size={32} color="var(--secondary)" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>No Medical Documents Uploaded</h3>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: MEDS & SUPPLS */}
      {activeTab === 'meds' && (
        <div className="numa-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '1rem' }}>Active Prescriptions & Supplements ({activeMeds.length})</h3>
          {activeMeds.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activeMeds.map((m) => (
                <div key={m.id} style={{ background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: '800' }}>{m.name} ({m.dosage})</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Frequency: {m.frequency}</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No medications currently logged.</p>
          )}
        </div>
      )}

      {/* TAB 7: APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <div className="numa-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '1rem' }}>Doctor Appointment History & Saved Questions</h3>
          {appointments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {appointments.map((a) => (
                <div key={a.id} style={{ background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: '800' }}>{a.doctor} ({a.specialty})</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date: {a.date} • Clinic: {a.clinic}</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No appointments scheduled yet.</p>
          )}
        </div>
      )}

      {/* MODAL 1: ADD MANUAL LAB RESULT */}
      {showAddLabModal && (
        <div className="modal-overlay" onClick={() => setShowAddLabModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem', maxWidth: '540px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Add Manual Laboratory Result</h3>
              <button onClick={() => setShowAddLabModal(false)} className="btn btn-outline btn-icon"><X size={18} /></button>
            </div>

            <form onSubmit={handleSaveLab} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Select Biomarker</label>
                <select value={labForm.name} onChange={(e) => handleBiomarkerChange(e.target.value)} style={{ width: '100%' }}>
                  {biomarkerOptions.map((b) => <option key={b.name} value={b.name}>{b.name}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Result Value</label>
                  <input type="number" step="0.01" placeholder="e.g. 18.5" value={labForm.value} onChange={(e) => setLabForm({ ...labForm, value: e.target.value })} required style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Measurement Unit</label>
                  <input type="text" value={labForm.unit} onChange={(e) => setLabForm({ ...labForm, unit: e.target.value })} style={{ width: '100%' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddLabModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}><Check size={16} /> Save Result</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: UPLOAD REPORT */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem', maxWidth: '540px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Upload Medical Report</h3>
              <button onClick={() => setShowUploadModal(false)} className="btn btn-outline btn-icon"><X size={18} /></button>
            </div>

            <form onSubmit={handleSaveDocument} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div style={{ border: '2px dashed var(--secondary)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                <Upload size={32} color="var(--secondary)" style={{ marginBottom: '0.5rem' }} />
                <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileUploadSimulated} required style={{ display: 'block', margin: '0 auto' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Document Title</label>
                <input type="text" placeholder="e.g. Bloodwork August 2026" value={docForm.title} onChange={(e) => setDocForm({ ...docForm, title: e.target.value })} required style={{ width: '100%' }} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowUploadModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-secondary" style={{ flex: 1 }}><Check size={16} /> Save to Vault</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div className="modal-overlay" onClick={() => setPreviewDoc(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem', maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Preview: {previewDoc.title}</h3>
              <button onClick={() => setPreviewDoc(null)} className="btn btn-outline btn-icon"><X size={18} /></button>
            </div>
            <div style={{ background: 'var(--bg-input)', padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', marginBottom: '1.25rem' }}>
              <FileSpreadsheet size={48} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800' }}>{previewDoc.title} ({previewDoc.fileType})</h4>
            </div>
            <button onClick={() => setPreviewDoc(null)} className="btn btn-outline" style={{ width: '100%' }}>Close Preview</button>
          </div>
        </div>
      )}

    </div>
  );
}
