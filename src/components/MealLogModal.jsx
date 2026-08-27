import React, { useState } from 'react';
import { X, Utensils, Sparkles, Check, Camera } from 'lucide-react';

export default function MealLogModal({ isOpen, onClose, onAddMeal }) {
  if (!isOpen) return null;

  const [mealType, setMealType] = useState('Lunch');
  const [mealTime, setMealTime] = useState('01:15 PM');
  const [mealDescription, setMealDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalyzeAndSave = (e) => {
    e.preventDefault();
    if (!mealDescription.trim()) return;

    // Simulate AI PCOS Meal Analysis
    const isProteinPaired = mealDescription.toLowerCase().includes('egg') || 
                            mealDescription.toLowerCase().includes('chickpea') || 
                            mealDescription.toLowerCase().includes('paneer') || 
                            mealDescription.toLowerCase().includes('chicken') || 
                            mealDescription.toLowerCase().includes('tofu') ||
                            mealDescription.toLowerCase().includes('lentils');

    const analysis = {
      pcosRating: isProteinPaired ? 'Excellent Low-GI' : 'Moderate Glycemic Load',
      glycemicIndex: isProteinPaired ? 'Low (Target Achieved)' : 'Medium',
      advice: isProteinPaired 
        ? 'Great choice! High protein and healthy fat balance helps prevent post-prandial insulin surges.'
        : 'Consider pairing complex carbs with a quality protein (e.g. eggs, seeds, or legumes) to smooth glucose curves.'
    };

    setAnalysisResult(analysis);
    
    setTimeout(() => {
      onAddMeal({
        id: 'm_' + Date.now(),
        type: mealType,
        time: mealTime,
        description: mealDescription,
        analysis
      });
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <span className="badge badge-mint">AI Nutrition Layer</span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Log Meal & PCOS Analysis</h2>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-icon">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleAnalyzeAndSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Meal Type</label>
              <select value={mealType} onChange={(e) => setMealType(e.target.value)} style={{ width: '100%' }}>
                {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Time</label>
              <input type="text" value={mealTime} onChange={(e) => setMealTime(e.target.value)} style={{ width: '100%' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>
              Describe Meal or Upload Photo
            </label>
            <textarea
              rows="3"
              placeholder="e.g. Quinoa salad with avocado, roasted chickpeas, cucumber, seeds, and lemon dressing..."
              value={mealDescription}
              onChange={(e) => setMealDescription(e.target.value)}
              required
              style={{ width: '100%', resize: 'none' }}
            />
          </div>

          {/* Photo upload mock button */}
          <button type="button" className="btn btn-outline" style={{ width: '100%', fontSize: '0.85rem', gap: '0.5rem' }}>
            <Camera size={16} /> Upload Meal Photo (AI Recognition Preview)
          </button>

          {/* AI Feedback Box */}
          {analysisResult && (
            <div style={{ background: 'var(--primary-light)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary)', animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                <Sparkles size={16} color="var(--primary)" />
                <strong style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>NUMA AI Meal Feedback: {analysisResult.pcosRating}</strong>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                {analysisResult.advice}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              <Check size={16} /> Analyze & Log Meal
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
