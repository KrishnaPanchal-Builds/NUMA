// Aggregates all 14 NUMA health data domains into a single unified chronological array

export function aggregatePersonalTimeline({
  timeline = [],
  cycles = [],
  medications = [],
  labs = [],
  documents = [],
  appointments = []
}) {
  const aggregated = [];

  // 1. Direct Timeline Entries (Symptoms, Meals, Exercise, Sleep, Mood, Notes)
  (Array.isArray(timeline) ? timeline : []).forEach((item) => {
    let category = 'symptoms';
    const symLower = (item.symptom || '').toLowerCase();
    
    if (symLower.includes('meal')) category = 'nutrition';
    else if (symLower.includes('metabolic') || symLower.includes('exercise') || symLower.includes('workout')) category = 'exercise';
    else if (symLower.includes('sleep') || symLower.includes('wake')) category = 'sleep';
    else if (symLower.includes('mood') || symLower.includes('stress') || symLower.includes('meditation') || symLower.includes('calm')) category = 'mood';
    else if (symLower.includes('period') || symLower.includes('bleeding')) category = 'period';
    else if (symLower.includes('meds') || symLower.includes('dose')) category = 'meds';

    aggregated.push({
      id: item.id || `tl_${Math.random()}`,
      source: 'timeline',
      date: item.date || new Date().toISOString().split('T')[0],
      time: item.time || '12:00 PM',
      title: item.symptom || 'Logged Event',
      category: category,
      severity: item.severity || 1,
      painLevel: item.painLevel || 0,
      bleedingLevel: item.bleedingLevel || 'None',
      notes: item.notes || '',
      raw: item
    });
  });

  // 2. Period & Cycle Events (from cycles)
  (Array.isArray(cycles) ? cycles : []).forEach((c) => {
    aggregated.push({
      id: `cycle_${c.id || c.startDate}`,
      source: 'cycles',
      date: c.startDate,
      time: '08:00 AM',
      title: `Menstrual Period Log (${c.flow || 'Medium'} Flow)`,
      category: 'period',
      severity: c.crampsSeverity || 3,
      painLevel: c.crampsSeverity || 3,
      bleedingLevel: c.flow || 'Medium',
      notes: `Cycle Length: ${c.length || 28} days • ${c.notes || 'Period logged'}`,
      raw: c
    });
  });

  // 3. Medications & Supplements History (from medications)
  (Array.isArray(medications) ? medications : []).forEach((m) => {
    (m.history || []).forEach((h, idx) => {
      aggregated.push({
        id: `med_hist_${m.id}_${h.date}_${idx}`,
        source: 'medications',
        date: h.date,
        time: h.time || '08:00 AM',
        title: `${m.name} (${h.status === 'taken' ? '✓ Taken' : '✗ Missed'})`,
        category: 'meds',
        severity: 1,
        notes: `Dosage: ${m.dosage} • Category: ${m.category === 'prescription' ? 'Prescription' : 'Supplement'}`,
        raw: { ...m, historyEntry: h }
      });
    });
  });

  // 4. Laboratory Results (from labs)
  (Array.isArray(labs) ? labs : []).forEach((l) => {
    aggregated.push({
      id: l.id || `lab_${Math.random()}`,
      source: 'labs',
      date: l.date,
      time: '09:00 AM',
      title: `Lab Test: ${l.name} (${l.value} ${l.unit})`,
      category: 'labs',
      severity: l.status === 'Elevated' || l.status === 'High' ? 4 : 1,
      notes: `Ref Range: ${l.refRange || 'N/A'} • Status: ${l.status || 'Normal'} • Facility: ${l.facility || 'Lab'}`,
      raw: l
    });
  });

  // 5. Medical Documents & Reports (from documents)
  (Array.isArray(documents) ? documents : []).forEach((d) => {
    aggregated.push({
      id: d.id || `doc_${Math.random()}`,
      source: 'documents',
      date: d.date,
      time: '10:00 AM',
      title: `Document Uploaded: ${d.title}`,
      category: 'documents',
      severity: 1,
      notes: `Folder: ${d.category} • Provider: ${d.doctor || 'N/A'} • File: ${d.fileName || d.fileType}`,
      raw: d
    });
  });

  // 6. Doctor Appointments (from appointments)
  (Array.isArray(appointments) ? appointments : []).forEach((a) => {
    if (a.date && a.date !== 'Not scheduled') {
      aggregated.push({
        id: a.id || `app_${Math.random()}`,
        source: 'appointments',
        date: a.date,
        time: a.time || '10:00 AM',
        title: `Doctor Appointment: ${a.doctor} (${a.specialty})`,
        category: 'appointments',
        severity: 1,
        notes: `Status: ${a.status} • Clinic: ${a.clinic}`,
        raw: a
      });
    }
  });

  // Sort descending by date & time
  return aggregated.sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time || '12:00 PM'}`);
    const dateB = new Date(`${b.date} ${b.time || '12:00 PM'}`);
    return dateB - dateA;
  });
}
