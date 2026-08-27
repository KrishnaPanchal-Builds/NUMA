import React, { useState } from 'react';
import { BookOpen, ShieldAlert, Heart, Utensils, Sparkles, Footprints, AlertCircle, CheckCircle, Video, FileText, HelpCircle, Info, Image, Stethoscope, Search } from 'lucide-react';
import { RECIPES_DATABASE, PCOS_GLOSSARY } from '../data/recipesData';

export default function LearnView({ articles = [], redFlags = [] }) {
  const [activeTab, setActiveTab] = useState('topics'); // 'topics' | 'articles' | 'videos' | 'infographics' | 'faqs' | 'glossary' | 'workout' | 'recipes' | 'triage'
  const [selectedTopic, setSelectedTopic] = useState('what-is-pcos');
  const [glossarySearch, setGlossarySearch] = useState('');
  const [faqSearch, setFaqSearch] = useState('');

  // 14 Core Topics Data Structure
  const CORE_TOPICS = [
    {
      id: 'what-is-pcos',
      title: 'What is PCOS?',
      category: 'Foundations',
      summary: 'Polycystic Ovary Syndrome (PCOS) is a complex metabolic and endocrine disorder affecting 8-13% of reproductive-aged women worldwide.',
      content: `PCOS is characterized by hormonal imbalances, irregular menstrual cycles, and small fluid-filled sacs (follicles) on the ovaries. It is driven by two main underlying drivers: Insulin Resistance and Elevated Androgens (male-pattern hormones like testosterone). Sourced from ESHRE/ASRM Guidelines.`
    },
    {
      id: 'pcos-vs-pcod',
      title: 'PCOS vs. PCOD',
      category: 'Diagnosis',
      summary: 'Understanding the key clinical differences between PCOD (Polycystic Ovarian Disease) and PCOS (Polycystic Ovary Syndrome).',
      content: `• PCOD is a milder condition where ovaries release immature eggs due to hormonal fluctuations. It is primarily managed with dietary tweaks and lifestyle changes.\n• PCOS is a metabolic-endocrine disorder where ovaries produce excess androgens, impairing ovulation and raising risk for insulin resistance, metabolic syndrome, and Type 2 Diabetes.`
    },
    {
      id: 'terminology',
      title: 'PCOS Terminology',
      category: 'Foundations',
      summary: 'Demystifying clinical medical terms (Amenorrhea, Oligomenorrhea, Hirsutism, AMH, SHBG).',
      content: `• Oligomenorrhea: Infrequent periods (>35 day cycle duration).\n• Amenorrhea: Absence of menstruation for 3+ consecutive months.\n• Hirsutism: Excess dark terminal hair growth in male-pattern distributions (face, chest, abdomen).\n• SHBG (Sex Hormone-Binding Globulin): Liver protein that binds free testosterone.`
    },
    {
      id: 'symptoms',
      title: 'Recognizing Symptoms',
      category: 'Clinical',
      summary: 'Irregular periods, hirsutism, acne, hair thinning, weight gain, fatigue, and mood swings.',
      content: `PCOS symptoms present differently across subtypes. Common signs include irregular bleeding, cystic acne along the jawline, androgenic alopecia (hair thinning), fatigue due to insulin resistance, and dark velvet skin patches (Acanthosis Nigricans).`
    },
    {
      id: 'diagnosis',
      title: 'Diagnosis & Rotterdam Criteria',
      category: 'Clinical',
      summary: 'How clinicians diagnose PCOS using the international Rotterdam Criteria (requires 2 of 3 features).',
      content: `According to international evidence-based guidelines, a diagnosis requires meeting at least 2 out of 3 Rotterdam Criteria after excluding thyroid and prolactin disorders:\n1. Oligo/Anovulation (irregular or absent periods)\n2. Clinical/Biochemical Hyperandrogenism (high testosterone or hirsutism/acne)\n3. Polycystic Ovaries on Pelvic Ultrasound (12+ follicles measuring 2-9mm per ovary).`
    },
    {
      id: 'hormones',
      title: 'Hormonal Imbalances',
      category: 'Endocrinology',
      summary: 'Role of LH:FSH ratio, Testosterone, DHEA-S, Estrogen, and Progesterone.',
      content: `In PCOS, elevated LH (Luteinizing Hormone) triggers the ovarian theca cells to synthesize excess testosterone. Lower FSH levels prevent follicle maturation, leading to low progesterone levels and anovulatory cycles.`
    },
    {
      id: 'insulin-resistance',
      title: 'Insulin Resistance Cascade',
      category: 'Metabolic',
      summary: 'How hyperinsulinemia drives excess androgen production in ovarian cells.',
      content: `70-80% of women with PCOS have insulin resistance regardless of body weight. High circulating insulin stimulates ovarian androgen production and suppresses liver SHBG production, increasing free active testosterone.`
    },
    {
      id: 'nutrition',
      title: 'PCOS Nutrition & Glycemic Index',
      category: 'Lifestyle',
      summary: 'Low-GI eating, anti-inflammatory foods, fiber, and protein timing.',
      content: `Prioritizing Low-Glycemic Index (Low-GI) complex carbohydrates prevents rapid blood sugar spikes. Combining fiber and protein with meals slows glucose absorption and stabilizes insulin levels.`
    },
    {
      id: 'exercise',
      title: 'Exercise & Cycle Syncing',
      category: 'Lifestyle',
      summary: 'Zone-2 walking, resistance strength training, and cortisol protection.',
      content: `Progressive resistance training improves skeletal muscle insulin sensitivity without elevating cortisol. Low-impact Zone-2 walking supports metabolic health without triggering adrenal stress.`
    },
    {
      id: 'sleep',
      title: 'Sleep & Circadian Health',
      category: 'Lifestyle',
      summary: 'Melatonin, sleep apnoea risk, and sleep hygiene for hormonal balance.',
      content: `Women with PCOS experience higher rates of sleep apnea and lower melatonin levels. Disrupted circadian sleep impairs morning fasting glucose and worsens daytime fatigue.`
    },
    {
      id: 'mental-wellbeing',
      title: 'Mental Wellbeing & Cortisol',
      category: 'Mindbody',
      summary: 'Managing anxiety, depression, body image, and adrenal stress.',
      content: `Anxiety and depression are 3x more common in PCOS due to hormonal shifts and inflammation. Mind-body practices like 4-7-8 breathing suppress sympathetic nervous system overdrive.`
    },
    {
      id: 'fertility',
      title: 'Fertility & Ovulation',
      category: 'Reproductive',
      summary: 'Tracking ovulation, cervical mucus, and evidence-based ovulation induction.',
      content: `PCOS is the leading cause of ovulatory infertility, but ovulation can be restored through lifestyle modifications, Myo-Inositol, and medical therapies like Letrozole or Clomiphene under specialist guidance.`
    },
    {
      id: 'medication',
      title: 'Medication Education',
      category: 'Clinical',
      summary: 'Metformin, Combined Oral Contraceptives, Spironolactone, and Inositol.',
      content: `• Metformin: Insulin sensitizer that lowers blood glucose and improves menstrual regularity.\n• Inositol (40:1 Myo to D-Chiro): Natural second messenger that improves insulin receptor signaling.\n• Spironolactone: Anti-androgen that blocks testosterone receptors to reduce hirsutism.`
    },
    {
      id: 'faqs',
      title: 'Frequently Asked Questions',
      category: 'General',
      summary: 'Answers to common questions regarding cyst rupture, fertility, and long-term health.',
      content: `PCOS is a manageable lifelong condition. With proper lifestyle strategies and clinical care, symptom remission and regular ovulation are achievable.`
    }
  ];

  // Clinical Videos
  const CLINICAL_VIDEOS = [
    { id: 'v1', title: 'Understanding PCOS & The Rotterdam Criteria', duration: '6:45', author: 'Dr. Endocrine Specialist', topic: 'Diagnosis', thumbnail: '🎬' },
    { id: 'v2', title: 'Insulin Resistance & Ovarian Testosterone', duration: '8:12', author: 'Clinical Nutrition Team', topic: 'Insulin Resistance', thumbnail: '🔬' },
    { id: 'v3', title: 'Cycle-Synced Strength Training vs. Cortisol', duration: '5:30', author: 'Exercise Physiologist', topic: 'Exercise', thumbnail: '🏋️‍♀️' },
    { id: 'v4', title: 'Myo-Inositol (40:1 Ratio) Mechanism Explained', duration: '7:15', author: 'Reproductive Pharmacologist', topic: 'Medications', thumbnail: '💊' }
  ];

  // Infographics
  const INFOGRAPHICS = [
    { id: 'i1', title: 'PCOS vs. PCOD Comparison Chart', tag: 'Visual Guide', desc: 'Side-by-side comparison of symptoms, ovarian ultrasound features, and metabolic risk profiles.' },
    { id: 'i2', title: 'The 3 Rotterdam Diagnostic Criteria', tag: 'Clinical Diagram', desc: 'Visual breakdown showing how 2 out of 3 criteria confirm a clinical diagnosis.' },
    { id: 'i3', title: 'The Hyperinsulinemia & Androgen Loop', tag: 'Biochemical Flow', desc: 'Diagram illustrating how high insulin acts on ovarian cells to boost free testosterone.' },
    { id: 'i4', title: 'Low-GI vs. High-GI Blood Glucose Curve', tag: 'Nutrition Diagram', desc: 'Comparative graph showing post-meal glucose spikes and insulin responses.' }
  ];

  // FAQs
  const FAQS_LIST = [
    { q: 'Can PCOS be cured permanently?', a: 'PCOS is a chronic metabolic condition without a singular permanent cure, but symptoms can be effectively managed into complete clinical remission with lifestyle interventions and clinical support.' },
    { q: 'What is the main difference between PCOS and PCOD?', a: 'PCOD is a milder condition where ovaries release immature eggs due to minor hormonal imbalances. PCOS is a serious metabolic-endocrine disorder accompanied by high androgen levels and insulin resistance.' },
    { q: 'Does having polycystic ovaries mean I have ovarian cysts?', a: 'No! The "cysts" in PCOS are actually harmless, undeveloped egg follicles (2-9mm) that fail to mature and ovulate due to hormonal imbalances, not fluid-filled ovarian cysts that rupture.' },
    { q: 'Why is low-GI food important for PCOS?', a: 'Low-GI foods break down slowly, preventing rapid blood sugar spikes and excessive insulin secretion, which reduces ovarian androgen production.' },
    { q: 'Can I get pregnant naturally with PCOS?', a: 'Yes! While PCOS is a common cause of irregular ovulation, lifestyle strategies, Myo-Inositol, and medical treatments like Letrozole successfully induce regular ovulation and fertility.' }
  ];

  const filteredGlossary = PCOS_GLOSSARY.filter((item) =>
    item.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    item.definition.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  const filteredFaqs = FAQS_LIST.filter((item) =>
    item.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
    item.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const currentTopicData = CORE_TOPICS.find((t) => t.id === selectedTopic) || CORE_TOPICS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Educational Header Banner */}
      <div className="numa-card glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '0.25rem' }}>Expert-Reviewed Clinical Education</span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>NUMA Evidence-Based Education Centre</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Sourced from ESHRE, ASRM & International PCOS Guidelines for patient education.
          </p>
        </div>
      </div>

      {/* Primary Sub-Tabs Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', overflowX: 'auto' }}>
        <button onClick={() => setActiveTab('topics')} className={`btn ${activeTab === 'topics' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.825rem' }}>
          <BookOpen size={15} /> 14 Core Topics
        </button>
        <button onClick={() => setActiveTab('articles')} className={`btn ${activeTab === 'articles' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.825rem' }}>
          <FileText size={15} /> Clinical Articles
        </button>
        <button onClick={() => setActiveTab('videos')} className={`btn ${activeTab === 'videos' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.825rem' }}>
          <Video size={15} /> Video Explainers
        </button>
        <button onClick={() => setActiveTab('infographics')} className={`btn ${activeTab === 'infographics' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.825rem' }}>
          <Image size={15} /> Infographics
        </button>
        <button onClick={() => setActiveTab('faqs')} className={`btn ${activeTab === 'faqs' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.825rem' }}>
          <HelpCircle size={15} /> FAQs
        </button>
        <button onClick={() => setActiveTab('glossary')} className={`btn ${activeTab === 'glossary' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.825rem' }}>
          <Sparkles size={15} /> Clinical Glossary
        </button>
        <button onClick={() => setActiveTab('workout')} className={`btn ${activeTab === 'workout' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.825rem' }}>
          <Footprints size={15} /> Workout Plans
        </button>
        <button onClick={() => setActiveTab('triage')} className={`btn ${activeTab === 'triage' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.825rem' }}>
          <ShieldAlert size={15} /> Red Flags
        </button>
      </div>

      {/* TAB 1: 14 CORE TOPICS EXPLAINER HUB */}
      {activeTab === 'topics' && (
        <div className="grid-1-2" style={{ gap: '1.25rem' }}>
          
          {/* Left Column: Topic List Selector */}
          <div className="numa-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.5rem' }}>Core Medical Topics</h3>
            {CORE_TOPICS.map((top) => (
              <button
                key={top.id}
                onClick={() => setSelectedTopic(top.id)}
                className={`btn ${selectedTopic === top.id ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  fontSize: '0.825rem',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: selectedTopic === top.id ? 'none' : '1px solid var(--border-color)'
                }}
              >
                <div>
                  <div style={{ fontWeight: '800' }}>{top.title}</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>{top.category}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Right Column: Selected Topic Detailed Explainer Sheet */}
          <div className="numa-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-primary">{currentTopicData.category}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Expert-Reviewed Reference</span>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--primary)' }}>{currentTopicData.title}</h2>
            
            <div style={{ background: 'var(--primary-light)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)' }}>
              💡 Summary: {currentTopicData.summary}
            </div>

            <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
              {currentTopicData.content}
            </div>

            <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', border: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <Stethoscope size={14} style={{ display: 'inline', marginRight: '0.35rem' }} />
              Sources: ESHRE/ASRM International Evidence-Based Guidelines, NIH & Endocrine Society clinical reviews.
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: ARTICLES */}
      {activeTab === 'articles' && (
        <div className="grid-1-2">
          {articles.map((art) => (
            <div key={art.id} className="numa-card">
              <span className="badge badge-teal" style={{ marginBottom: '0.5rem' }}>{art.category}</span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.4rem' }}>{art.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '0.75rem' }}>
                "{art.snippet}"
              </p>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                {art.author} • {art.readTime}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: VIDEO EXPLAINERS */}
      {activeTab === 'videos' && (
        <div className="grid-1-2-3">
          {CLINICAL_VIDEOS.map((vid) => (
            <div key={vid.id} className="numa-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ height: '120px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                {vid.thumbnail}
              </div>
              <div>
                <span className="badge badge-mint" style={{ marginBottom: '0.35rem' }}>{vid.topic}</span>
                <h4 style={{ fontSize: '1rem', fontWeight: '800' }}>{vid.title}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  By {vid.author} • {vid.duration}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: INFOGRAPHICS */}
      {activeTab === 'infographics' && (
        <div className="grid-1-2">
          {INFOGRAPHICS.map((info) => (
            <div key={info.id} className="numa-card" style={{ border: '1px solid var(--border-color)' }}>
              <span className="badge badge-rose" style={{ marginBottom: '0.5rem' }}>{info.tag}</span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.4rem' }}>{info.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '0.75rem' }}>
                {info.desc}
              </p>
              <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center', fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--primary)' }}>
                🖼️ High-Resolution Clinical Infographic Viewable in Doctor Prep
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: FAQS */}
      {activeTab === 'faqs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Search frequently asked questions..."
            value={faqSearch}
            onChange={(e) => setFaqSearch(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem' }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {filteredFaqs.map((faq, idx) => (
              <div key={idx} className="numa-card" style={{ padding: '1.15rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <HelpCircle size={16} /> Q: {faq.q}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.5', margin: 0, paddingLeft: '1.4rem' }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: GLOSSARY */}
      {activeTab === 'glossary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Search PCOS clinical terms (e.g. Inositol, AMH, Androgens)..."
            value={glossarySearch}
            onChange={(e) => setGlossarySearch(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem' }}
          />

          <div className="grid-1-2">
            {filteredGlossary.map((item, idx) => (
              <div key={idx} className="numa-card">
                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.35rem' }}>{item.term}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{item.definition}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: WORKOUT PLANS */}
      {activeTab === 'workout' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> Notice: These activity plans provide educational guidance rather than prescribing exercise as medical treatment.
          </div>

          <div className="grid-1-2">
            {[
              { phase: 'Menstrual Phase (Days 1–5)', badge: 'Restorative', activities: ['Zone-1 Walking (20-30m)', 'Yin Yoga'], rationale: 'Gentle movement promotes pelvic circulation.' },
              { phase: 'Follicular Phase (Days 6–13)', badge: 'Strength Building', activities: ['Pilates', 'Resistance Training'], rationale: 'Rising estrogen enhances energy and muscle recovery.' },
              { phase: 'Ovulatory Phase (Days 14–16)', badge: 'Peak Stamina', activities: ['Weight Training', 'Full Body'], rationale: 'High glycogen availability supports peak strength.' },
              { phase: 'Luteal Phase (Days 17–28+)', badge: 'Steady-State Zone-2', activities: ['Zone-2 Walking', 'Mobility'], rationale: 'Avoid high intensity to protect cortisol balance.' }
            ].map((plan, idx) => (
              <div key={idx} className="numa-card">
                <span className="badge badge-mint" style={{ marginBottom: '0.35rem' }}>{plan.badge}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.4rem' }}>{plan.phase}</h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{plan.rationale}</p>
                <div style={{ background: 'var(--bg-input)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}>
                  <strong>Educational Activities:</strong> {plan.activities.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: RED-FLAG SAFETY TRIAGE */}
      {activeTab === 'triage' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {redFlags.map((flag, idx) => (
            <div key={idx} className="numa-card" style={{ borderLeft: `5px solid var(--${flag.color})` }}>
              <span className={`badge badge-${flag.color}`} style={{ marginBottom: '0.5rem' }}>{flag.level}</span>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                {flag.symptoms.map((s, sIdx) => <li key={sIdx} style={{ marginBottom: '0.2rem' }}>{s}</li>)}
              </ul>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)' }}>
                🚨 Action: {flag.action}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
