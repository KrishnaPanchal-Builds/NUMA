import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Heart, Check } from 'lucide-react';

export default function MeditationModal({ isOpen, onClose, initialMeditation = null }) {
  if (!isOpen) return null;

  const meditationsList = [
    {
      id: 'm1',
      title: '5-Min PCOS Cortisol & Endocrine Balance',
      duration: 300, // 5 minutes
      category: 'Hormonal Balance & Cortisol Reset',
      prompts: [
        'Close your eyes gently and take a deep, slow breath.',
        'With every slow exhale, release stress and allow your nervous system to calm.',
        'My adrenals are calm, steady, and producing balanced cortisol levels.',
        'My body is naturally restoring endocrine harmony and insulin sensitivity.',
        'I release all tension in my belly, lower back, and pelvis.',
        'My ovaries are supported, healthy, and working in complete rhythm.',
        'My hormone levels are aligning naturally with every peaceful breath.',
        'I am safe, rested, and my body knows how to heal.',
        'Feel the soothing warmth of relaxation calming your entire body.',
        'My blood sugar and metabolism are balanced and steady.',
        'I honor my body with patience, peace, and deep self-compassion.',
        'Breathe in hormonal harmony, and exhale all residual stress.',
        'You are doing wonderfully. Slowly open your eyes when ready.'
      ]
    },
    {
      id: 'm2',
      title: '10-Min Deep Sleep & Ovarian Restoration',
      duration: 600, // 10 minutes
      category: 'Deep Sleep & Cellular Repair',
      prompts: [
        'Sink gently into your bed and let your eyelids feel heavy and relaxed.',
        'Unclench your jaw, soften your shoulders, and relax your belly completely.',
        'As I fall asleep, my body naturally lowers inflammation and repairs cells.',
        'My hormones balance effortlessly while I sleep deeply tonight.',
        'I release all control and trust my body to restore overnight.',
        'My mind is quiet, my heart is calm, and my spirit is at peace.',
        'Peaceful, restorative sleep is filling every cell of my body.',
        'My metabolic health and endocrine system regenerate as I sleep.',
        'I welcome deep, unbroken, rejuvenating sleep.',
        'Every organ in my body receives healing energy tonight.',
        'Allow your breath to slow down to a soft, natural whisper.',
        'You are completely safe. Sleep deeply and peacefully.'
      ]
    },
    {
      id: 'm3',
      title: '5-Min Insulin Sensitivity & Metabolic Calm',
      duration: 300,
      category: 'Metabolic & Insulin Wellness',
      prompts: [
        'Place a hand gently over your heart and take a deep, slow breath.',
        'My body uses glucose efficiently, keeping my energy steady and vibrant.',
        'I nourish my body with food and thoughts that create hormonal peace.',
        'My insulin levels are balanced, supporting optimal ovarian health.',
        'I release any anxiety around my cycle, trusting my body\'s healing wisdom.',
        'My metabolism is flexible, resilient, and balanced.',
        'I am grateful for my body\'s incredible ability to heal and adapt.',
        'Every cell in my body receives energy with ease and balance.',
        'I am patient, kind, and loving toward my physical journey.',
        'Breathe in steady vitality and exhale all self-doubt.'
      ]
    }
  ];

  const [selectedMeditation, setSelectedMeditation] = useState(initialMeditation || meditationsList[0]);
  const [isActive, setIsActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(selectedMeditation.duration);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const timerRef = useRef(null);

  // Female Soothing Voice Speech Helper
  const speakMeditationPrompt = (text) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // Cancel active speech
      const utterance = new SpeechSynthesisUtterance(text);

      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('samantha') ||
          v.name.toLowerCase().includes('karen') ||
          v.name.toLowerCase().includes('victoria') ||
          v.name.toLowerCase().includes('zira') ||
          (v.lang.startsWith('en') && v.name.toLowerCase().includes('google'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      utterance.rate = 0.65; // Extra slow, peaceful, meditative pace
      utterance.pitch = 0.88; // Deep, warm, soothing tone
      utterance.volume = 0.95;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Speech synthesis error:', e);
    }
  };

  const handleStart = () => {
    setIsActive(true);
    setCurrentPromptIndex(0);
    speakMeditationPrompt(selectedMeditation.prompts[0]);
  };

  const handleTogglePause = () => {
    if (isActive) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } else {
      setIsActive(true);
      speakMeditationPrompt(selectedMeditation.prompts[currentPromptIndex]);
    }
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsActive(false);
    setSecondsLeft(selectedMeditation.duration);
    setCurrentPromptIndex(0);
  };

  // Timer & Prompt Advancement Loop across all hormonal affirmations
  useEffect(() => {
    if (!isActive) return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          speakMeditationPrompt('Meditation complete. Take a gentle deep breath and feel your hormonal harmony.');
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }

        const elapsed = selectedMeditation.duration - prev + 1;
        const promptInterval = Math.floor(selectedMeditation.duration / selectedMeditation.prompts.length);
        const nextPromptIdx = Math.min(
          Math.floor(elapsed / promptInterval),
          selectedMeditation.prompts.length - 1
        );

        if (nextPromptIdx !== currentPromptIndex) {
          setCurrentPromptIndex(nextPromptIdx);
          speakMeditationPrompt(selectedMeditation.prompts[nextPromptIdx]);
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, currentPromptIndex, selectedMeditation, soundEnabled]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem', maxWidth: '560px', textAlign: 'center' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Hormonal Balance Voice Meditation</h2>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="btn btn-outline btn-icon"
              title={soundEnabled ? 'Mute Soothing Voice' : 'Enable Soothing Voice'}
            >
              {soundEnabled ? <Volume2 size={18} color="var(--primary)" /> : <VolumeX size={18} color="var(--danger)" />}
            </button>
            <button onClick={onClose} className="btn btn-outline btn-icon">
              <X size={18} />
            </button>
          </div>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          A slow, soothing female voice speaks continuous <strong>hormonal balance & cortisol reduction affirmations</strong> for <strong>eyes-closed meditation</strong>.
        </p>

        {/* Meditation Selection Cards */}
        {!isActive && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            {meditationsList.map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => {
                  setSelectedMeditation(m);
                  setSecondsLeft(m.duration);
                  setCurrentPromptIndex(0);
                }}
                className={`btn ${selectedMeditation.id === m.id ? 'btn-primary' : 'btn-outline'}`}
                style={{ justifyContent: 'space-between', padding: '0.75rem 1rem', fontSize: '0.85rem' }}
              >
                <div>
                  <strong style={{ display: 'block' }}>{m.title}</strong>
                  <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{m.category} ({m.prompts.length} Affirmations)</span>
                </div>
                <span>{Math.floor(m.duration / 60)} mins</span>
              </button>
            ))}
          </div>
        )}

        {/* Meditation Timer Display */}
        <div style={{
          width: '200px',
          height: '200px',
          margin: '0 auto 1.5rem',
          borderRadius: 'var(--radius-full)',
          border: '4px solid var(--primary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 35px rgba(139, 92, 246, 0.25)',
          background: 'var(--bg-input)'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase' }}>
            {selectedMeditation.category}
          </span>
          <span style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-main)', margin: '0.2rem 0' }}>
            {formatTime(secondsLeft)}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {isActive ? `Affirmation ${currentPromptIndex + 1} of ${selectedMeditation.prompts.length}` : 'Ready'}
          </span>
        </div>

        {/* Spoken Affirmation Text Box */}
        {isActive && (
          <div style={{ background: 'var(--primary-light)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem', fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--primary)', lineHeight: '1.4' }}>
            "{selectedMeditation.prompts[currentPromptIndex]}"
          </div>
        )}

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
          {!isActive ? (
            <button onClick={handleStart} className="btn btn-primary" style={{ padding: '0.65rem 1.5rem', fontSize: '0.95rem' }}>
              <Play size={18} /> Start Voice Meditation
            </button>
          ) : (
            <>
              <button onClick={handleTogglePause} className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>
                <Pause size={18} /> Pause
              </button>
              <button onClick={handleReset} className="btn btn-outline" style={{ padding: '0.6rem 1.25rem' }}>
                <RotateCcw size={18} /> Reset
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
