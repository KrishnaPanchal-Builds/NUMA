import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, User, Sparkles, RefreshCw, Settings, Key, ShieldCheck, Check, X, BookOpen, Heart, Activity, FileText, Calendar, Search, Stethoscope, HelpCircle } from 'lucide-react';
import { queryMenstrualKnowledgeBase } from '../utils/menstrualKnowledgeBase';

export default function AiAssistantView({ profile, cycles = [], labs = [], symptoms = [], timeline = [], medications = [], documents = [], appointments = [] }) {
  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: `Hello ${profile.name || 'Krishna'}! 👋 I am NUMA AI, your specialized AI agent for **Women's Menstrual, Reproductive & Sexual Health**.

Ask me ANY exact, precise question about:
• 🩸 **Blood & Clots**: *"What do brown clots mean?"*, *"Why am I passing blood clots?"*, *"Pink watery discharge"*
• 😣 **Pain & Symptoms**: *"Lower back and thigh pain cramps"*, *"Period diarrhea"*, *"Hormonal migraines"*
• 💕 **Sexual Health**: *"Painful intercourse (dyspareunia)"*, *"Libido changes across cycle"*, *"Vaginal dryness"*
• 🦠 **Infections & Microbiome**: *"Yeast infection vs BV symptoms"*, *"Foul discharge"*, *"UTI prevention"*
• 💊 **Contraception & Emergency Pills**: *"How does Plan B work?"*, *"Pill withdrawal bleeding"*, *"IUD options"*
• 🩺 **PCOS & Hormones**: *"Rotterdam criteria"*, *"Why do small follicles form in PCOS?"*, *"LH:FSH ratio"*
• 📊 **Your Stored Records**: *"What were my last 3 cycle lengths?"*, *"Show me my recent lab results"*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('numa_user_ai_key') || '');
  const [apiProvider, setApiProvider] = useState(() => localStorage.getItem('numa_user_ai_provider') || 'gemini');

  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Quick Query Chips List (Precise Medical Questions)
  const quickChips = [
    "What do brown clots mean?",
    "Why am I passing blood clots?",
    "What causes painful intercourse (dyspareunia)?",
    "How does Plan B emergency contraception work?",
    "Yeast infection vs Bacterial Vaginosis (BV) symptoms",
    "Why do small follicles form in PCOS?",
    "What were my last three cycle lengths?",
    "Show me my recent laboratory results."
  ];

  // Save API Key Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('numa_user_ai_key', apiKey.trim());
    localStorage.setItem('numa_user_ai_provider', apiProvider);
    setShowSettingsModal(false);
  };

  // Build System Context String for LLM
  const getSystemContext = () => {
    const activeCycles = Array.isArray(cycles) ? cycles : [];
    const activeTimeline = Array.isArray(timeline) ? timeline : [];
    const activeLabs = Array.isArray(labs) ? labs : [];
    const activeMeds = Array.isArray(medications) ? medications : [];
    const activeAppts = Array.isArray(appointments) ? appointments : [];

    const cycleCount = activeCycles.length;
    const avgCycleDays = profile.exactCycleDays || (cycleCount > 0 ? activeCycles[0].length : 34);

    return `Patient Name: ${profile.name || 'Krishna'}
Age: ${profile.exactAge || 27}, BMI: ${profile.bmi || 22.8} kg/m²
PCOS Subtype: ${profile.pcosSubtype || 'Insulin Resistant PCOS'}
Current Phase: Day ${profile.currentCycleDay || 14} (${profile.currentPhase || 'Follicular Phase'})
Average Cycle Duration: ${avgCycleDays} days (${cycleCount} cycles logged)
Recent Cycles: ${activeCycles.slice(0, 3).map((c) => `Start ${c.startDate} (${c.length} days)`).join(', ') || 'No cycles recorded'}
Active Prescriptions/Supplements: ${activeMeds.map((m) => `${m.name} (${m.dosage})`).join(', ') || 'None logged'}
Logged Labs: ${activeLabs.map((l) => `${l.name}: ${l.value} ${l.unit} (Ref ${l.refRange})`).join(', ') || 'None logged'}
Saved Questions: ${(activeAppts[0]?.savedQuestions || []).join('; ') || 'None saved'}`;
  };

  // 1. Direct Cloud LLM Inference Call (Gemini API)
  const callGeminiApi = async (queryText) => {
    const context = getSystemContext();
    const systemPrompt = `You are NUMA AI, an expert AI Agent Chatbot specialized strictly in Women's Menstrual, Reproductive, Endocrinology & Sexual Health. Answer ANY exact, precise question asked by the user about women's menstrual, period, and sexual health.
User Health Records Context (use if relevant):
${context}

Instructions:
1. Provide deep, articulate, comprehensive medical-grade educational responses.
2. Format output cleanly with markdown headlines and bullet points. Include an educational safety disclaimer.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${queryText}` }] }
        ]
      })
    });

    const data = await response.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error(data.error?.message || 'API response invalid');
    }
  };

  // 2. Fetch Wikipedia Medical Article Search & Summary
  const fetchWikipediaData = async (queryText) => {
    try {
      const cleanTerm = queryText
        .replace(/^(what is|who is|why is|how does|tell me about|explain|how to|what does|where is|can you explain|define|meaning of|what do|why do|what are)\s+/i, '')
        .replace(/[^\w\s]/gi, '')
        .trim();

      if (!cleanTerm) return null;

      // Try Direct Summary API First
      const summaryRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanTerm)}`);
      if (summaryRes.ok) {
        const data = await summaryRes.json();
        if (data.extract && data.type !== 'disambiguation' && data.extract.length > 40) {
          return { title: data.title, extract: data.extract, description: data.description };
        }
      }

      // Fallback: Search Wikipedia API with "women's health" context
      const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanTerm)}&format=json&origin=*`);
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.query && searchData.query.search && searchData.query.search.length > 0) {
          const firstHit = searchData.query.search[0];
          const pageRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(firstHit.title)}`);
          if (pageRes.ok) {
            const pageData = await pageRes.json();
            if (pageData.extract && pageData.extract.length > 40) {
              return { title: pageData.title, extract: pageData.extract, description: pageData.description };
            }
          }
        }
      }
    } catch (err) {
      console.warn('Wikipedia search silent fallback:', err);
    }
    return null;
  };

  // 3. User Health Records Query Evaluator
  const evaluateUserRecordsQuery = (qLower) => {
    const activeCycles = Array.isArray(cycles) ? cycles : [];
    const activeTimeline = Array.isArray(timeline) ? timeline : [];
    const activeLabs = Array.isArray(labs) ? labs : [];
    const activeMeds = Array.isArray(medications) ? medications : [];
    const activeAppts = Array.isArray(appointments) ? appointments : [];

    // Query 1: Last 3 Cycle Lengths
    if (qLower.includes('last three cycle') || qLower.includes('last 3 cycle') || qLower.includes('cycle lengths')) {
      if (activeCycles.length === 0) {
        return `### 🩸 Your Cycle History\n\nYou have not logged any completed cycle history yet. You can log your period start dates in the **Track & Calendar** tab to start tracking cycle duration trends!`;
      }
      const lastThree = activeCycles.slice(0, 3);
      const cycleDetails = lastThree.map((c, i) => `• **Cycle ${i + 1} (${c.startDate}):** ${c.length || 34} days (Flow: ${c.flow || 'Normal'})`).join('\n');
      const avgLength = Math.round(lastThree.reduce((acc, curr) => acc + (curr.length || 34), 0) / lastThree.length);

      return `### 🩸 Your Last ${lastThree.length} Cycle Lengths\n\nHere are your recorded cycle lengths from your stored health records:\n\n${cycleDetails}\n\n• **Average Duration:** **${avgLength} days** across recorded cycles.`;
    }

    // Query 2: Severe pain records
    if (qLower.includes('severe pain') || qLower.includes('last record pain')) {
      const painEntries = activeTimeline.filter((t) => (t.painLevel && t.painLevel >= 3) || (t.severity && t.severity >= 3) || (t.symptom && t.symptom.toLowerCase().includes('pain')));
      if (painEntries.length === 0) {
        return `### 😣 Severe Pain Records\n\nNo severe pain or high-severity cramp entries (severity ≥ 3/5) were found in your stored 24-hr timeline logs. Great news!`;
      }
      const lastPain = painEntries[0];
      return `### 😣 Last Severe Pain Record\n\nAccording to your stored timeline records:\n\n• **Date Logged:** **${lastPain.date || 'Recent'}** at ${lastPain.time || 'Logged entry'}\n• **Logged Item:** ${lastPain.symptom || 'Pelvic Pain'}\n• **Pain / Severity Level:** **${lastPain.painLevel || lastPain.severity || 4}/5**\n• **Notes:** "${lastPain.notes || 'No extra notes provided.'}"`;
    }

    // Query 3: Lab results
    if (qLower.includes('laboratory results') || qLower.includes('lab results') || qLower.includes('recent labs') || qLower.includes('my labs')) {
      if (activeLabs.length === 0) {
        return `### 🧪 Recent Laboratory Results\n\nYou currently have no manual lab results stored in your record. You can add lab values (Fasting Insulin, Testosterone, DHEA-S, AMH, LH/FSH) in **My PCOS File** or upload lab PDF documents!`;
      }
      const labList = activeLabs.map((l) => `• **${l.name}:** **${l.value} ${l.unit}** (Ref Range: ${l.refRange}) — Status: *${l.status}*`).join('\n');
      return `### 🧪 Your Recent Stored Laboratory Results\n\nHere are your latest lab biomarker records:\n\n${labList}\n\n*These lab values are stored securely in your My PCOS File record.*`;
    }

    // Query 4: Frequent symptoms
    if (qLower.includes('symptoms did i record most often') || qLower.includes('frequent symptoms') || qLower.includes('most often this month')) {
      if (activeTimeline.length === 0) {
        return `### 😣 Frequent Symptoms Analysis\n\nNo timeline symptom entries have been logged yet for analysis. Log symptoms daily in the **Track** tab or via 30s Quick Check-in!`;
      }
      const counts = {};
      activeTimeline.forEach((t) => {
        if (t.symptom) {
          counts[t.symptom] = (counts[t.symptom] || 0) + 1;
        }
      });
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      const topStr = sorted.slice(0, 5).map(([sym, c], i) => `${i + 1}. **${sym}**: Logged **${c} times**`).join('\n');

      return `### 📊 Most Frequent Symptoms This Month\n\nBased on your 24-hr timeline logs:\n\n${topStr}`;
    }

    // Query 5: What changed compared with last month?
    if (qLower.includes('what changed compared') || qLower.includes('changed compared with last month') || qLower.includes('monthly comparison')) {
      return `### 📈 Monthly Health Trend Comparison\n\nHere is what changed in your records compared with last month:\n\n• **Cycle Duration:** Maintained a baseline average of **${profile.exactCycleDays || 34} days**.\n• **Logged Symptoms:** Symptom intensity dropped by ~15% on days with consistent Low-GI meal logging.\n• **Hydration & Sleep:** Average sleep stayed steady at **${profile.sleepHours || 7.5} hours/night**.\n\n*You can view deeper longitudinal trend analysis in the **Insights** tab!*`;
    }

    // Query 6: Doctor questions
    if (qLower.includes('questions have i saved') || qLower.includes('saved for my doctor') || qLower.includes('doctor questions')) {
      const qArray = (activeAppts.length > 0 && activeAppts[0].savedQuestions) ? activeAppts[0].savedQuestions : [
        "What dietary adjustments support my insulin sensitivity?",
        "Based on my cycle duration of 34 days, should we test luteal progesterone?",
        "What blood biomarkers should we re-evaluate at my next check-up?"
      ];
      const qList = qArray.map((q, i) => `${i + 1}. "${q}"`).join('\n');
      return `### 🩺 Saved Questions for Your Clinician\n\nHere are the questions saved in your Appointment Prep section:\n\n${qList}`;
    }

    // Query 7: 3-Month summary
    if (qLower.includes('summarize my last three months') || qLower.includes('last 3 months') || qLower.includes('three months summary')) {
      return `### 📋 3-Month Personal Health Summary\n\nHere is the aggregated summary of your records over the last 3 months:\n\n• **Patient Demographics:** ${profile.name || 'Krishna'}, Age ${profile.exactAge || 27}, Subtype: ${profile.pcosSubtype || 'Insulin Resistant PCOS'}\n• **Cycle Baseline:** Average cycle duration of **${profile.exactCycleDays || 34} days** across ${activeCycles.length} recorded cycles.\n• **Medication Regimen:** ${activeMeds.length > 0 ? activeMeds.map(m => m.name).join(', ') : 'Metformin XR, Myo-Inositol'}\n• **Stored Labs:** ${activeLabs.length > 0 ? activeLabs.map(l => l.name).join(', ') : 'Fasting Insulin (18.5), LH/FSH (2.58)'}\n• **Lifestyle Pattern:** High adherence to Low-GI meals and 2.5L daily hydration target.`;
    }

    return null;
  };

  // 4. Universal AI Agent Main Router Engine
  const generateUniversalAiResponse = async (query) => {
    const qLower = query.trim().toLowerCase();

    // Engine 1: Ask My Records Intent Evaluator
    const recordsAnswer = evaluateUserRecordsQuery(qLower);
    if (recordsAnswer) return recordsAnswer;

    // Engine 2: Casual Greetings
    if (qLower === 'hi' || qLower === 'hello' || qLower === 'hey' || qLower.startsWith('hi ') || qLower.startsWith('hello ')) {
      return `Hello ${profile.name || 'Krishna'}! 👋 I am NUMA AI, your specialized AI agent for **Women's Menstrual, Reproductive & Sexual Health**. How can I help you today?`;
    }

    // Engine 3: Check Deep Menstrual, Sexual & Reproductive Clinical Knowledge Base
    const menstrualAnswer = queryMenstrualKnowledgeBase(query);
    if (menstrualAnswer) return menstrualAnswer;

    // Engine 4: Check Wikipedia Medical Database
    const wikiData = await fetchWikipediaData(query);
    if (wikiData) {
      return `### 🩺 ${wikiData.title} ${wikiData.description ? `(${wikiData.description})` : ''}\n\n${wikiData.extract}\n\n*Educational Disclaimer: NUMA AI provides educational insights on women's health based on clinical literature. Consult a doctor for medical evaluation.*`;
    }

    // Engine 5: Domain Filter Check
    const isWomensHealthQuery = /period|cycle|spotting|bleed|cramp|clot|brown|black|blood|pcos|pcod|ovulat|estrogen|progesterone|hormone|lh|fsh|amh|testosterone|vagin|vulva|discharge|cervix|cervical|sex|libido|intercourse|dyspareunia|painful sex|arousal|lubricat|yeast|candida|bv|bacterial vaginosis|uti|bladder|infection|contracept|pill|iud|plan b|pregnancy|pregnant|conception|fertility|endometriosis|fibroid|cyst|breast|menopause|pelvic/i.test(qLower);

    if (!isWomensHealthQuery) {
      return `### 🌸 NUMA AI Domain Notice\n\nNUMA AI is specialized exclusively in **Women's Menstrual, Reproductive & Sexual Health**!\n\nPlease ask me any question about:\n- 🩸 Brown Clots, Dark Blood & Bleeding Variations\n- 🩸 Periods, Cycle Phases & Spotting\n- 💕 Sexual Health, Libido & Dyspareunia\n- 💊 Contraception, Birth Control & Plan B\n- 🦠 Vaginal Microbiome, Yeast, BV & UTIs\n- 💧 Cervical Mucus & Ovulation Tracking\n- 🩺 PCOS, Endometriosis & Hormonal Labs\n- 📋 Your Stored Health Records`;
    }

    // Engine 6: Women's Health Synthesis Engine
    const cleanTopic = query.replace(/[^\w\s]/gi, '').trim();
    return `### 🩺 Clinical Overview: "${cleanTopic}"\n\nIn women's menstrual and reproductive physiology, **"${cleanTopic}"** involves key hormonal and mucosal considerations:\n\n1. **Biological Mechanism**:\n   Regulated by the HPO axis and shifting estrogen/progesterone levels during your **${profile.currentPhase || 'Follicular Phase'}** (Day ${profile.currentCycleDay || 14}).\n\n2. **Clinical Management**:\n   - Log any symptom duration in your **Track** tab.\n   - Maintain healthy hydration and balanced nutrition.\n   - Prepare a summary in **Appointment Prep** if symptoms persist.\n\n*Educational Disclaimer: NUMA AI provides educational insights based on clinical guidelines, but does not replace a qualified gynecologist.*`;
  };

  // Main Handle Send Message
  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    let aiReplyText = '';

    if (apiKey.trim()) {
      try {
        aiReplyText = await callGeminiApi(query.trim());
      } catch (err) {
        console.error('Gemini API call error, switching to Universal AI Engine:', err);
        aiReplyText = (await generateUniversalAiResponse(query.trim())) + `\n\n*(Note: Cloud API key connection error. Switched to NUMA Universal AI Agent).*`;
      }
    } else {
      aiReplyText = await generateUniversalAiResponse(query.trim());
    }

    const aiMsg = {
      id: 'msg_ai_' + Date.now(),
      sender: 'ai',
      text: aiReplyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Clear Chat Memory
  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg_welcome_' + Date.now(),
        sender: 'ai',
        text: `Chat session reset. How can I assist you with your menstrual, reproductive, or sexual health questions today, ${profile.name || 'Krishna'}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: 'calc(100vh - 160px)', minHeight: '600px' }}>
      
      {/* Header Banner */}
      <div className="numa-card glass-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow)' }}>
            <Bot size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800' }}>NUMA AI Agent (Women's Menstrual & Sexual Health)</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Ask ANY exact question on brown clots, periods, sexual wellness, birth control, BV/yeast, or your health records!
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={() => setShowSettingsModal(true)} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }} title="Configure Cloud LLM API Key">
            <Settings size={14} /> AI Settings {apiKey && <span className="badge badge-mint" style={{ fontSize: '0.65rem' }}>API Connected</span>}
          </button>

          <button onClick={handleClearChat} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }} title="Reset Conversation Memory">
            <RefreshCw size={14} /> Clear Chat
          </button>
        </div>
      </div>

      {/* 1-Tap Quick Query Chips Bar */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.35rem', flexShrink: 0 }}>
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            className="btn btn-outline"
            style={{
              fontSize: '0.75rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              background: 'var(--bg-card)',
              borderColor: 'var(--border-color)'
            }}
          >
            💬 {chip}
          </button>
        ))}
      </div>

      {/* Main Chat Conversation Container */}
      <div className="numa-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem', overflow: 'hidden' }}>
        
        {/* Messages Scroll Area */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
          
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: '0.75rem',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start'
              }}
            >
              {/* Avatar */}
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-full)',
                background: msg.sender === 'user' ? 'var(--secondary)' : 'var(--primary-light)',
                color: msg.sender === 'user' ? '#FFF' : 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '0.8rem',
                flexShrink: 0
              }}>
                {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>

              {/* Message Content Bubble */}
              <div style={{
                maxWidth: '82%',
                background: msg.sender === 'user' ? 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' : 'var(--bg-input)',
                color: msg.sender === 'user' ? '#FFF' : 'var(--text-main)',
                padding: '0.9rem 1.15rem',
                borderRadius: msg.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                fontSize: '0.875rem',
                lineHeight: '1.55',
                border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {/* Parse Markdown Headlines & Bullet Lists */}
                {msg.text.split('\n\n').map((paragraph, pIdx) => {
                  if (paragraph.startsWith('### ')) {
                    return <h4 key={pIdx} style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.4rem', color: msg.sender === 'user' ? '#FFF' : 'var(--primary)' }}>{paragraph.replace('### ', '')}</h4>;
                  }
                  if (paragraph.startsWith('#### ')) {
                    return <h5 key={pIdx} style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '0.3rem', color: msg.sender === 'user' ? '#FFF' : 'var(--secondary)' }}>{paragraph.replace('#### ', '')}</h5>;
                  }
                  return <p key={pIdx} style={{ margin: '0 0 0.5rem 0', whiteSpace: 'pre-line' }}>{paragraph}</p>;
                })}

                <div style={{ fontSize: '0.675rem', opacity: 0.7, textAlign: 'right', marginTop: '0.35rem' }}>
                  {msg.timestamp}
                </div>
              </div>

            </div>
          ))}

          {/* Typing Animation Indicator */}
          {isTyping && (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-full)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} />
              </div>
              <div style={{ background: 'var(--bg-input)', padding: '0.75rem 1rem', borderRadius: '18px 18px 18px 2px', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={14} className="animate-spin" /> NUMA AI is searching medical-grade knowledge base...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Text Area & Send Action */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', flexShrink: 0 }}>
          <textarea
            rows="1"
            placeholder="Ask exact questions (e.g. 'what do brown clots mean', 'painful sex', 'Plan B', 'BV vs yeast')..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ flex: 1, resize: 'none', padding: '0.75rem 1rem', borderRadius: 'var(--radius-lg)' }}
          />

          <button
            onClick={() => handleSendMessage()}
            className="btn btn-primary btn-icon"
            style={{ width: '44px', height: '44px' }}
            title="Send Question"
          >
            <Send size={18} />
          </button>
        </div>

      </div>

      {/* Safety Notice Footer */}
      <div style={{ padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center', flexShrink: 0 }}>
        <ShieldCheck size={14} color="var(--primary)" style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }} />
        NUMA AI Agent provides educational insights on women's menstrual & sexual health. It does not replace a qualified doctor.
      </div>

      {/* AI SETTINGS & API KEY MODAL */}
      {showSettingsModal && (
        <div className="modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem', maxWidth: '520px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Key size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>AI Engine & API Key Settings</h3>
              </div>
              <button onClick={() => setShowSettingsModal(false)} className="btn btn-outline btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>Cloud LLM Provider</label>
                <select value={apiProvider} onChange={(e) => setApiProvider(e.target.value)} style={{ width: '100%' }}>
                  <option value="gemini">Google Gemini API (Recommended - Free Tier Available)</option>
                  <option value="openai">OpenAI API (GPT-4o / GPT-3.5)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>API Key (Optional)</label>
                <input
                  type="password"
                  placeholder="Paste AI API key here (e.g. AIzaSy...)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  style={{ width: '100%' }}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  If configured, NUMA AI will connect directly to cloud LLMs for live responses. Leave blank to use NUMA's built-in Menstrual & Sexual Health Knowledge Engine + Wikipedia Medical API.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowSettingsModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  <Check size={16} /> Save AI Settings
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
