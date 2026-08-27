import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Heart, Sparkles, Check } from 'lucide-react';

export default function BreathingModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [totalRounds, setTotalRounds] = useState(4); // 3, 4, 6, or 8 rounds
  const [currentRound, setCurrentRound] = useState(1);
  const [phase, setPhase] = useState('idle'); // 'idle' | 'inhale' | 'hold' | 'exhale' | 'complete'
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const timerRef = useRef(null);

  // Slow, Soothing Female Voice Speech Helper
  const speakCue = (text) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // Cancel active speech
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Select Female Soothing Voice
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

      utterance.rate = 0.65; // Extra slow, calm, meditative pace
      utterance.pitch = 0.88; // Deep, warm, soothing tone
      utterance.volume = 0.95;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Speech synthesis error:', e);
    }
  };

  // Start Exercise
  const handleStart = () => {
    setIsActive(true);
    setCurrentRound(1);
    startPhase('inhale', 4, 1);
  };

  // Pause/Resume
  const handleTogglePause = () => {
    if (isActive) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } else {
      setIsActive(true);
      startPhase(phase === 'idle' ? 'inhale' : phase, secondsLeft, currentRound);
    }
  };

  // Reset
  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsActive(false);
    setPhase('idle');
    setCurrentRound(1);
    setSecondsLeft(4);
  };

  // Phase Transition Controller (SHORT SLOW SOOTHING WORDS ONLY)
  const startPhase = (nextPhase, duration, round) => {
    setPhase(nextPhase);
    setSecondsLeft(duration);

    if (nextPhase === 'inhale') {
      speakCue('Inhale...');
    } else if (nextPhase === 'hold') {
      speakCue('Hold...');
    } else if (nextPhase === 'exhale') {
      speakCue('Exhale...');
    }
  };

  // Main Timer Countdown Loop
  useEffect(() => {
    if (!isActive || phase === 'idle' || phase === 'complete') return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        // Phase Transition Logic
        if (phase === 'inhale') {
          startPhase('hold', 7, currentRound);
        } else if (phase === 'hold') {
          startPhase('exhale', 8, currentRound);
        } else if (phase === 'exhale') {
          if (currentRound < totalRounds) {
            const nextRound = currentRound + 1;
            setCurrentRound(nextRound);
            startPhase('inhale', 4, nextRound);
          } else {
            // Exercise Completed
            setPhase('complete');
            setIsActive(false);
            speakCue('Relax...');
            if (timerRef.current) clearInterval(timerRef.current);
          }
        }
        return 0;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, phase, currentRound, totalRounds, soundEnabled]);

  // Clean speech synthesis on close
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'var(--primary)';
      case 'hold': return 'var(--accent-amber)';
      case 'exhale': return 'var(--secondary)';
      case 'complete': return 'var(--accent-mint)';
      default: return 'var(--primary)';
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return '🌬️ INHALE';
      case 'hold': return '⏸️ HOLD';
      case 'exhale': return '💨 EXHALE';
      case 'complete': return '🧘 RELAX';
      default: return '🫁 4-7-8 CALM BREATHING';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem', maxWidth: '520px', textAlign: 'center' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Heart size={20} color="var(--secondary)" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>4-7-8 Soothing Breathing</h2>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="btn btn-outline btn-icon"
              title={soundEnabled ? 'Mute Soothing Voice Cues' : 'Enable Soothing Voice Cues'}
            >
              {soundEnabled ? <Volume2 size={18} color="var(--primary)" /> : <VolumeX size={18} color="var(--danger)" />}
            </button>

            <button onClick={onClose} className="btn btn-outline btn-icon">
              <X size={18} />
            </button>
          </div>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          A slow, soothing female voice speaks minimal cues (<strong>Inhale</strong>, <strong>Hold</strong>, <strong>Exhale</strong>) so you can keep your <strong>eyes closed</strong>.
        </p>

        {/* Round Configurator */}
        {phase === 'idle' && (
          <div style={{ marginBottom: '1.5rem', background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.5rem' }}>
              Select Number of Rounds:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              {[3, 4, 6, 8].map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setTotalRounds(r)}
                  className={`btn ${totalRounds === r ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                >
                  {r} Rounds
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Animated Expanding Breathing Ring */}
        <div style={{
          width: '210px',
          height: '210px',
          margin: '0 auto 1.5rem',
          borderRadius: 'var(--radius-full)',
          border: `4px solid ${getPhaseColor()}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'all 0.8s ease-in-out',
          transform: phase === 'inhale' ? 'scale(1.15)' : phase === 'exhale' ? 'scale(0.88)' : 'scale(1)',
          boxShadow: `0 0 35px ${getPhaseColor()}40`
        }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '800', color: getPhaseColor(), textTransform: 'uppercase', letterSpacing: '1px' }}>
            {getPhaseText()}
          </span>

          <span style={{ fontSize: '3.2rem', fontWeight: '900', color: 'var(--text-main)', lineHeight: 1, margin: '0.4rem 0' }}>
            {phase === 'idle' ? '4-7-8' : phase === 'complete' ? '✓' : secondsLeft}
          </span>

          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>
            {phase === 'idle' ? `${totalRounds} Rounds Configured` : `Round ${currentRound} of ${totalRounds}`}
          </span>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
          {phase === 'idle' ? (
            <button onClick={handleStart} className="btn btn-primary" style={{ padding: '0.65rem 1.5rem', fontSize: '0.95rem' }}>
              <Play size={18} /> Start Soothing Breathing
            </button>
          ) : (
            <>
              <button onClick={handleTogglePause} className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>
                {isActive ? <Pause size={18} /> : <Play size={18} />} {isActive ? 'Pause' : 'Resume'}
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
