'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MarketingHome() {
  const router = useRouter();
  const [seeding, setSeeding] = useState(false);
  const [seedError, setSeedError] = useState('');
  const [sandboxGoal, setSandboxGoal] = useState('');

  // Seeding + Console launch action
  const handleStartWithDemo = async () => {
    setSeeding(true);
    setSeedError('');
    try {
      const res = await fetch('http://localhost:3000/data/seed', { method: 'POST' });
      if (res.ok) {
        router.push('/console?tab=workspace');
      } else {
        setSeedError('Failed to initialize database. Is the API server running?');
        setSeeding(false);
      }
    } catch (err) {
      console.error(err);
      setSeedError('Connection refused. Ensure the Fastify API server is running on port 3000.');
      setSeeding(false);
    }
  };

  const handleSandboxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sandboxGoal.trim()) return;
    router.push(`/console?tab=workspace&goal=${encodeURIComponent(sandboxGoal)}`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-slate-950)' }}>
      
      {/* HEADER / NAVIGATION BAR (Sticky Glassmorphic) */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--glass-border)',
        padding: '16px 0'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
            <span style={{ fontSize: '24px' }}>🚀</span>
            <span style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '0.5px' }}>CampaignOS</span>
          </div>

          {/* Nav Links */}
          <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <a href="#features" style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>Features</a>
            <a href="#channels" style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>Channels</a>
            <a href="#how-it-works" style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>AI Agents</a>
            <a href="#case-studies" style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>Case Studies</a>
            <a href="#pricing" style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>Pricing</a>
          </nav>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <a href="/console?tab=campaigns" style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>Login</a>
            <button 
              onClick={() => router.push('/console')}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-white)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px'
              }}
            >
              Launch Console
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{ padding: '80px 0 60px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '40px', alignItems: 'center' }}>
          
          {/* Left Text */}
          <div className="animate-slide-up">
            <div style={{
              display: 'inline-flex',
              padding: '6px 14px',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '100px',
              color: 'var(--primary-gold)',
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '20px'
            }}>
              🧠 The Autonomous AI Decision Layer for CRMs
            </div>
            
            <h1 style={{ fontSize: '52px', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1px' }}>
              Accelerate Your CRM <br />
              to <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Warp Speed</span>
            </h1>
            
            <p style={{ fontSize: '18px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '36px' }}>
              Stop building manual campaign strategies and segments. Connect Salesforce, Zoho, or Xeno and let our network of autonomous marketing agents discover opportunities, target audiences, and launch WhatsApp, Email, or SMS campaigns.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px' }}>
              <button 
                onClick={handleStartWithDemo}
                disabled={seeding}
                style={{
                  background: 'var(--gradient-primary)',
                  color: '#000',
                  border: 'none',
                  padding: '14px 28px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: 'var(--gold-glow)'
                }}
              >
                {seeding ? '⚡ Initializing Demo...' : 'Start with Demo Data'}
              </button>
              <button 
                onClick={() => router.push('/console?tab=data')}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  color: 'var(--text-white)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '14px 28px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Upload Customer Data
              </button>
            </div>

            {seedError && (
              <div style={{ display: 'inline-block', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.15)', color: 'var(--error-red)', padding: '8px 12px', borderRadius: '6px', fontSize: '13px' }}>
                ⚠️ {seedError}
              </div>
            )}
          </div>

          {/* Right Mock Image Frame */}
          <div style={{ position: 'relative' }}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.4)',
              border: '1px solid var(--glass-border)',
              borderRadius: '16px',
              padding: '12px',
              boxShadow: 'var(--glass-glow), var(--blue-glow)',
              overflow: 'hidden'
            }}>
              {/* Browser Header Mock */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', paddingLeft: '4px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56' }}></div>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27c93f' }}></div>
              </div>
              <img 
                src="file:///C:/Users/singh/.gemini/antigravity/brain/3cc35437-8435-4f9a-8ded-6a0ef4f22d00/campaign_os_hero_1781065005309.png" 
                alt="CampaignOS Workspace Hero"
                style={{ width: '100%', display: 'block', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF / TRUSTED BRANDS (Xeno-style) */}
      <section style={{ padding: '40px 0', borderTop: '1px solid var(--border-slate)', borderBottom: '1px solid var(--border-slate)', background: 'rgba(2, 6, 23, 0.5)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-dark)', fontWeight: 600 }}>
            POWERING HIGH-GROWTH CAMPAIGNS ACROSS ENTERPRISE CRMs
          </span>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', alignItems: 'center', marginTop: '24px', flexWrap: 'wrap', opacity: 0.65 }}>
            <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-muted)' }}>LEVI'S</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-muted)' }}>TACO BELL</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-muted)' }}>VERO MODA</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-muted)' }}>JACK & JONES</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-muted)' }}>ONLY</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-muted)' }}>BESTSELLER</span>
          </div>
        </div>
      </section>

      {/* FEATURES / CAPABILITIES (getxeno.com style) */}
      <section id="features" style={{ padding: '80px 0', background: 'radial-gradient(circle at 0% 100%, #0d1a3c 0%, var(--bg-slate-950) 60%)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ fontSize: '12px', color: 'var(--primary-gold)', fontWeight: 600, textTransform: 'uppercase' }}>Engineered for Revenue Growth</span>
            <h2 style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>Move from CRM Records to Active Revenue</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '500px', margin: '8px auto 0 auto' }}>
              Campaign-OS bridges the gap between your customer list and engagement networks.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            
            <div className="glass-card">
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '10px' }}>Opportunity Detection</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Our algorithms search order profiles to discover high-recovery segments (dormant VIPs, dropoffs, high spent lists) automatically.
              </p>
            </div>

            <div className="glass-card">
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>👥</div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '10px' }}>Behavioral Segmentation</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Say goodbye to complex SQL and filter criteria. Our segmentation agent groups users dynamically based on objectives.
              </p>
            </div>

            <div className="glass-card">
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚡</div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '10px' }}>Content Studio</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Generate contextual copy and call-to-actions tailored to each segment. View mock chat message bubbles instantly.
              </p>
            </div>

            <div className="glass-card">
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>💡</div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '10px' }}>Explainable Decisions</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Every segment, channel suggestion, and offer recommendation displays a full "Decision Trace" so you always understand why.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* OMNICHANNEL MESSAGING CHANNELS */}
      <section id="channels" style={{ padding: '80px 0', borderTop: '1px solid var(--border-slate)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '12px', color: 'var(--info-blue)', fontWeight: 600, textTransform: 'uppercase' }}>Delivery Ecosystem</span>
            <h2 style={{ fontSize: '30px', fontWeight: 700, marginTop: '8px' }}>Launch Campaigns on Modern Channels</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px', flexWrap: 'wrap' }}>
            
            <div className="glass-card" style={{ borderTop: '4px solid #25d366' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>📱 WhatsApp Business</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                Delivers up to 98% open rates and 2.3x higher conversion rates for dormant retail lists compared to email.
              </p>
              <div style={{ fontSize: '11px', color: 'var(--text-dark)' }}>Supports rich cards & interactive CTAs</div>
            </div>

            <div className="glass-card" style={{ borderTop: '4px solid #ea4335' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>✉️ Email Newsletter</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                Ideal for detailed catalog announcements and long-form brand stories with average order value (AOV) metrics tracking.
              </p>
              <div style={{ fontSize: '11px', color: 'var(--text-dark)' }}>Responsive templates supported</div>
            </div>

            <div className="glass-card" style={{ borderTop: '4px solid #f59e0b' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>💬 SMS Broadcasts</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                Quick transactional blasts and urgency codes. Reaches customers instantly without network dependencies.
              </p>
              <div style={{ fontSize: '11px', color: 'var(--text-dark)' }}>100% immediate delivery rate</div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS / AGENT COLLABORATION */}
      <section id="how-it-works" style={{ padding: '80px 0', background: 'rgba(2, 6, 23, 0.4)', borderTop: '1px solid var(--border-slate)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '40px', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--primary-gold)', fontWeight: 600, textTransform: 'uppercase' }}>Orchestration Pipeline</span>
              <h2 style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px', lineHeight: 1.2 }}>Meet Your Autonomous Agent Army</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '16px', lineHeight: 1.6 }}>
                Each agent has a single, isolated domain expertise. They consume output from previous steps and collaborate under the orchestrator to build your campaign package.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span style={{ fontSize: '24px' }}>1️⃣</span>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Opportunity Agent</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Queries raw customer orders to locate pockets of under-performing or at-risk revenue.</p>
                </div>
              </div>
              <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span style={{ fontSize: '24px' }}>2️⃣</span>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Segmentation Agent</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pipes opportunity results to compile lists and calculates average spending indexes.</p>
                </div>
              </div>
              <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span style={{ fontSize: '24px' }}>3️⃣</span>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Strategy Agent</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Configures optimum delivery channel, offer discount codes, and delivery schedules.</p>
                </div>
              </div>
              <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span style={{ fontSize: '24px' }}>4️⃣</span>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Content Agent</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Outputs copy drafts and CTA links optimized for maximum click velocities.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CASE STUDIES (getxeno.com style) */}
      <section id="case-studies" style={{ padding: '80px 0', borderTop: '1px solid var(--border-slate)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '12px', color: 'var(--primary-gold)', fontWeight: 600, textTransform: 'uppercase' }}>Success Stories</span>
            <h2 style={{ fontSize: '30px', fontWeight: 700, marginTop: '8px' }}>Proven Revenue Recovery Results</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', flexWrap: 'wrap' }}>
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-dark)', marginBottom: '8px', fontWeight: 600 }}>CASE STUDY: VERO MODA</div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: 'var(--primary-gold)' }}>Reactivating 324 Footwear Customers</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  "By connecting Campaign-OS to our CRM database, we recovered ₹48,000 in revenue in just 7 days of campaign launch. The agent pipeline isolated our dormant footwear list and delivered personalized WhatsApp offers with zero manual work."
                </p>
              </div>
              <div style={{ borderTop: '1px solid var(--border-slate)', paddingTop: '16px', marginTop: '20px', display: 'flex', gap: '24px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dark)' }}>ROI Velocity</div>
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>2.3x Conversion</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dark)' }}>Delivery Channel</div>
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>WhatsApp Business</div>
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-dark)', marginBottom: '8px', fontWeight: 600 }}>CASE STUDY: JACK & JONES</div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: 'var(--info-blue)' }}>AOV Optimization for Repeat Buyers</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  "CampaignOS helped us discover a VIP cohort that had order counts of 5+ but had stayed dormant for 60 days. The strategy agent recommended a tailored 15% discount campaign that triggered a 32% growth in customer repeat purchase rates."
                </p>
              </div>
              <div style={{ borderTop: '1px solid var(--border-slate)', paddingTop: '16px', marginTop: '20px', display: 'flex', gap: '24px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dark)' }}>AOV Gained</div>
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>+₹1,200 Avg. Spend</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dark)' }}>Segment Size</div>
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>450 buyers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE SANDBOX WIDGET */}
      <section style={{ padding: '80px 0', borderTop: '1px solid var(--border-slate)', background: 'linear-gradient(180deg, var(--bg-slate-950) 0%, #0c152a 100%)' }}>
        <div className="container" style={{ maxWidth: '750px', textAlign: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--primary-gold)', fontWeight: 600, textTransform: 'uppercase' }}>Campaign Sandbox</span>
          <h2 style={{ fontSize: '28px', fontWeight: 700, marginTop: '8px', marginBottom: '12px' }}>Try the Agent Engine</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '28px' }}>
            Type a marketing goal in natural language below to see how our agents construct segment logic.
          </p>

          <form onSubmit={handleSandboxSubmit} style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              value={sandboxGoal}
              onChange={(e) => setSandboxGoal(e.target.value)}
              placeholder="e.g. Win back customers who spent over ₹5,000 but haven't ordered in 60 days..."
              style={{
                flex: 1,
                background: 'rgba(2, 6, 23, 0.7)',
                border: '1px solid var(--border-slate-light)',
                borderRadius: '8px',
                padding: '12px 16px',
                color: 'var(--text-white)',
                fontSize: '14px'
              }}
            />
            <button 
              type="submit"
              style={{
                background: 'var(--gradient-primary)',
                color: '#000',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Analyze Goal
            </button>
          </form>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" style={{ padding: '80px 0', borderTop: '1px solid var(--border-slate)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '12px', color: 'var(--primary-gold)', fontWeight: 600, textTransform: 'uppercase' }}>Pricing Plans</span>
            <h2 style={{ fontSize: '30px', fontWeight: 700, marginTop: '8px' }}>Tailored Tiers for High-Growth Brands</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Starter Plan</h3>
                <div style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', color: 'var(--primary-gold)' }}>₹4,999<span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/mo</span></div>
                <ul style={{ listStyle: 'none', fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <li>✅ Up to 5,000 customers sync</li>
                  <li>✅ Opportunity discovery agent</li>
                  <li>✅ WhatsApp & Email delivery templates</li>
                  <li>✅ Basic decision traces</li>
                </ul>
              </div>
              <button 
                onClick={() => router.push('/console')}
                style={{ marginTop: '24px', width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-white)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
              >
                Choose Starter
              </button>
            </div>

            <div className="glass-card" style={{ border: '1px solid rgba(245, 158, 11, 0.35)', boxShadow: 'var(--gold-glow)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ alignSelf: 'flex-start', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--primary-gold)', padding: '2px 8px', borderRadius: '100px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', display: 'inline-block' }}>MOST POPULAR</div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Growth Plan</h3>
                <div style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', color: 'var(--primary-gold)' }}>₹14,999<span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/mo</span></div>
                <ul style={{ listStyle: 'none', fontSize: '13px', color: 'var(--text-white)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <li>✅ Up to 50,000 customers sync</li>
                  <li>✅ All 4 autonomous marketing agents</li>
                  <li>✅ Real-time delivery counter tracking</li>
                  <li>✅ Full explainability traces</li>
                  <li>✅ Priority CRM Sync Support</li>
                </ul>
              </div>
              <button 
                onClick={handleStartWithDemo}
                style={{ marginTop: '24px', width: '100%', padding: '10px', background: 'var(--gradient-primary)', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}
              >
                Choose Growth
              </button>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Enterprise Plan</h3>
                <div style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', color: 'var(--primary-gold)' }}>Custom<span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/mo</span></div>
                <ul style={{ listStyle: 'none', fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <li>✅ Unlimited customers sync</li>
                  <li>✅ Dedicated agent model training</li>
                  <li>✅ Multi-channel customization</li>
                  <li>✅ Custom database adapters</li>
                  <li>✅ Dedicated account strategist</li>
                </ul>
              </div>
              <button 
                onClick={() => router.push('/console?tab=settings')}
                style={{ marginTop: '24px', width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-white)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
              >
                Contact Enterprise
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer style={{ background: '#020617', borderTop: '1px solid var(--border-slate)', padding: '60px 0 30px 0', marginTop: 'auto' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.8fr 0.8fr', gap: '40px', marginBottom: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px' }}>🚀</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.5px' }}>CampaignOS</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-dark)', lineHeight: 1.6, maxWidth: '240px' }}>
              Campaign-OS is the AI-native campaign planning and execution layer built on top of high-growth retail CRMs.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '13px', color: 'var(--text-white)', marginBottom: '16px', fontWeight: 600 }}>Product</h4>
            <ul style={{ listStyle: 'none', fontSize: '12px', color: 'var(--text-dark)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><a href="#features">Features</a></li>
              <li><a href="#channels">Channels</a></li>
              <li><a href="#how-it-works">AI Agents</a></li>
              <li><a href="/console">Console App</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '13px', color: 'var(--text-white)', marginBottom: '16px', fontWeight: 600 }}>Resources</h4>
            <ul style={{ listStyle: 'none', fontSize: '12px', color: 'var(--text-dark)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><a href="/#case-studies">Vero Moda Story</a></li>
              <li><a href="/#case-studies">Jack & Jones Story</a></li>
              <li><a href="/console?tab=data">Customer Data API</a></li>
              <li><a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">Next.js Docs</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '13px', color: 'var(--text-white)', marginBottom: '16px', fontWeight: 600 }}>Integrations</h4>
            <ul style={{ listStyle: 'none', fontSize: '12px', color: 'var(--text-dark)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>Xeno CRM (Soon)</li>
              <li>Salesforce Sync (Soon)</li>
              <li>Zoho CRM Connector (Soon)</li>
              <li>Shopify Adapter (Soon)</li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', textAlign: 'center', fontSize: '12px', color: 'var(--text-dark)' }}>
          © 2026 CampaignOS. Built as the AI Decision Layer for retail customer engagement.
        </div>
      </footer>

    </div>
  );
}
