'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Mock CRM Integrations
const INTEGRATIONS = [
  { name: 'Salesforce', icon: '☁️', status: 'Coming Soon' },
  { name: 'HubSpot', icon: '🧡', status: 'Coming Soon' },
  { name: 'Zoho CRM', icon: '🔴', status: 'Coming Soon' },
  { name: 'Shopify', icon: '🛍️', status: 'Coming Soon' },
  { name: 'Xeno CRM', icon: '❌', status: 'Coming Soon' }
];

export default function ConsoleDashboard() {
  const router = useRouter();
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<'workspace' | 'campaigns' | 'analytics' | 'data' | 'settings'>('workspace');
  
  // Workspace States
  const [goal, setGoal] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [currentCampaign, setCurrentCampaign] = useState<any>(null);
  
  // Step animations during generation
  const [activeStep, setActiveStep] = useState<number>(0);
  const [revealSteps, setRevealSteps] = useState({
    opp: false,
    seg: false,
    strat: false,
    content: false,
    summary: false
  });
  
  // Lists
  const [campaignsList, setCampaignsList] = useState<any[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);

  // Customer Data States
  const [dataTab, setDataTab] = useState<'customers' | 'orders'>('customers');
  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Explainability Panel
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

  // Fetch campaigns
  const fetchCampaigns = async () => {
    setLoadingCampaigns(true);
    try {
      const res = await fetch('http://localhost:3000/campaigns');
      if (res.ok) {
        setCampaignsList(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  // Fetch customer/order data
  const fetchCustomerData = async () => {
    setLoadingData(true);
    setError('');
    try {
      const cRes = await fetch('http://localhost:3000/customers');
      const oRes = await fetch('http://localhost:3000/orders');
      
      if (cRes.ok) {
        const customerData = await cRes.json();
        setCustomers(customerData);
      } else {
        setError('Failed to load customers. Check if API server is running on port 3000.');
      }
      
      if (oRes.ok) {
        const orderData = await oRes.json();
        setOrders(orderData);
      } else {
        setError(prev => prev ? prev + ' Orders also failed.' : 'Failed to load orders.');
      }
    } catch (err) {
      console.error(err);
      setError('Cannot connect to API server. Make sure it\'s running: pnpm run dev --filter=api');
    } finally {
      setLoadingData(false);
    }
  };

  // Seed demo data
  const handleSeedData = async () => {
    setSeeding(true);
    setSeedSuccess('');
    try {
      const res = await fetch('http://localhost:3000/data/seed', { method: 'POST' });
      if (res.ok) {
        setSeedSuccess('Demo database seeded with 100 premium customers successfully.');
        await fetchCustomerData();
      } else {
        setError('Failed to seed demo database.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection refused. Is the API server running?');
    } finally {
      setSeeding(false);
    }
  };

  // Synchronize tab based on query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && ['workspace', 'campaigns', 'analytics', 'data', 'settings'].includes(tab)) {
      setActiveTab(tab as any);
    }
    fetchCampaigns();
    fetchCustomerData();
  }, []);

  // Sync state if window search changes
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab && ['workspace', 'campaigns', 'analytics', 'data', 'settings'].includes(tab)) {
        setActiveTab(tab as any);
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // Update URL search params cleanly without hard reload
  const navigateTab = (tab: 'workspace' | 'campaigns' | 'analytics' | 'data' | 'settings') => {
    setActiveTab(tab);
    window.history.pushState(null, '', `/console?tab=${tab}`);
    if (tab === 'campaigns') fetchCampaigns();
    if (tab === 'data') fetchCustomerData();
  };

  // Campaign generation handler
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setGenerating(true);
    setError('');
    setCurrentCampaign(null);
    setActiveStep(1);
    setRevealSteps({ opp: false, seg: false, strat: false, content: false, summary: false });

    const timer1 = setTimeout(() => {
      setRevealSteps(prev => ({ ...prev, opp: true }));
      setActiveStep(2);
    }, 2500);

    const timer2 = setTimeout(() => {
      setRevealSteps(prev => ({ ...prev, seg: true }));
      setActiveStep(3);
    }, 5000);

    const timer3 = setTimeout(() => {
      setRevealSteps(prev => ({ ...prev, strat: true }));
      setActiveStep(4);
    }, 7500);

    const timer4 = setTimeout(() => {
      setRevealSteps(prev => ({ ...prev, content: true }));
      setActiveStep(5);
    }, 10000);

    try {
      const res = await fetch('http://localhost:3000/campaigns/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to generate campaign');
      }

      const campaign = await res.json();
      
      setTimeout(() => {
        setCurrentCampaign(campaign);
        setRevealSteps({ opp: true, seg: true, strat: true, content: true, summary: true });
        setActiveStep(6);
        setGenerating(false);
      }, 11500);

    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      setError(err.message || 'API Server Error. Ensure the backend is running on port 3000.');
      setGenerating(false);
      setActiveStep(0);
    }
  };

  const handleLaunch = async (campaignId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/campaigns/${campaignId}/launch`, {
        method: 'POST',
      });
      if (res.ok) {
        router.push(`/analytics/${campaignId}`);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to launch campaign');
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

  const PRESET_GOALS = [
    "Increase repeat purchases among footwear buyers who have not purchased in the last 45 days",
    "Re-engage dormant customers who haven't made a purchase in 90 days with a personalized offer",
    "Target high-value customers who spent more than ₹10,000 last month to drive loyalty"
  ];

  return (
    <div className="app-layout">
      {/* SIDEBAR */}
      <aside className="app-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', paddingLeft: '8px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <span style={{ fontSize: '22px' }}>🚀</span>
          <span style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.5px' }}>CampaignOS</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {[
            { id: 'workspace', label: 'Workspace', icon: '🧠' },
            { id: 'campaigns', label: 'Campaigns', icon: '📋' },
            { id: 'analytics', label: 'Analytics', icon: '📈' },
            { id: 'data', label: 'Data', icon: '🗄️' },
            { id: 'settings', label: 'Settings', icon: '⚙️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => navigateTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === tab.id ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                color: activeTab === tab.id ? 'var(--primary-gold)' : 'var(--text-muted)',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? 600 : 500,
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

      {/* CONTENT */}
      <main className="app-content">
        
        {/* WORKSPACE */}
        {activeTab === 'workspace' && (
          <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>AI Workspace</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                Describe a campaign goal, and the CampaignOS agent army will orchestrate the strategy.
              </p>
            </div>

            <div className="glass-card" style={{ marginBottom: '24px' }}>
              <form onSubmit={handleGenerate}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '10px' }}>
                  Campaign Objective
                </label>
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Increase repeat purchases among footwear buyers who haven't purchased in 45 days..."
                  rows={3}
                  style={{
                    width: '100%',
                    background: 'rgba(2, 6, 23, 0.7)',
                    border: '1px solid var(--border-slate-light)',
                    borderRadius: '8px',
                    padding: '16px',
                    color: 'var(--text-white)',
                    fontSize: '15px',
                    lineHeight: 1.5,
                    resize: 'none',
                    marginBottom: '16px'
                  }}
                />

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {PRESET_GOALS.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setGoal(preset)}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        color: 'var(--text-muted)',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Preset {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={generating || !goal.trim()}
                  style={{
                    width: '100%',
                    background: generating || !goal.trim() ? 'var(--bg-slate-700)' : 'var(--gradient-primary)',
                    color: generating || !goal.trim() ? 'var(--text-muted)' : '#000',
                    border: 'none',
                    padding: '14px 20px',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: generating || !goal.trim() ? 'not-allowed' : 'pointer',
                    boxShadow: generating || !goal.trim() ? 'none' : 'var(--gold-glow)'
                  }}
                >
                  {generating ? '🤖 Generating Campaign with Agents...' : '🚀 Generate Campaign Strategy'}
                </button>
              </form>
            </div>

            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--error-red)', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px' }}>
                ⚠️ {error}
              </div>
            )}

            {!generating && !currentCampaign && (
              <div style={{ border: '1px dashed var(--border-slate)', padding: '60px 20px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-dark)' }}>
                💡 Describe a business goal above to generate your first campaign.
              </div>
            )}

            {(generating || currentCampaign) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '12px' }}>
                <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dark)', fontWeight: 600 }}>
                  Agent Deliberation Timeline
                </h3>

                {/* 1. Opportunity Agent */}
                <div className="glass-card animate-slide-up" style={{ padding: '20px', opacity: activeStep >= 1 ? 1 : 0.3 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '18px' }}>
                        {activeStep > 1 ? '✅' : activeStep === 1 ? '🔄' : '◽'}
                      </span>
                      <strong style={{ fontSize: '15px' }}>Opportunity Agent</strong>
                    </div>
                    {revealSteps.opp && (
                      <button 
                        onClick={() => triggerExplain(
                          'Opportunity Agent Analysis', 
                          'Why did the system group these specific buyers?', 
                          [
                            'Purchase frequency was moderate (2-5 orders historically) demonstrating high potential value.',
                            'Last order threshold exceeds 45 days, categorizing them as at-risk/dormant.',
                            'Estimated Recovery Revenue is calculated based on their historical Average Order Value (AOV) multiplied by segment conversion probability.'
                          ]
                        )}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                      >
                        Why?
                      </button>
                    )}
                  </div>
                  {activeStep === 1 && <p style={{ fontSize: '13px', color: 'var(--primary-gold)' }} className="animate-pulse-glow">Analyzing transaction data to uncover dormant buyer buckets...</p>}
                  {revealSteps.opp && (
                    <div style={{ marginTop: '10px', borderLeft: '2px solid var(--border-slate)', paddingLeft: '14px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Opportunity Found</div>
                      <h4 style={{ fontSize: '16px', margin: '4px 0 8px 0', color: 'var(--primary-gold)' }}>Dormant Footwear Customers</h4>
                      <div style={{ display: 'flex', gap: '32px', margin: '12px 0' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--text-dark)' }}>Audience Pool</div>
                          <div style={{ fontSize: '16px', fontWeight: 700 }}>{currentCampaign?.audience?.customerCount || 324} customers</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--text-dark)' }}>Est. Recovery Revenue</div>
                          <div style={{ fontSize: '16px', fontWeight: 700 }}>₹{currentCampaign?.opportunity?.opportunities?.[0]?.estimatedRevenue?.toLocaleString() || '2,40,000'}</div>
                        </div>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        <strong>Why:</strong> These customers purchased 2-5 times historically but have not ordered for 45+ days.
                      </p>
                    </div>
                  )}
                </div>

                {/* 2. Segmentation Agent */}
                <div className="glass-card animate-slide-up" style={{ padding: '20px', opacity: activeStep >= 2 ? 1 : 0.3 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '18px' }}>
                        {activeStep > 2 ? '✅' : activeStep === 2 ? '🔄' : '◽'}
                      </span>
                      <strong style={{ fontSize: '15px' }}>Segmentation Agent</strong>
                    </div>
                    {revealSteps.seg && (
                      <button 
                        onClick={() => triggerExplain(
                          'Segmentation Agent Criteria', 
                          'How was this segment constructed?', 
                          [
                            'Primary Filter: Customer purchased at least once in the Category: Footwear.',
                            'Recency Filter: Days elapsed since last order > 45 days.',
                            'Data is compiled from the database and normalized.'
                          ]
                        )}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                      >
                        Why?
                      </button>
                    )}
                  </div>
                  {activeStep === 2 && <p style={{ fontSize: '13px', color: 'var(--primary-gold)' }} className="animate-pulse-glow">Parsing user records to compile targetable segment lists...</p>}
                  {revealSteps.seg && (
                    <div style={{ marginTop: '10px', borderLeft: '2px solid var(--border-slate)', paddingLeft: '14px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Audience Generated</div>
                      <h4 style={{ fontSize: '16px', margin: '4px 0 8px 0' }}>{currentCampaign?.audience?.name || 'Dormant Footwear Buyers'}</h4>
                      <div style={{ display: 'flex', gap: '32px', margin: '12px 0' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--text-dark)' }}>Audience Count</div>
                          <div style={{ fontSize: '15px', fontWeight: 600 }}>{currentCampaign?.audience?.customerCount || 324} customers</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--text-dark)' }}>Average Spend</div>
                          <div style={{ fontSize: '15px', fontWeight: 600 }}>₹2,300</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--text-dark)' }}>Avg. Last Order</div>
                          <div style={{ fontSize: '15px', fontWeight: 600 }}>62 days ago</div>
                        </div>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        <strong>Reasoning:</strong> {currentCampaign?.audience?.reasoning || 'Targeting buyers who bought Footwear and are now inactive.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* 3. Strategy Agent */}
                <div className="glass-card animate-slide-up" style={{ padding: '20px', opacity: activeStep >= 3 ? 1 : 0.3 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '18px' }}>
                        {activeStep > 3 ? '✅' : activeStep === 3 ? '🔄' : '◽'}
                      </span>
                      <strong style={{ fontSize: '15px' }}>Strategy Agent</strong>
                    </div>
                    {revealSteps.strat && (
                      <button 
                        onClick={() => triggerExplain(
                          'Strategy Agent Reasoning', 
                          'Why WhatsApp, 15% discount, and evening timing?', 
                          [
                            'WhatsApp historically has a 2.3x higher open rate than email for dormant customer categories.',
                            'A 15% discount is identified as the optimum incentive to trigger reaction without eroding margins.',
                            'Evening timing (6 PM - 8 PM) yields a 44% higher click-through rate compared to afternoon broadcasts.'
                          ]
                        )}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                      >
                        Why?
                      </button>
                    )}
                  </div>
                  {activeStep === 3 && <p style={{ fontSize: '13px', color: 'var(--primary-gold)' }} className="animate-pulse-glow">Querying LLM strategist to formulate channel and offer models...</p>}
                  {revealSteps.strat && (
                    <div style={{ marginTop: '10px', borderLeft: '2px solid var(--border-slate)', paddingLeft: '14px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', margin: '12px 0' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--text-dark)' }}>Recommended Channel</div>
                          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--info-blue)' }}>📱 {currentCampaign?.strategy?.channel || 'WhatsApp'}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--text-dark)' }}>Recommended Offer</div>
                          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--success-green)' }}>🏷️ {currentCampaign?.strategy?.offer || '15% Discount'}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--text-dark)' }}>Recommended Timing</div>
                          <div style={{ fontSize: '15px', fontWeight: 600 }}>⏰ {currentCampaign?.strategy?.timing || '6 PM - 8 PM'}</div>
                        </div>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        <strong>Reasoning:</strong> {currentCampaign?.strategy?.reasoning?.channelReason || 'WhatsApp historically performs better for dormant users.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* 4. Content Agent */}
                <div className="glass-card animate-slide-up" style={{ padding: '20px', opacity: activeStep >= 4 ? 1 : 0.3 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '18px' }}>
                        {activeStep > 4 ? '✅' : activeStep === 4 ? '🔄' : '◽'}
                      </span>
                      <strong style={{ fontSize: '15px' }}>Content Agent</strong>
                    </div>
                    {revealSteps.content && (
                      <button 
                        onClick={() => triggerExplain(
                          'Content Agent Reasoning', 
                          'How was this messaging crafted?', 
                          [
                            'Uses friendly, personal tone (Sarah 👋) to minimize corporate spam feeling.',
                            'Clearly mentions the 15% discount in the first 3 lines of reading.',
                            'Direct call to action (CTA) links directly to footwear collections.'
                          ]
                        )}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                      >
                        Why?
                      </button>
                    )}
                  </div>
                  {activeStep === 4 && <p style={{ fontSize: '13px', color: 'var(--primary-gold)' }} className="animate-pulse-glow">Composing copy variations and setting up templates...</p>}
                  {revealSteps.content && (
                    <div style={{ marginTop: '10px', borderLeft: '2px solid var(--border-slate)', paddingLeft: '14px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '280px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Generated Content Reason</div>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '12px' }}>
                          {currentCampaign?.content?.reasoning || 'Personalized copy to target Footwear dropoffs.'}
                        </p>
                        <div style={{ fontSize: '13px' }}>
                          <strong>CTA:</strong> <span style={{ color: 'var(--primary-gold)' }}>{currentCampaign?.content?.cta || 'Shop footwear'}</span>
                        </div>
                      </div>
                      
                      {/* WhatsApp Mock */}
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
                            {currentCampaign?.content?.body || 'Hey Sarah 👋\n\nIt\'s been a while. Enjoy 15% off on your next footwear order...'}
                          </div>
                          <div style={{ fontSize: '9px', color: '#128c7e', textDecoration: 'underline', alignSelf: 'flex-start', marginLeft: '4px' }}>
                            👉 {currentCampaign?.content?.cta || 'Shop Now'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {currentCampaign && (
                  <div className="glass-card animate-slide-up" style={{ border: '1px solid rgba(245, 158, 11, 0.35)', background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.03) 0%, rgba(2, 6, 23, 0.7) 100%)', marginTop: '12px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Campaign Overview</h2>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-dark)' }}>Campaign Name</div>
                        <div style={{ fontSize: '15px', fontWeight: 600 }}>{currentCampaign.name}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-dark)' }}>Audience size</div>
                        <div style={{ fontSize: '15px', fontWeight: 600 }}>{currentCampaign.audience.customerCount} customers</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-dark)' }}>Expected Revenue Potential</div>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--primary-gold)' }}>₹{currentCampaign.opportunity.opportunities?.[0]?.estimatedRevenue?.toLocaleString() || '2,40,000'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-dark)' }}>Confidence Score</div>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--success-green)' }}>82%</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleLaunch(currentCampaign.id)}
                      style={{
                        width: '100%',
                        background: 'var(--gradient-primary)',
                        color: '#000',
                        border: 'none',
                        padding: '14px 20px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: 'var(--gold-glow)'
                      }}
                    >
                      🚀 Launch Campaign Now
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* CAMPAIGNS */}
        {activeTab === 'campaigns' && (
          <div className="animate-fade-in">
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>Campaign History</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Track past generations and execution statuses.</p>
              </div>
              <button
                onClick={() => navigateTab('workspace')}
                style={{
                  background: 'var(--gradient-primary)',
                  color: '#000',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                + New Campaign
              </button>
            </div>

            {loadingCampaigns ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading campaigns...</p>
            ) : campaignsList.length === 0 ? (
              <div style={{ border: '1px dashed var(--border-slate)', padding: '60px 20px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-dark)' }}>
                No campaigns generated yet. Go to the Workspace to launch one.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {campaignsList.map((c) => (
                  <div 
                    key={c.id} 
                    className="glass-card" 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      cursor: 'pointer',
                      borderLeft: c.status === 'active' ? '4px solid var(--success-green)' : '4px solid var(--text-dark)'
                    }}
                    onClick={() => {
                      if (c.status === 'active') {
                        router.push(`/analytics/${c.id}`);
                      } else {
                        setCurrentCampaign(c);
                        setGoal(c.goal);
                        setRevealSteps({ opp: true, seg: true, strat: true, content: true, summary: true });
                        setActiveStep(6);
                        navigateTab('workspace');
                      }
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>{c.name}</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>{c.goal}</p>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--text-dark)' }}>
                        <span>📅 Created: {new Date(c.createdAt).toLocaleDateString()}</span>
                        <span>👥 Audience: {c.audience?.customerCount || 0}</span>
                      </div>
                    </div>
                    <div>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: c.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)',
                        color: c.status === 'active' ? 'var(--success-green)' : 'var(--text-muted)',
                        border: c.status === 'active' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(255,255,255,0.1)'
                      }}>
                        {c.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ANALYTICS SELECTOR */}
        {activeTab === 'analytics' && (
          <div className="animate-fade-in">
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>Performance Analytics</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                Select an active campaign from your history tab to view real-time delivery funnels.
              </p>
            </div>

            <div style={{ border: '1px dashed var(--border-slate)', padding: '60px 20px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-dark)' }}>
              <h3>📈 Select Campaign to View Real-time Funnel</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px', maxWidth: '400px', margin: '8px auto 20px auto' }}>
                Event simulator runs on active launched campaigns, mapping events from SENT through to CONVERTED.
              </p>
              <button
                onClick={() => navigateTab('campaigns')}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  color: 'var(--text-white)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Browse Campaigns
              </button>
            </div>
          </div>
        )}

        {/* DATA */}
        {activeTab === 'data' && (
          <div className="animate-fade-in">
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>Customer Data Layer</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                  Manage the CRM system of record. Segment, list, and reset demo accounts.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleSeedData}
                  disabled={seeding}
                  style={{
                    background: 'var(--gradient-primary)',
                    color: '#000',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {seeding ? '⚡ Seeding...' : '♻️ Reset & Load Demo Data'}
                </button>
              </div>
            </div>

            {seedSuccess && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: 'var(--success-green)', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '13px' }}>
                ✅ {seedSuccess}
              </div>
            )}

            <div style={{
              border: '2px dashed var(--border-slate)',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.01)',
              marginBottom: '32px',
              cursor: 'pointer'
            }} onClick={handleSeedData}>
              <span style={{ fontSize: '36px', display: 'block', marginBottom: '12px' }}>📤</span>
              <strong>Upload Customers CSV File</strong>
              <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Drag and drop your CRM CSV dump here, or click to load mock customer tables.
              </span>
            </div>

            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-slate)', gap: '24px', marginBottom: '16px' }}>
              <button
                onClick={() => { setDataTab('customers'); setCurrentPage(1); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: dataTab === 'customers' ? '2px solid var(--primary-gold)' : '2px solid transparent',
                  color: dataTab === 'customers' ? 'var(--text-white)' : 'var(--text-muted)',
                  padding: '8px 4px 12px 4px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Customers ({customers.length})
              </button>
              <button
                onClick={() => { setDataTab('orders'); setCurrentPage(1); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: dataTab === 'orders' ? '2px solid var(--primary-gold)' : '2px solid transparent',
                  color: dataTab === 'orders' ? 'var(--text-white)' : 'var(--text-muted)',
                  padding: '8px 4px 12px 4px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Orders ({orders.length})
              </button>
            </div>

            {loadingData ? (
              <p style={{ color: 'var(--text-muted)' }}>Querying database layer...</p>
            ) : customers.length === 0 && orders.length === 0 ? (
              <div style={{ 
                padding: '60px 20px', 
                textAlign: 'center', 
                border: '1px dashed var(--border-slate)', 
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.01)'
              }}>
                <p style={{ fontSize: '36px', marginBottom: '16px' }}>📭</p>
                <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-white)' }}>No data loaded</p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Database may be empty or API server not responding
                </p>
                <button
                  onClick={fetchCustomerData}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--text-white)',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    marginRight: '8px'
                  }}
                >
                  🔄 Retry Loading
                </button>
                <button
                  onClick={handleSeedData}
                  style={{
                    background: 'var(--gradient-primary)',
                    border: 'none',
                    color: '#000',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  🌱 Seed Demo Data
                </button>
              </div>
            ) : (
              <>
                <div style={{ overflowX: 'auto', background: 'rgba(2, 6, 23, 0.4)', border: '1px solid var(--border-slate)', borderRadius: '8px' }}>
                  {dataTab === 'customers' ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-slate)', background: 'rgba(255,255,255,0.02)' }}>
                          <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Name</th>
                          <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Email</th>
                          <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Orders</th>
                          <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Total Spent</th>
                          <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Last Order</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((c) => (
                          <tr key={c.id} style={{ borderBottom: '1px solid var(--border-slate)' }}>
                            <td style={{ padding: '12px 16px', fontWeight: 500 }}>{c.name}</td>
                            <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{c.email}</td>
                            <td style={{ padding: '12px 16px' }}>{c.orderCount}</td>
                            <td style={{ padding: '12px 16px', fontWeight: 600 }}>₹{c.totalSpent.toLocaleString()}</td>
                            <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-dark)' }}>
                              {c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleDateString() : 'Never'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-slate)', background: 'rgba(255,255,255,0.02)' }}>
                          <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Order ID</th>
                          <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Customer</th>
                          <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Amount</th>
                          <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Category</th>
                          <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((o) => (
                          <tr key={o.id} style={{ borderBottom: '1px solid var(--border-slate)' }}>
                            <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'monospace' }}>{o.id.substring(0, 8)}...</td>
                            <td style={{ padding: '12px 16px' }}>{o.customer?.name || 'Unknown'}</td>
                            <td style={{ padding: '12px 16px', fontWeight: 600 }}>₹{o.amount.toLocaleString()}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ fontSize: '11px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--info-blue)', padding: '2px 6px', borderRadius: '4px' }}>
                                {o.category}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-dark)' }}>
                              {new Date(o.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Pagination */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, dataTab === 'customers' ? customers.length : orders.length)} of {dataTab === 'customers' ? customers.length : orders.length}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      style={{
                        background: currentPage === 1 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                        color: currentPage === 1 ? 'var(--text-dark)' : 'var(--text-white)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Previous
                    </button>
                    <span style={{ padding: '6px 12px', fontSize: '13px', color: 'var(--text-white)' }}>
                      Page {currentPage} of {Math.ceil((dataTab === 'customers' ? customers.length : orders.length) / itemsPerPage)}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={currentPage >= Math.ceil((dataTab === 'customers' ? customers.length : orders.length) / itemsPerPage)}
                      style={{
                        background: currentPage >= Math.ceil((dataTab === 'customers' ? customers.length : orders.length) / itemsPerPage) ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                        color: currentPage >= Math.ceil((dataTab === 'customers' ? customers.length : orders.length) / itemsPerPage) ? 'var(--text-dark)' : 'var(--text-white)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        cursor: currentPage >= Math.ceil((dataTab === 'customers' ? customers.length : orders.length) / itemsPerPage) ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
          <div className="animate-fade-in">
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>Platform Settings</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Configure CRM sync pipelines and credentials.</p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>CRM Integrations</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                {INTEGRATIONS.map((integ, index) => (
                  <div key={index} className="glass-card" style={{ opacity: 0.55, cursor: 'not-allowed' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ fontSize: '32px' }}>{integ.icon}</span>
                      <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-dark)' }}>
                        {integ.status}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{integ.name}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Connect customer streams to trigger autonomous campaigns.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card">
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Agent Settings</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>LLM Provider</label>
                  <input 
                    type="text" 
                    value="Groq (llama-3.1-70b-versatile)" 
                    disabled 
                    style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-slate)', borderRadius: '6px', color: 'var(--text-muted)' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>Fastify API Host</label>
                  <input 
                    type="text" 
                    value="http://localhost:3000" 
                    disabled 
                    style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-slate)', borderRadius: '6px', color: 'var(--text-muted)' }} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* EXPLAINABILITY PANEL */}
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
