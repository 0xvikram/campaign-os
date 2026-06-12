'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CampaignWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [launching, setLaunching] = useState(false);
  const router = useRouter();

  // Explainability Panel States
  const [explainPanel, setExplainPanel] = useState<{
    open: boolean;
    title: string;
    question: string;
    points: string[];
  }>({
    open: false,
    title: '',
    question: '',
    points: []
  });

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const res = await fetch(`http://localhost:3000/campaigns/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCampaign(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunch = async () => {
    setLaunching(true);
    try {
      const res = await fetch(`http://localhost:3000/campaigns/${id}/launch`, {
        method: 'POST',
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error + (errorData.hint ? '\n\n' + errorData.hint : ''));
        setLaunching(false);
        return;
      }
      
      router.push(`/analytics/${params.id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to launch campaign. Make sure the API server is running on port 3000.');
      setLaunching(false);
    }
  };

  const triggerExplain = (title: string, question: string, points: string[]) => {
    setExplainPanel({
      open: true,
      title,
      question,
      points
    });
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        Loading Campaign Workspace...
      </div>
    );
  }

  if (!campaign) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <p style={{ color: 'var(--error-red)' }}>Campaign Workspace not found.</p>
        <button 
          onClick={() => router.push('/')}
          style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-white)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
        >
          Back to Workspace
        </button>
      </div>
    );
  }

  const opp = campaign.opportunity?.opportunities?.[0];

  return (
    <div className="app-layout">
      {/* SIDEBAR */}
      <aside className="app-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', paddingLeft: '8px' }}>
          <span style={{ fontSize: '22px' }}>🚀</span>
          <span style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.5px' }}>CampaignOS</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {[
            { id: 'workspace', label: 'Workspace', icon: '🧠', active: true },
            { id: 'campaigns', label: 'Campaigns', icon: '📋', active: false },
            { id: 'analytics', label: 'Analytics', icon: '📈', active: false },
            { id: 'data', label: 'Data', icon: '🗄️', active: false },
            { id: 'settings', label: 'Settings', icon: '⚙️', active: false }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => router.push(`/?tab=${tab.id}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '6px',
                border: 'none',
                background: tab.active ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                color: tab.active ? 'var(--primary-gold)' : 'var(--text-muted)',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: tab.active ? 600 : 500,
                width: '100%'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid var(--border-slate)', paddingTop: '16px' }}>
          <button 
            onClick={() => router.push('/')}
            style={{
              background: 'transparent',
              color: 'var(--text-dark)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ← Exit Console
          </button>
        </div>
      </aside>

      {/* WORKSPACE AREA */}
      <main className="app-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'inline-block', padding: '4px 10px', background: campaign.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', border: campaign.status === 'active' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)', color: campaign.status === 'active' ? 'var(--success-green)' : 'var(--primary-gold)', borderRadius: '4px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>
              {campaign.status === 'active' ? '✅ Active Campaign' : '📝 Draft Campaign'}
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 700 }}>{campaign.name}</h1>
          </div>
          <button
            onClick={() => router.push('/')}
            style={{
              background: 'rgba(255,255,255,0.03)',
              color: 'var(--text-muted)',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
        </div>

        {/* Goal Block */}
        <div className="glass-card" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-dark)', marginBottom: '8px' }}>Business Goal Input</h3>
          <p style={{ fontSize: '16px', fontWeight: 500, lineHeight: 1.5 }}>
            "{campaign.goal}"
          </p>
        </div>

        {/* Dynamic Timeline Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Opportunity Card */}
          {opp && (
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>🔍</span>
                  <strong style={{ fontSize: '15px' }}>Opportunity Agent</strong>
                </div>
                <button 
                  onClick={() => triggerExplain(
                    'Opportunity Agent Findings', 
                    'Why did the system recommend targeting this group?', 
                    [
                      'These customers purchased 2-5 times historically, proving their affinity for the category.',
                      'They have not ordered in the last 45+ days, placing them in the high churn-risk bucket.',
                      'A WhatsApp campaign is projected to recover ₹2.4L in revenue based on category averages.'
                    ]
                  )}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                >
                  Why?
                </button>
              </div>
              <div style={{ borderLeft: '2px solid var(--border-slate)', paddingLeft: '14px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-dark)', textTransform: 'uppercase' }}>Opportunity Segment</div>
                <h4 style={{ fontSize: '16px', margin: '4px 0 8px 0', color: 'var(--primary-gold)' }}>Dormant Footwear Customers</h4>
                <div style={{ display: 'flex', gap: '32px', margin: '12px 0' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dark)' }}>Audience Pool</div>
                    <div style={{ fontSize: '16px', fontWeight: 700 }}>{campaign.audience?.customerCount || 324} customers</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dark)' }}>Est. Revenue Potential</div>
                    <div style={{ fontSize: '16px', fontWeight: 700 }}>₹{opp.estimatedRevenue.toLocaleString()}</div>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  <strong>Why:</strong> {opp.reason}
                </p>
              </div>
            </div>
          )}

          {/* Segment Card */}
          {campaign.audience && (
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>👥</span>
                  <strong style={{ fontSize: '15px' }}>Segmentation Agent</strong>
                </div>
                <button 
                  onClick={() => triggerExplain(
                    'Segmentation Agent Parameters', 
                    'What criteria isolated this segment?', 
                    [
                      'Active Category Filter: Footwear',
                      'Recency Threshold: Order date <= now - 45 days',
                      'Frequency limit: 2-5 purchases historically'
                    ]
                  )}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                >
                  Why?
                </button>
              </div>
              <div style={{ borderLeft: '2px solid var(--border-slate)', paddingLeft: '14px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-dark)', textTransform: 'uppercase' }}>Audience Compiled</div>
                <h4 style={{ fontSize: '16px', margin: '4px 0 8px 0' }}>{campaign.audience.name}</h4>
                <div style={{ display: 'flex', gap: '32px', margin: '12px 0' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dark)' }}>Audience Count</div>
                    <div style={{ fontSize: '15px', fontWeight: 600 }}>{campaign.audience.customerCount} customers</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dark)' }}>Avg. Spend</div>
                    <div style={{ fontSize: '15px', fontWeight: 600 }}>₹2,300</div>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  <strong>Explainability:</strong> {campaign.audience.reasoning}
                </p>
              </div>
            </div>
          )}

          {/* Strategy Card */}
          {campaign.strategy && (
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>⚡</span>
                  <strong style={{ fontSize: '15px' }}>Strategy Agent</strong>
                </div>
                <button 
                  onClick={() => triggerExplain(
                    'Strategy Rationale', 
                    'Why did the system select these variables?', 
                    [
                      'WhatsApp offers direct interactive messaging which dormant mobile-users respond to best.',
                      'The 15% discount matches the median threshold for activation based on category elasticity.',
                      'Broadcast time is optimized for user engagement based on order history.'
                    ]
                  )}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                >
                  Why?
                </button>
              </div>
              <div style={{ borderLeft: '2px solid var(--border-slate)', paddingLeft: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', margin: '12px 0' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dark)' }}>Recommended Channel</div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--info-blue)' }}>📱 {campaign.strategy.channel}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dark)' }}>Recommended Offer</div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--success-green)' }}>🏷️ {campaign.strategy.offer}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dark)' }}>Recommended Timing</div>
                    <div style={{ fontSize: '15px', fontWeight: 600 }}>⏰ {campaign.strategy.timing}</div>
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '12px' }}>
                  <div><strong>Channel:</strong> {campaign.strategy.reasoning.channelReason}</div>
                  <div><strong>Offer:</strong> {campaign.strategy.reasoning.offerReason}</div>
                </div>
              </div>
            </div>
          )}

          {/* Content Card with WhatsApp Mock */}
          {campaign.content && (
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>✉️</span>
                  <strong style={{ fontSize: '15px' }}>Content Agent</strong>
                </div>
                <button 
                  onClick={() => triggerExplain(
                    'Content Copy Elements', 
                    'What makes this content design convert?', 
                    [
                      'Starts with a warm personalized salutation (Sarah 👋).',
                      'Maintains a conversational, non-pushy voice.',
                      'Contains a clear call-to-action (CTA) to direct navigation.'
                    ]
                  )}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                >
                  Why?
                </button>
              </div>
              <div style={{ borderLeft: '2px solid var(--border-slate)', paddingLeft: '14px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-dark)', textTransform: 'uppercase', marginBottom: '10px' }}>Content Strategy</div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '12px' }}>
                    {campaign.content.reasoning}
                  </p>
                  <div style={{ fontSize: '13px' }}>
                    <strong>CTA:</strong> <span style={{ color: 'var(--primary-gold)' }}>{campaign.content.cta}</span>
                  </div>
                </div>
                
                {/* Phone mockup */}
                <div style={{
                  width: '240px',
                  background: '#0d1117',
                  border: '8px solid #30363d',
                  borderRadius: '24px',
                  padding: '12px',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
                  position: 'relative'
                }}>
                  <div style={{ width: '80px', height: '14px', background: '#30363d', borderRadius: '0 0 10px 10px', position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}></div>
                  <div style={{ background: '#075e54', padding: '6px', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#128c7e' }}></div>
                    <span style={{ fontSize: '10px', fontWeight: 'bold' }}>WhatsApp Business</span>
                  </div>
                  <div style={{ background: '#efe9e4', padding: '8px', minHeight: '130px', borderRadius: '0 0 8px 8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{
                      background: '#fff',
                      color: '#000',
                      borderRadius: '8px',
                      padding: '8px',
                      fontSize: '11px',
                      boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
                      lineHeight: '1.4'
                    }}>
                      {campaign.content.body}
                    </div>
                    <div style={{ fontSize: '9px', color: '#128c7e', textDecoration: 'underline', alignSelf: 'flex-start', marginLeft: '4px' }}>
                      👉 {campaign.content.cta}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Campaign Summary Card */}
          <div className="glass-card animate-slide-up" style={{ border: '1px solid rgba(245, 158, 11, 0.35)', background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.03) 0%, rgba(2, 6, 23, 0.7) 100%)', marginTop: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Campaign Overview</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-dark)' }}>Audience Pool</div>
                <div style={{ fontSize: '15px', fontWeight: 600 }}>{campaign.audience?.customerCount || 0} customers</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-dark)' }}>Recommended Channel</div>
                <div style={{ fontSize: '15px', fontWeight: 600 }}>{campaign.strategy?.channel}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-dark)' }}>Est. Revenue Potential</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--primary-gold)' }}>₹{opp?.estimatedRevenue.toLocaleString() || '0'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-dark)' }}>Confidence Score</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--success-green)' }}>82%</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                onClick={handleLaunch}
                disabled={launching || campaign.status !== 'draft'}
                style={{
                  flex: 1,
                  background: launching || campaign.status !== 'draft' ? 'var(--bg-slate-700)' : 'var(--gradient-primary)',
                  color: launching || campaign.status !== 'draft' ? 'var(--text-muted)' : '#000',
                  border: 'none',
                  padding: '14px 20px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: launching || campaign.status !== 'draft' ? 'not-allowed' : 'pointer',
                  boxShadow: launching || campaign.status !== 'draft' ? 'none' : 'var(--gold-glow)'
                }}
              >
                {launching ? 'Launching Campaign...' : campaign.status !== 'draft' ? 'Campaign Deployed' : '🚀 Launch Campaign Now'}
              </button>
              {campaign.status === 'active' && (
                <button
                  onClick={() => router.push(`/analytics/${campaign.id}`)}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    color: 'var(--text-white)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '14px 24px',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  View Live Analytics
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* EXPLAINABILITY SLIDE-OUT PANEL */}
      <div 
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          width: '420px',
          height: '100vh',
          background: '#0b1329',
          borderLeft: '1px solid var(--border-slate)',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
          zIndex: 1000,
          padding: '32px 24px',
          transform: explainPanel.open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary-gold)', fontWeight: 600 }}>
              🧠 Decision Trace
            </span>
            <button 
              onClick={() => setExplainPanel(prev => ({ ...prev, open: false }))}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '18px', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>{explainPanel.title}</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', fontStyle: 'italic' }}>
            "{explainPanel.question}"
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {explainPanel.points.map((pt, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px' }}>
                <span style={{ color: 'var(--primary-gold)', fontSize: '14px' }}>✦</span>
                <p style={{ fontSize: '13px', color: 'var(--text-white)', lineHeight: 1.5 }}>{pt}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-slate)', paddingTop: '16px', fontSize: '12px', color: 'var(--text-dark)' }}>
          Trace compiled by CampaignOS Decision Engine v1
        </div>
      </div>
    </div>
  );
}
