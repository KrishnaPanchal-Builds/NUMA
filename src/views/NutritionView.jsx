import React, { useState } from 'react';
import { Utensils, Camera, Droplets, Sparkles, Plus, Edit2, Trash2, ShieldCheck, Check, Clock, ChevronRight, BookOpen, AlertCircle, PieChart, Award, Zap } from 'lucide-react';

export default function NutritionView({ meals = [], hydration = { date: new Date().toISOString().split('T')[0], amountMl: 0, targetMl: 2500 }, timeline = [], onAddMeal, onUpdateMeals, onUpdateHydration, onAddTimelineEntry }) {
  
  // Meal Entry Form Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);

  // Form Fields
  const [mealType, setMealType] = useState('Breakfast');
  const [mealName, setMealName] = useState('');
  const [mealTime, setMealTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [mealDate, setMealDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealNotes, setMealNotes] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isScanningImage, setIsScanningImage] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);

  // Recipe Modal State
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // PCOS Recipe Library
  const pcosRecipes = [
    {
      id: 'r_1',
      title: 'Wild Salmon & Quinoa Grain Bowl',
      phase: 'Follicular & Ovulatory Phase',
      prepTime: '20 mins',
      giRating: 'Low GI',
      pcosRating: 'Blood-Sugar & Anti-Inflammatory',
      macros: 'Protein: 32g • Carbs: 28g • Fiber: 8g • Fat: 14g',
      ingredients: ['150g Wild Salmon fillet', '1/2 cup Cooked Quinoa', '1 cup Fresh Spinach & Cucumber', '1 tbsp Extra Virgin Olive Oil & Lemon dressing', '1 tbsp Pumpkin & Flax Seeds'],
      instructions: 'Pan-sear salmon in olive oil for 4 mins per side. Layer quinoa, fresh spinach, and cucumber in a bowl. Top with salmon, seeds, and lemon dressing.',
      benefits: 'Rich in Omega-3 fatty acids and zinc to lower systemic inflammation and support follicle development.'
    },
    {
      id: 'r_2',
      title: 'Avocado, Chickpea & Egg Salad',
      phase: 'Luteal & Menstrual Phase',
      prepTime: '12 mins',
      giRating: 'Low GI',
      pcosRating: 'Progesterone & Mood Support',
      macros: 'Protein: 22g • Carbs: 24g • Fiber: 9g • Fat: 16g',
      ingredients: ['2 Hard-boiled Eggs', '1/2 cup Organic Chickpeas', '1/2 Ripe Avocado', '1 cup Chopped Kale & Cherry Tomatoes', '1 tbsp Sesame Seeds'],
      instructions: 'Chop hard-boiled eggs and avocado. Toss with rinsed chickpeas, kale, tomatoes, and sesame seeds. Drizzle with olive oil.',
      benefits: 'Provides Vitamin B6 and Magnesium to synthesize progesterone and reduce luteal phase cramps.'
    },
    {
      id: 'r_3',
      title: 'Berry & Inositol Chia Seed Pudding',
      phase: 'All Cycle Phases',
      prepTime: '5 mins (Overnight)',
      giRating: 'Low GI',
      pcosRating: 'Insulin Sensitizing',
      macros: 'Protein: 14g • Carbs: 18g • Fiber: 12g • Fat: 10g',
      ingredients: ['3 tbsp Chia seeds', '1 cup Unsweetened Almond Milk', '1 scoop Myo-Inositol powder', '1/2 cup Fresh Organic Raspberries', '1 tbsp Almond Butter'],
      instructions: 'Mix chia seeds, almond milk, and Myo-Inositol powder in a jar. Chill overnight. Top with fresh berries and almond butter before serving.',
      benefits: 'High soluble fiber and Inositol slow gastric emptying, stabilizing post-meal blood glucose.'
    }
  ];

  // Handle Image Upload & Simulated AI Food Recognition
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setIsScanningImage(true);
        
        // Simulate AI Recognition Scan
        setTimeout(() => {
          setIsScanningImage(false);
          setAiAnalysisResult({
            foodName: 'Scrambled Eggs, Avocado & Whole Grain Toast',
            giRating: 'Low GI',
            pcosRating: 'Blood-Sugar Friendly',
            macros: { carbs: 22, protein: 24, fiber: 7, fats: 14 },
            educationalTip: 'Great protein-fiber pairing! Keeping carbs under 30g prevents insulin spikes.'
          });
          setMealName('Scrambled Eggs, Avocado & Whole Grain Toast');
        }, 1200);
      };
      reader.readAsDataURL(file);
    }
  };

  // Analyze Food Text for AI Nutrition Score
  const computeAiNutrition = (name) => {
    const n = name.toLowerCase();
    let giRating = 'Low GI';
    let pcosRating = 'Blood-Sugar Friendly';
    let carbs = 25, protein = 20, fiber = 6, fats = 12;

    if (n.includes('sugar') || n.includes('cake') || n.includes('candy') || n.includes('soda') || n.includes('white bread') || n.includes('pizza') || n.includes('fries')) {
      giRating = 'High GI';
      pcosRating = 'High Refined Carbs';
      carbs = 65; protein = 8; fiber = 1; fats = 22;
    } else if (n.includes('rice') || n.includes('pasta') || n.includes('burger') || n.includes('sandwich') || n.includes('oats')) {
      giRating = 'Medium GI';
      pcosRating = 'Moderate Glycemic';
      carbs = 45; protein = 16; fiber = 4; fats = 10;
    } else if (n.includes('salad') || n.includes('salmon') || n.includes('chicken') || n.includes('eggs') || n.includes('avocado') || n.includes('chia') || n.includes('tofu')) {
      giRating = 'Low GI';
      pcosRating = 'Blood-Sugar & Anti-Inflammatory';
      carbs = 18; protein = 28; fiber = 8; fats = 14;
    }

    return { giRating, pcosRating, macros: { carbs, protein, fiber, fats } };
  };

  // Save New or Edited Meal Entry
  const handleSaveMealForm = (e) => {
    e.preventDefault();
    if (!mealName.trim()) return;

    const analysis = aiAnalysisResult || computeAiNutrition(mealName);

    const mealEntry = {
      id: editingMeal ? editingMeal.id : 'meal_' + Date.now(),
      type: mealType,
      name: mealName.trim(),
      date: mealDate,
      time: mealTime,
      notes: mealNotes,
      imageUrl: imagePreview,
      analysis: analysis
    };

    if (editingMeal) {
      onUpdateMeals(meals.map((m) => m.id === editingMeal.id ? mealEntry : m));
    } else {
      onUpdateMeals([mealEntry, ...meals]);
      
      // Also record in central 24-hr timeline
      if (onAddTimelineEntry) {
        onAddTimelineEntry({
          id: 't_meal_' + Date.now(),
          date: mealDate,
          time: mealTime,
          symptom: `Meal Logged: ${mealType}`,
          severity: 1,
          bleedingLevel: 'None',
          painLevel: 0,
          notes: `${mealName} (${analysis.giRating} • ${analysis.pcosRating})`
        });
      }
    }

    resetForm();
  };

  const resetForm = () => {
    setMealName('');
    setMealNotes('');
    setImagePreview(null);
    setAiAnalysisResult(null);
    setEditingMeal(null);
    setShowAddModal(false);
  };

  const handleEditClick = (meal) => {
    setEditingMeal(meal);
    setMealType(meal.type);
    setMealName(meal.name);
    setMealDate(meal.date);
    setMealTime(meal.time);
    setMealNotes(meal.notes || '');
    setImagePreview(meal.imageUrl || null);
    setAiAnalysisResult(meal.analysis || null);
    setShowAddModal(true);
  };

  const handleDeleteMeal = (id) => {
    onUpdateMeals(meals.filter((m) => m.id !== id));
  };

  // Hydration Quick Logger (+250ml, +500ml)
  const handleAddWater = (ml) => {
    const current = hydration.amountMl || 0;
    const newAmount = Math.min(5000, current + ml);
    onUpdateHydration({
      ...hydration,
      amountMl: newAmount
    });
  };

  const handleResetHydration = () => {
    onUpdateHydration({
      ...hydration,
      amountMl: 0
    });
  };

  // Calculate Meal Pattern Stats
  const totalMeals = meals.length;
  const lowGiMeals = meals.filter((m) => m.analysis?.giRating === 'Low GI').length;
  const lowGiPercentage = totalMeals > 0 ? Math.round((lowGiMeals / totalMeals) * 100) : 100;
  const currentWaterL = ((hydration.amountMl || 0) / 1000).toFixed(1);
  const targetWaterL = ((hydration.targetMl || 2500) / 1000).toFixed(1);
  const hydrationPct = Math.min(100, Math.round(((hydration.amountMl || 0) / (hydration.targetMl || 2500)) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Banner */}
      <div className="numa-card glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow)' }}>
            <Utensils size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800' }}>AI Nutrition & Meal Tracking</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              PCOS-oriented glycemic analysis, food recognition scanner, recipe ideas, and hydration tracking.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setShowRecipeModal(true)} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
            <BookOpen size={16} /> PCOS Recipes ({pcosRecipes.length})
          </button>
          <button onClick={() => { resetForm(); setShowAddModal(true); }} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
            <Plus size={16} /> Log Meal
          </button>
        </div>
      </div>

      {/* Top Metrics Grid (Low-GI Ratio, Hydration Bar, PCOS Rating) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        
        {/* Low-GI Meal Pattern Card */}
        <div className="numa-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>MEAL PATTERN GI SCORE</span>
            <PieChart size={18} color="var(--primary)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>{lowGiPercentage}%</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Low-GI Meals ({lowGiMeals}/{totalMeals})</span>
          </div>
          <div style={{ width: '100%', height: '8px', borderRadius: 'var(--radius-full)', background: 'var(--bg-input)', overflow: 'hidden' }}>
            <div style={{ width: `${lowGiPercentage}%`, height: '100%', background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)', borderRadius: 'var(--radius-full)' }} />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            💡 <strong>PCOS Tip:</strong> Maintaining &gt;75% Low-GI meal choices stabilizes insulin and mitigates androgen surges.
          </p>
        </div>

        {/* Daily Hydration Tracking Card */}
        <div className="numa-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>DAILY HYDRATION TRACKER</span>
            <Droplets size={18} color="#3B82F6" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: '800', color: '#3B82F6' }}>{currentWaterL}L</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>of {targetWaterL}L Goal ({hydrationPct}%)</span>
          </div>

          <div style={{ width: '100%', height: '8px', borderRadius: 'var(--radius-full)', background: 'var(--bg-input)', overflow: 'hidden' }}>
            <div style={{ width: `${hydrationPct}%`, height: '100%', background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)', borderRadius: 'var(--radius-full)' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => handleAddWater(250)} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>
              +250ml Glass
            </button>
            <button onClick={() => handleAddWater(500)} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>
              +500ml Bottle
            </button>
            <button onClick={handleResetHydration} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', color: 'var(--text-muted)' }}>
              Reset
            </button>
          </div>
        </div>

        {/* AI Educational Insight Card */}
        <div className="numa-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--primary-light)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
            <Sparkles size={18} />
            <h4 style={{ fontSize: '0.9rem', fontWeight: '800' }}>AI Nutrition Guidance</h4>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
            "Pairing complex carbohydrates with at least <strong>20g of protein and 7g of dietary fiber</strong> significantly flattens postprandial glucose curves, keeping daily energy consistent and supporting adrenal health."
          </p>
        </div>

      </div>

      {/* Main Content Area: Logged Meals History & Pattern Correlation */}
      <div className="numa-card" style={{ padding: '1.5rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Logged Meals & Food History</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Chronological record of logged meals with AI glycemic rating and macro breakdown.</p>
          </div>
          <span className="badge badge-mint" style={{ fontSize: '0.8rem' }}>{meals.length} Meals Logged</span>
        </div>

        {/* Empty State */}
        {meals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--border-color)' }}>
            <Utensils size={40} color="var(--text-muted)" style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.35rem' }}>No Meals Logged Yet</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.25rem' }}>
              Click "Log Meal" above to record your breakfast, lunch, dinner, or snacks with optional image recognition scanning!
            </p>
            <button onClick={() => { resetForm(); setShowAddModal(true); }} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
              <Plus size={16} /> Log First Meal
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {meals.map((meal) => (
              <div key={meal.id} className="numa-card" style={{ padding: '1.15rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', itemsAlign: 'center', gap: '0.75rem' }}>
                    
                    {/* Meal Image Thumbnail */}
                    {meal.imageUrl ? (
                      <img src={meal.imageUrl} alt={meal.name} style={{ width: '54px', height: '54px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '54px', height: '54px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Utensils size={24} />
                      </div>
                    )}

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span className="badge badge-mint" style={{ fontSize: '0.7rem' }}>{meal.type}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Clock size={12} /> {meal.date} • {meal.time}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginTop: '0.2rem' }}>{meal.name}</h4>
                    </div>
                  </div>

                  {/* Actions & Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`badge ${meal.analysis?.giRating === 'Low GI' ? 'badge-mint' : meal.analysis?.giRating === 'High GI' ? 'badge-rose' : 'badge-lavender'}`} style={{ fontSize: '0.75rem', fontWeight: '800' }}>
                      {meal.analysis?.giRating || 'Low GI'}
                    </span>

                    <button onClick={() => handleEditClick(meal)} className="btn btn-outline btn-icon" title="Edit Meal Entry" style={{ width: '32px', height: '32px' }}>
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDeleteMeal(meal.id)} className="btn btn-outline btn-icon" title="Delete Meal Entry" style={{ width: '32px', height: '32px', color: 'var(--accent-rose)' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Macro & PCOS Rating Row */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8rem', background: 'var(--bg-input)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)' }}>
                  <div><strong>PCOS Impact:</strong> {meal.analysis?.pcosRating || 'Blood-Sugar Friendly'}</div>
                  {meal.analysis?.macros && (
                    <div style={{ color: 'var(--text-muted)' }}>
                      Carbs: {meal.analysis.macros.carbs}g • Protein: {meal.analysis.macros.protein}g • Fiber: {meal.analysis.macros.fiber}g • Fat: {meal.analysis.macros.fats}g
                    </div>
                  )}
                </div>

                {/* Notes */}
                {meal.notes && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
                    "{meal.notes}"
                  </p>
                )}

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Non-Causal Safety Disclaimer Notice */}
      <div style={{ padding: '0.75rem 1.15rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center' }}>
        <ShieldCheck size={14} color="var(--primary)" style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }} />
        NUMA AI compares recorded meal patterns alongside 24-hour symptom events for observational awareness, while strictly avoiding any claims that a specific food directly caused a symptom.
      </div>

      {/* MEAL LOGGING FORM MODAL */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem', maxWidth: '540px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{editingMeal ? 'Edit Meal Entry' : 'Log New Meal'}</h3>
              <button onClick={() => setShowAddModal(false)} className="btn btn-outline btn-icon">✕</button>
            </div>

            <form onSubmit={handleSaveMealForm} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              
              {/* Meal Type & Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Meal Type</label>
                  <select value={mealType} onChange={(e) => setMealType(e.target.value)} style={{ width: '100%' }}>
                    <option value="Breakfast">Breakfast 🍳</option>
                    <option value="Lunch">Lunch 🥗</option>
                    <option value="Dinner">Dinner 🍲</option>
                    <option value="Snack">Snack 🍏</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Meal Time</label>
                  <input type="text" value={mealTime} onChange={(e) => setMealTime(e.target.value)} placeholder="12:30 PM" style={{ width: '100%' }} />
                </div>
              </div>

              {/* Meal Name */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Meal Description / Name</label>
                <input
                  type="text"
                  placeholder="e.g. Grilled Salmon with Quinoa & Avocado Salad"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              {/* Optional Food Image Uploader with Simulated AI Scanner */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>
                  Food Photo (Optional AI Scanner)
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <label className="btn btn-outline" style={{ cursor: 'pointer', fontSize: '0.8rem' }}>
                    <Camera size={16} /> Choose Photo
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                  {isScanningImage && <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}><Sparkles size={14} className="animate-spin" /> AI scanning food image...</span>}
                </div>

                {imagePreview && (
                  <div style={{ marginTop: '0.75rem', position: 'relative', display: 'inline-block' }}>
                    <img src={imagePreview} alt="Preview" style={{ width: '120px', height: '90px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                    <button type="button" onClick={() => setImagePreview(null)} style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--accent-rose)', color: '#FFF', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '0.7rem', cursor: 'pointer' }}>✕</button>
                  </div>
                )}
              </div>

              {/* AI Recognition Result Card */}
              {aiAnalysisResult && (
                <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.3rem' }}>
                    <Sparkles size={14} /> AI Food Scanner Analysis
                  </div>
                  <div><strong>GI Rating:</strong> {aiAnalysisResult.giRating} • <strong>PCOS Rating:</strong> {aiAnalysisResult.pcosRating}</div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Personal Notes</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Felt energized after meal, no bloating."
                  value={mealNotes}
                  onChange={(e) => setMealNotes(e.target.value)}
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  <Check size={16} /> {editingMeal ? 'Save Changes' : 'Log Meal'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* PCOS RECIPE GENERATOR & IDEAS MODAL */}
      {showRecipeModal && (
        <div className="modal-overlay" onClick={() => setShowRecipeModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem', maxWidth: '640px', maxHeight: '85vh', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>PCOS Recipe Ideas & Meal Suggestions</h3>
              </div>
              <button onClick={() => setShowRecipeModal(false)} className="btn btn-outline btn-icon">✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {pcosRecipes.map((recipe) => (
                <div key={recipe.id} className="numa-card" style={{ padding: '1.25rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span className="badge badge-mint" style={{ fontSize: '0.7rem' }}>{recipe.phase}</span>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '800', marginTop: '0.2rem' }}>{recipe.title}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prep Time: {recipe.prepTime} • {recipe.giRating}</p>
                    </div>
                    <span className="badge badge-lavender" style={{ fontSize: '0.75rem', fontWeight: '700' }}>{recipe.pcosRating}</span>
                  </div>

                  <div style={{ fontSize: '0.8rem', background: 'var(--bg-input)', padding: '0.65rem', borderRadius: 'var(--radius-md)' }}>
                    <strong>Macros:</strong> {recipe.macros}
                  </div>

                  <div>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '0.3rem' }}>Key Ingredients:</h5>
                    <ul style={{ fontSize: '0.8rem', color: 'var(--text-main)', paddingLeft: '1.2rem', margin: 0 }}>
                      {recipe.ingredients.map((ing, idx) => (
                        <li key={idx}>{ing}</li>
                      ))}
                    </ul>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    💡 <strong>Hormonal Benefit:</strong> {recipe.benefits}
                  </p>

                  <button
                    onClick={() => {
                      setMealName(recipe.title);
                      setMealType('Lunch');
                      setShowRecipeModal(false);
                      setShowAddModal(true);
                    }}
                    className="btn btn-primary"
                    style={{ fontSize: '0.8rem', alignSelf: 'flex-start' }}
                  >
                    <Plus size={14} /> Log This Recipe
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
