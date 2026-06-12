'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CampaignAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 3000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`http://localhost:3000/campaigns/${id}/analytics`);
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
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
        Loading Campaign Analytics...
      </div>
    );
  }

  if (!analytics) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <p style={{ color: 'var(--error-red)' }}>Campaign Analytics not found.</p>
        <button 
          onClick={() => router.push('/')}
          style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-white)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
        >
          Back to Workspace
        </button>
      </div>
    );
  }

  const { metrics, successScore, insights, topPerformingChannel, funnel, avgRevenue, campaignName, status, audienceSize } = analytics;

  // Check if events are still being generated
  const hasNoEvents = metrics.sent === 0;
  const isGenerating = status === 'active' && metrics.sent < audienceSize;

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
            { id: 'workspace', label: 'Workspace', icon: '🧠', active: false },
            { id: 'campaigns', label: 'Campaigns', icon: '📋', active: false },
            { id: 'analytics', label: 'Analytics', icon: '📈', active: true },
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

      {/* ANALYTICS WRAPPER */}
      <main className="app-content" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--success-green)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              ⚡ Live Campaign execution
            </span>
            <h1 style={{ fontSize: '26px', fontWeight: 700 }}>{campaignName}</h1>
          </div>
          <button
            onClick={() => router.push(`/campaign/${params.id}`)}
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
            ← Workspace Details
          </button>
        </div>

        {/* Show warning if no events or events are still being generated */}
        {hasNoEvents && (
          <div className="glass-card" style={{ 
            marginBottom: '24px', 
            background: 'rgba(245, 158, 11, 0.08)', 
            border: '1px solid rgba(245, 158, 11, 0.3)',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: 'var(--primary-gold)' }}>
                  Events are being generated
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  The channel service is processing messages. Analytics will appear shortly. This page auto-refreshes every 3 seconds.
                  <br/><br/>
                  <strong>Make sure the channel service is running:</strong> <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '3px' }}>pnpm run dev --filter=channel-service</code>
                </p>
              </div>
            </div>
          </div>
        )}

        {isGenerating && !hasNoEvents && (
          <div className="glass-card" style={{ 
            marginBottom: '24px', 
            background: 'rgba(59, 130, 246, 0.08)', 
            border: '1px solid rgba(59, 130, 246, 0.3)',
            padding: '12px 16px'
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span className="animate-pulse-glow" style={{ fontSize: '16px' }}>⏳</span>
              <p style={{ fontSize: '13px', color: 'var(--info-blue)' }}>
                Campaign in progress: {metrics.sent} / {audienceSize} messages sent. Analytics will continue updating in real-time.
              </p>
            </div>
          </div>
        )}

        {/* 1. INSIGHTS FIRST PANEL */}
        <div className="glass-card" style={{ border: '1px solid rgba(16, 185, 129, 0.25)', background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.02) 0%, rgba(2, 6, 23, 0.6) 100%)', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dark)', marginBottom: '16px' }}>Campaign Outcome Insights</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-dark)' }}>Revenue Generated</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary-gold)' }}>₹{metrics.revenue.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-dark)' }}>Conversion Rate</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--success-green)' }}>
                {funnel?.overallConversion.toFixed(1) || '0'}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-dark)' }}>Best Performing Audience</div>
              <div style={{ fontSize: '15px', fontWeight: 600, marginTop: '4px' }}>Dormant Footwear Buyers</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-dark)' }}>Best Channel</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--info-blue)', marginTop: '4px' }}>📱 {topPerformingChannel}</div>
            </div>
          </div>
        </div>

        {/* 2. REAL-TIME LIVE COUNTERS */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dark)' }}>
              Real-time Delivery Events
            </h2>
            <span style={{ fontSize: '11px', color: 'var(--text-dark)' }} className="animate-pulse-glow">
              🔄 Auto-refreshing every 3s
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
            {[
              { label: 'Sent', count: metrics.sent, color: 'var(--text-white)' },
              { label: 'Delivered', count: metrics.delivered, color: 'var(--info-blue)' },
              { label: 'Read', count: metrics.read, color: 'var(--primary-gold)' },
              { label: 'Clicked', count: metrics.clicked, color: 'var(--accent-orange)' },
              { label: 'Converted', count: metrics.converted, color: 'var(--success-green)' }
            ].map((cnt, i) => (
              <div key={i} className="glass-card" style={{ padding: '16px', textAlign: 'center', background: 'rgba(2, 6, 23, 0.4)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-dark)', textTransform: 'uppercase', marginBottom: '6px' }}>{cnt.label}</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: cnt.color, textShadow: '0 0 10px rgba(255,255,255,0.05)' }}>
                  {cnt.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. CONVERSION FUNNEL */}
        <div className="glass-card" style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dark)', marginBottom: '20px' }}>
            Conversion Funnel Analysis
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Delivery Rate', value: funnel?.deliveryRate, count: metrics.delivered, total: metrics.sent, desc: 'Percent of sent messages successfully received by client carriers.' },
              { label: 'Open Rate', value: funnel?.openRate, count: metrics.read, total: metrics.delivered, desc: 'Percent of delivered messages opened and read by the user.' },
              { label: 'Click Rate', value: funnel?.clickRate, count: metrics.clicked, total: metrics.read, desc: 'Percent of opened messages where the call-to-action link was tapped.' },
              { label: 'Conversion Rate', value: funnel?.conversionRate, count: metrics.converted, total: metrics.clicked, desc: 'Percent of clickers who completed a checkout purchase.' }
            ].map((stage, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ width: '140px', fontWeight: 600, fontSize: '13px' }}>{stage.label}</div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ height: '8px', background: 'var(--bg-slate-800)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{
                      width: `${stage.value || 0}%`,
                      height: '100%',
                      background: stage.value > 70 ? 'var(--success-green)' : stage.value > 40 ? 'var(--primary-gold)' : 'var(--error-red)',
                      borderRadius: '4px',
                      transition: 'width 0.4s ease-in-out'
                    }} />
                  </div>
                </div>
                <div style={{ width: '80px', textAlign: 'right', fontWeight: 700, fontSize: '14px' }}>
                  {stage.value ? stage.value.toFixed(1) : '0.0'}%
                </div>
                <div style={{ width: '90px', fontSize: '11px', color: 'var(--text-dark)', textAlign: 'right' }}>
                  {stage.count} / {stage.total}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. AI INSIGHTS BLOCK */}
        {insights && insights.length > 0 && (
          <div className="glass-card" style={{ borderLeft: '4px solid var(--info-blue)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dark)' }}>
                💡 AI-Powered Insights
              </h2>
              <button 
                onClick={() => triggerExplain(
                  'AI Performance Evaluation', 
                  'How does the system evaluate execution data?', 
                  [
                    'Compares active campaign click-through rates against historical averages for the Footwear category.',
                    'Correlates WhatsApp delivery events with typical carrier latencies.',
                    'Formulates revenue acceleration recommendations using current conversion velocities.'
                  ]
                )}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
              >
                Why?
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {insights.map((insight: string, i: number) => (
                <div key={i} style={{ 
                  padding: '12px', 
                  background: 'rgba(255,255,255,0.02)', 
                  borderRadius: '6px',
                  fontSize: '13px',
                  lineHeight: 1.4,
                  border: '1px solid rgba(255,255,255,0.04)'
                }}>
                  {insight}
                </div>
              ))}
            </div>
          </div>
        )}
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
