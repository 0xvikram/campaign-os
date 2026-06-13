'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ==========================================
// BRAND LOGO & BRAND CARD ICONS (SVG)
// ==========================================

const SalesforceIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: '26px', height: '26px' }} fill="#00A1E0">
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
  </svg>
);

const HubSpotIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: '26px', height: '26px' }} fill="#FF7A59">
    <path d="M21.2 10.5c-.3 0-.6.1-.9.2L12.5 3c.4-.5.6-1.1.6-1.8 0-1.2-1-2.2-2.2-2.2S8.7 1 8.7 2.2c0 .7.3 1.3.7 1.8L4.2 9.4c-.2-.1-.5-.2-.7-.2C1.6 9.2.6 10.2.6 11.4s1 2.2 2.2 2.2c.4 0 .7-.1 1-.2l2.3 5.4c-.4.5-.6 1.1-.6 1.8 0 1.2 1 2.2 2.2 2.2s2.2-1 2.2-2.2c0-.7-.3-1.3-.7-1.8l3.1-4.7c.3.1.6.1.9.1 1.2 0 2.2-1 2.2-2.2s-1-2.2-2.2-2.2c-.3 0-.6.1-.9.2L10.3 6.7c.4-.5.6-1.1.6-1.8 0-.4-.1-.8-.3-1.2L16 11.2c-.1.3-.2.6-.2.9 0 1.2 1 2.2 2.2 2.2s2.2-1 2.2-2.2c0-1.2-1-2.2-2.2-2.2c-.3 0-.6.1-.9.2l-4-5.9c.7-.6 1.1-1.5 1.1-2.5 0-1.2-1-2.2-2.2-2.2s-2.2 1-2.2 2.2c0 .9.5 1.7 1.1 2.2L9.2 11c-.3-.1-.6-.2-.9-.2-1.2 0-2.2 1-2.2 2.2s1 2.2 2.2 2.2c.5 0 .9-.2 1.2-.4l2.1 3.2c-.6.5-1 1.3-1 2.2 0 1.2 1 2.2 2.2 2.2s2.2-1 2.2-2.2c0-.9-.4-1.7-1-2.2l4.8-7.2c.3.1.6.2.9.2 1.2 0 2.2-1 2.2-2.2s-1-2.1-2.2-2.1z" />
  </svg>
);

const ZohoIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: '26px', height: '26px' }}>
    <rect x="2" y="2" width="9" height="9" fill="#F44336" rx="1.5" />
    <rect x="13" y="2" width="9" height="9" fill="#4CAF50" rx="1.5" />
    <rect x="2" y="13" width="9" height="9" fill="#2196F3" rx="1.5" />
    <rect x="13" y="13" width="9" height="9" fill="#FFEB3B" rx="1.5" />
  </svg>
);

const ShopifyIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: '26px', height: '26px' }} fill="#96BF48">
    <path d="M19.8 5.4l-3-3.6c-.3-.4-.7-.6-1.2-.6H8.4c-.5 0-.9.2-1.2.6l-3 3.6c-.2.2-.3.5-.3.8v13.2c0 1 .8 1.8 1.8 1.8h13.2c1 0 1.8-.8 1.8-1.8V6.2c.1-.3 0-.6-.2-.8zM12 2c.6 0 1.1.5 1.1 1.1v1.1h-2.2v-1.1c0-.6.5-1.1 1.1-1.1zm4.8 12.6c-.4 1.1-1.3 1.9-2.5 2.2-.4.1-.8.2-1.3.2H11c-.5 0-.9-.1-1.3-.2-1.2-.3-2.1-1.1-2.5-2.2-.2-.5-.3-1.1-.3-1.7V9.3h2v3.8c0 .8.6 1.4 1.4 1.4h3.4c.8 0 1.4-.6 1.4-1.4V9.3h2v3.6c0 .6-.1 1.2-.3 1.7z" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }} fill="#25d366">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.324 5.328 0 11.859 0c3.166.001 6.141 1.236 8.377 3.474 2.235 2.237 3.469 5.214 3.467 8.381-.003 6.536-5.328 11.86-11.859 11.86h-.001c-2.013 0-3.992-.512-5.748-1.488L0 24zm6.549-3.791c1.554.922 3.19 1.411 4.887 1.412 5.568 0 10.103-4.52 10.106-10.093.002-2.701-1.048-5.242-2.956-7.153-1.908-1.91-4.446-2.962-7.149-2.964-5.572 0-10.11 4.52-10.113 10.094-.001 1.884.5 3.716 1.453 5.352L1.892 21.5l4.714-1.291zm10.745-7.469c-.294-.148-1.743-.86-2.012-.958-.268-.098-.463-.148-.659.148-.196.295-.758.958-.929 1.154-.172.196-.343.221-.637.074-.294-.148-1.243-.458-2.37-1.462-.877-.782-1.47-1.748-1.642-2.044-.172-.295-.018-.455.129-.601.132-.132.294-.344.441-.516.147-.172.196-.295.294-.491.098-.197.049-.369-.024-.516-.074-.148-.659-1.591-.902-2.174-.237-.568-.479-.491-.659-.5-.172-.008-.368-.01-.564-.01-.196 0-.515.074-.784.369-.269.295-1.03 1.008-1.03 2.458s1.054 2.852 1.201 3.049c.147.197 2.075 3.169 5.027 4.442.702.302 1.25.483 1.677.619.706.224 1.348.193 1.856.117.566-.085 1.743-.712 1.988-1.4 0-.148.049-.295.074-.492.098-.196-.049-.294-.148-.442z" />
  </svg>
);

const PushIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const SmsIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M8 10h.01" />
    <path d="M12 10h.01" />
    <path d="M16 10h.01" />
  </svg>
);

const SunIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const OpportunityIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '22px', height: '22px' }}>
    <circle cx="12" cy="12" r="10" strokeDasharray="3 3" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path d="M2 12h20" />
    <circle cx="12" cy="12" r="3" fill="var(--primary-green)" stroke="none" />
  </svg>
);

const AudienceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '22px', height: '22px' }}>
    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z" />
    <path d="M6 21a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v12a3 3 0 0 0 3 3z" />
    <circle cx="12" cy="12" r="2.5" fill="var(--primary-green)" stroke="none" />
    <line x1="9" y1="12" x2="15" y2="12" />
  </svg>
);

const GeneratorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '22px', height: '22px' }}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="var(--primary-green)" stroke="none" opacity="0.3" />
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    <circle cx="13" cy="2" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="11" cy="22" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const ExecutionIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '22px', height: '22px' }}>
    <circle cx="12" cy="5" r="3" />
    <circle cx="5" cy="19" r="3" />
    <circle cx="19" cy="19" r="3" />
    <path d="M12 8v8M5 16l7-8 7 8" />
    <circle cx="12" cy="12" r="2" fill="var(--primary-green)" stroke="none" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <circle cx="12" cy="4" r="1.5" fill="var(--primary-green)" stroke="none" />
  </svg>
);

const AutomationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    <circle cx="12" cy="12" r="1.5" fill="var(--primary-green)" stroke="none" />
  </svg>
);

const IntegrationsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    <circle cx="12" cy="12" r="2" fill="var(--primary-green)" stroke="none" />
  </svg>
);

const EnterpriseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <circle cx="12" cy="12" r="2.5" fill="var(--primary-green)" stroke="none" />
  </svg>
);

const AcmeLogo = () => (
  <svg viewBox="0 0 120 30" style={{ height: '24px', fill: 'currentColor' }}>
    <polygon points="10,5 20,23 2,23" />
    <text x="28" y="19" style={{ fontFamily: 'var(--font-geist-sans), sans-serif', fontWeight: 800, fontSize: '13px', letterSpacing: '0.5px' }}>ACME CORP</text>
  </svg>
);

const GlobexLogo = () => (
  <svg viewBox="0 0 120 30" style={{ height: '24px', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5' }}>
    <circle cx="12" cy="15" r="8" />
    <path d="M4,15 h16 M12,7 v16" />
    <text x="28" y="19" style={{ fontFamily: 'var(--font-geist-sans), sans-serif', fontWeight: 800, fontSize: '12px', letterSpacing: '0.8px', fill: 'currentColor', stroke: 'none' }}>GLOBEX</text>
  </svg>
);

const InitechLogo = () => (
  <svg viewBox="0 0 120 30" style={{ height: '24px', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5' }}>
    <rect x="4" y="6" width="16" height="16" rx="2" />
    <line x1="4" y1="14" x2="20" y2="14" />
    <text x="28" y="19" style={{ fontFamily: 'var(--font-geist-sans), sans-serif', fontWeight: 800, fontSize: '12px', letterSpacing: '0.5px', fill: 'currentColor', stroke: 'none' }}>INITECH</text>
  </svg>
);

const VertigoLogo = () => (
  <svg viewBox="0 0 120 30" style={{ height: '24px', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5' }}>
    <path d="M 4 15 C 8 7, 16 7, 20 15 C 16 23, 8 23, 4 15" />
    <circle cx="12" cy="15" r="2.5" fill="currentColor" stroke="none" />
    <text x="28" y="19" style={{ fontFamily: 'var(--font-geist-sans), sans-serif', fontWeight: 800, fontSize: '12px', fill: 'currentColor', stroke: 'none' }}>VERTIGO</text>
  </svg>
);

const SpheruleLogo = () => (
  <svg viewBox="0 0 120 30" style={{ height: '24px', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5' }}>
    <circle cx="12" cy="15" r="7" />
    <circle cx="12" cy="15" r="3" fill="currentColor" stroke="none" />
    <text x="28" y="19" style={{ fontFamily: 'var(--font-geist-sans), sans-serif', fontWeight: 800, fontSize: '12px', fill: 'currentColor', stroke: 'none' }}>SPHERULE</text>
  </svg>
);

const UmbrellaLogo = () => (
  <svg viewBox="0 0 120 30" style={{ height: '24px', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5' }}>
    <polygon points="12,5 20,10 20,20 12,25 4,20 4,10" />
    <line x1="12" y1="5" x2="12" y2="25" />
    <line x1="4" y1="10" x2="20" y2="20" />
    <line x1="4" y1="20" x2="20" y2="10" />
    <text x="28" y="19" style={{ fontFamily: 'var(--font-geist-sans), sans-serif', fontWeight: 800, fontSize: '12px', fill: 'currentColor', stroke: 'none' }}>UMBRELLA</text>
  </svg>
);

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default function MarketingHome() {
  const router = useRouter();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [seeding, setSeeding] = useState(false);
  const [seedError, setSeedError] = useState('');
  const [sandboxGoal, setSandboxGoal] = useState('');
  
  // Interactive Flow States for "See CampaignOS in Action"
  const [flowState, setFlowState] = useState<'idle' | 'analyzing' | 'segmenting' | 'creating' | 'completed'>('completed');
  const [inputVal, setInputVal] = useState('Find customers likely to churn and launch a retention campaign');

  // Initialize theme from storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('campaignos-theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Seed DB & launch dashboard action
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

  // Toggle Theme
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('campaignos-theme', nextTheme);
  };

  // Run the step-by-step flowchart animation
  const triggerFlowAnimation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    
    setFlowState('analyzing');
    
    setTimeout(() => {
      setFlowState('segmenting');
    }, 1200);

    setTimeout(() => {
      setFlowState('creating');
    }, 2400);

    setTimeout(() => {
      setFlowState('completed');
    }, 3600);
  };

  return (
    <div className={`landing-page-root ${theme}-theme`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      
      {/* ==========================================
         DECORATIVE RADIAL GLOW BLOB LAYERS & FLOATING PARTICLES (stripe/vercel inspired)
         ========================================== */}
      {theme === 'dark' && (
        <>
          {/* Radial Glow Blobs */}
          <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(118, 207, 31, 0.09) 0%, transparent 70%)', filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0 }} />
          <div style={{ position: 'absolute', top: '25%', left: '10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(30, 77, 143, 0.08) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
          <div style={{ position: 'absolute', top: '55%', right: '5%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(118, 207, 31, 0.06) 0%, transparent 70%)', filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0 }} />
          <div style={{ position: 'absolute', top: '80%', left: '20%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(30, 77, 143, 0.07) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

          {/* Floating animated particles */}
          <div className="particle-a" style={{ position: 'absolute', top: '12%', left: '15%', width: '5px', height: '5px', borderRadius: '50%', background: '#72FFAB', boxShadow: '0 0 10px #72FFAB', pointerEvents: 'none', zIndex: 1 }} />
          <div className="particle-b" style={{ position: 'absolute', top: '28%', right: '12%', width: '4px', height: '4px', borderRadius: '50%', background: '#36A3FF', boxShadow: '0 0 8px #36A3FF', pointerEvents: 'none', zIndex: 1 }} />
          <div className="particle-c" style={{ position: 'absolute', top: '48%', left: '8%', width: '5px', height: '5px', borderRadius: '50%', background: '#72FFAB', boxShadow: '0 0 10px #72FFAB', pointerEvents: 'none', zIndex: 1 }} />
          <div className="particle-a" style={{ position: 'absolute', top: '68%', right: '18%', width: '6px', height: '6px', borderRadius: '50%', background: '#36A3FF', boxShadow: '0 0 12px #36A3FF', pointerEvents: 'none', zIndex: 1 }} />
          <div className="particle-b" style={{ position: 'absolute', top: '88%', left: '18%', width: '5px', height: '5px', borderRadius: '50%', background: '#72FFAB', boxShadow: '0 0 10px #72FFAB', pointerEvents: 'none', zIndex: 1 }} />
        </>
      )}
      {/* ==========================================
         STICKY HEADER / NAVIGATION BAR
         ========================================== */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: theme === 'dark' ? 'rgba(3, 7, 18, 0.75)' : 'rgba(255, 255, 255, 0.82)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-primary)',
        padding: '16px 0',
        transition: 'background-color 0.4s ease, border-color 0.4s ease'
      }}>
        <div className="l-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              height: '44px',
              width: '140px',
              overflow: 'hidden'
            }} 
            onClick={() => router.push('/')}
          >
            <img 
              src="/logo-white.png" 
              alt="CampaignOS Logo" 
              style={{ 
                height: '220px', 
                width: '220px',
                marginTop: '-88px',
                marginBottom: '-88px',
                marginLeft: '-40px',
                marginRight: '-40px',
                filter: 'var(--logo-filter)', 
                transition: 'filter 0.4s ease',
                objectFit: 'contain',
                display: 'block'
              }} 
            />
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <a href="#features" style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>Features</a>
            <a href="#integrations" style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>Integrations</a>
            <a href="#how-it-works" style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>AI Agents</a>
            <a href="#pricing" style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>Pricing</a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Resources <ChevronDownIcon />
            </div>
          </nav>

          {/* Header Action Items */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <a 
              href="/console?tab=campaigns" 
              style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600 }}
            >
              Log in
            </a>
            <button 
              onClick={() => router.push('/console')}
              className="l-btn-primary"
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                height: '38px',
                boxShadow: theme === 'dark' ? '0 0 15px rgba(34, 197, 94, 0.3)' : 'none'
              }}
            >
              Start Free Trial
            </button>
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s ease',
                padding: 0
              }}
              aria-label="Toggle theme"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* ==========================================
         HERO SECTION WITH DIAGRAM
         ========================================== */}
      <section className="l-hero-section" style={{ padding: '80px 0 60px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="l-container" style={{ textAlign: 'center', position: 'relative', zIndex: 5 }}>
          
          {/* Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: theme === 'dark' ? 'rgba(34, 197, 94, 0.08)' : 'rgba(34, 197, 94, 0.06)',
              border: '1px solid var(--border-accent)',
              borderRadius: '100px',
              color: 'var(--primary-green)',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.3px'
            }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }}></span>
              AI-Powered Campaign Intelligence
            </div>
          </div>
          
          {/* Headline */}
          <h1 style={{ 
            fontSize: '56px', 
            fontWeight: 850, 
            lineHeight: 1.15, 
            marginBottom: '20px', 
            letterSpacing: '-1.5px',
            color: 'var(--text-primary)',
            maxWidth: '800px',
            margin: '0 auto 20px auto'
          }}>
            Connect Any CRM.<br />
            Launch <span style={{ color: 'var(--primary-green)' }}>Smarter Campaigns.</span>
          </h1>
          
          {/* Subtitle */}
          <p style={{ 
            fontSize: '18px', 
            color: 'var(--text-secondary)', 
            lineHeight: 1.6, 
            marginBottom: '36px',
            maxWidth: '620px',
            margin: '0 auto 36px auto'
          }}>
            CampaignOS uses AI to find opportunities, understand your audience, and launch personalized campaigns that drive real revenue.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '60px' }}>
            <button 
              onClick={handleStartWithDemo}
              disabled={seeding}
              className="l-btn-primary"
              style={{
                padding: '14px 28px',
                fontSize: '16px',
                borderRadius: '8px',
                boxShadow: theme === 'dark' ? 'var(--shadow-glow)' : 'none'
              }}
            >
              {seeding ? '⚡ Initializing Demo...' : 'Start Free Trial'}
            </button>
            <button 
              onClick={() => router.push('/console?tab=data')}
              className="l-btn-secondary"
              style={{
                padding: '14px 28px',
                fontSize: '16px',
                borderRadius: '8px',
              }}
            >
              Book a Demo
            </button>
          </div>

          {seedError && (
            <div style={{ 
              display: 'inline-block', 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.15)', 
              color: 'var(--error-red)', 
              padding: '8px 16px', 
              borderRadius: '8px', 
              fontSize: '13px',
              marginBottom: '30px'
            }}>
              ⚠️ {seedError}
            </div>
          )}

          {/* ==========================================
             HERO DIAGRAM: SVG + MOTION PARTICLES
             ========================================== */}
          <div 
            className="l-card" 
            style={{ 
              maxWidth: '960px', 
              margin: '0 auto', 
              padding: '40px 20px', 
              overflow: 'hidden',
              background: theme === 'dark' ? 'rgba(7, 10, 20, 0.4)' : '#ffffff',
              boxShadow: theme === 'dark' ? 'inset 0 1px 0 rgba(255,255,255,0.05), var(--shadow-card)' : 'var(--shadow-card)'
            }}
          >
            {/* SVG Diagram Canvas */}
            <svg 
              viewBox="0 0 1000 580" 
              style={{ width: '100%', height: 'auto', display: 'block' }}
            >
              <defs>
                {/* Glowing drop shadow filter */}
                <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {/* SVG gradient for paths */}
                <linearGradient id="gradient-line-left" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4FEA8E" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#4FEA8E" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="gradient-line-right" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4FEA8E" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#4FEA8E" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* ==========================================
                 SVG CONNECTING CURVES (BACKGROUND)
                 ========================================== */}
              <g>
                {/* Left CRM lines to center (500, 290) */}
                <path d="M 210,90 C 330,90 380,290 500,290" fill="none" stroke="url(#gradient-line-left)" strokeWidth="2.5" />
                <path d="M 210,215 C 330,215 380,290 500,290" fill="none" stroke="url(#gradient-line-left)" strokeWidth="2.5" />
                <path d="M 210,340 C 330,340 380,290 500,290" fill="none" stroke="url(#gradient-line-left)" strokeWidth="2.5" />
                <path d="M 210,465 C 330,465 380,290 500,290" fill="none" stroke="url(#gradient-line-left)" strokeWidth="2.5" />

                {/* Right center lines to channels (500, 290) */}
                <path d="M 500,290 C 620,290 670,90 790,90" fill="none" stroke="url(#gradient-line-right)" strokeWidth="2.5" />
                <path d="M 500,290 C 620,290 670,215 790,215" fill="none" stroke="url(#gradient-line-right)" strokeWidth="2.5" />
                <path d="M 500,290 C 620,290 670,340 790,340" fill="none" stroke="url(#gradient-line-right)" strokeWidth="2.5" />
                <path d="M 500,290 C 620,290 670,465 790,465" fill="none" stroke="url(#gradient-line-right)" strokeWidth="2.5" />
              </g>

              {/* ==========================================
                 GLOWING PARTICLES: ANIMATEMOTION
                 ========================================== */}
              <g>
                {/* Salesforce (Particle 1 & 2) */}
                <circle r="4.5" fill="#72FFAB" style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 8px #72FFAB) drop-shadow(0 0 15px #72FFAB) drop-shadow(0 0 25px rgba(114,255,171,0.8))' : 'drop-shadow(0 0 4px #4FEA8E)' }}>
                  <animateMotion dur="4s" repeatCount="indefinite" begin="0s" path="M 210,90 C 330,90 380,290 500,290" />
                </circle>
                <circle r="4.5" fill="#72FFAB" style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 8px #72FFAB) drop-shadow(0 0 15px #72FFAB) drop-shadow(0 0 25px rgba(114,255,171,0.8))' : 'drop-shadow(0 0 4px #4FEA8E)' }}>
                  <animateMotion dur="4s" repeatCount="indefinite" begin="2s" path="M 210,90 C 330,90 380,290 500,290" />
                </circle>

                {/* HubSpot (Particle 1 & 2) */}
                <circle r="4.5" fill="#72FFAB" style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 8px #72FFAB) drop-shadow(0 0 15px #72FFAB) drop-shadow(0 0 25px rgba(114,255,171,0.8))' : 'drop-shadow(0 0 4px #4FEA8E)' }}>
                  <animateMotion dur="3.2s" repeatCount="indefinite" begin="0s" path="M 210,215 C 330,215 380,290 500,290" />
                </circle>
                <circle r="4.5" fill="#72FFAB" style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 8px #72FFAB) drop-shadow(0 0 15px #72FFAB) drop-shadow(0 0 25px rgba(114,255,171,0.8))' : 'drop-shadow(0 0 4px #4FEA8E)' }}>
                  <animateMotion dur="3.2s" repeatCount="indefinite" begin="1.6s" path="M 210,215 C 330,215 380,290 500,290" />
                </circle>

                {/* Zoho (Particle 1 & 2) */}
                <circle r="4.5" fill="#72FFAB" style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 8px #72FFAB) drop-shadow(0 0 15px #72FFAB) drop-shadow(0 0 25px rgba(114,255,171,0.8))' : 'drop-shadow(0 0 4px #4FEA8E)' }}>
                  <animateMotion dur="4.8s" repeatCount="indefinite" begin="0s" path="M 210,340 C 330,340 380,290 500,290" />
                </circle>
                <circle r="4.5" fill="#72FFAB" style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 8px #72FFAB) drop-shadow(0 0 15px #72FFAB) drop-shadow(0 0 25px rgba(114,255,171,0.8))' : 'drop-shadow(0 0 4px #4FEA8E)' }}>
                  <animateMotion dur="4.8s" repeatCount="indefinite" begin="2.4s" path="M 210,340 C 330,340 380,290 500,290" />
                </circle>

                {/* Shopify (Particle 1 & 2) */}
                <circle r="4.5" fill="#72FFAB" style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 8px #72FFAB) drop-shadow(0 0 15px #72FFAB) drop-shadow(0 0 25px rgba(114,255,171,0.8))' : 'drop-shadow(0 0 4px #4FEA8E)' }}>
                  <animateMotion dur="3.6s" repeatCount="indefinite" begin="0s" path="M 210,465 C 330,465 380,290 500,290" />
                </circle>
                <circle r="4.5" fill="#72FFAB" style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 8px #72FFAB) drop-shadow(0 0 15px #72FFAB) drop-shadow(0 0 25px rgba(114,255,171,0.8))' : 'drop-shadow(0 0 4px #4FEA8E)' }}>
                  <animateMotion dur="3.6s" repeatCount="indefinite" begin="1.8s" path="M 210,465 C 330,465 380,290 500,290" />
                </circle>

                {/* Email (Particle 1 & 2) */}
                <circle r="4.5" fill="#72FFAB" style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 8px #72FFAB) drop-shadow(0 0 15px #72FFAB) drop-shadow(0 0 25px rgba(114,255,171,0.8))' : 'drop-shadow(0 0 4px #4FEA8E)' }}>
                  <animateMotion dur="3.8s" repeatCount="indefinite" begin="0s" path="M 500,290 C 620,290 670,90 790,90" />
                </circle>
                <circle r="4.5" fill="#72FFAB" style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 8px #72FFAB) drop-shadow(0 0 15px #72FFAB) drop-shadow(0 0 25px rgba(114,255,171,0.8))' : 'drop-shadow(0 0 4px #4FEA8E)' }}>
                  <animateMotion dur="3.8s" repeatCount="indefinite" begin="1.9s" path="M 500,290 C 620,290 670,90 790,90" />
                </circle>

                {/* WhatsApp (Particle 1 & 2) */}
                <circle r="4.5" fill="#72FFAB" style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 8px #72FFAB) drop-shadow(0 0 15px #72FFAB) drop-shadow(0 0 25px rgba(114,255,171,0.8))' : 'drop-shadow(0 0 4px #4FEA8E)' }}>
                  <animateMotion dur="4.4s" repeatCount="indefinite" begin="0s" path="M 500,290 C 620,290 670,215 790,215" />
                </circle>
                <circle r="4.5" fill="#72FFAB" style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 8px #72FFAB) drop-shadow(0 0 15px #72FFAB) drop-shadow(0 0 25px rgba(114,255,171,0.8))' : 'drop-shadow(0 0 4px #4FEA8E)' }}>
                  <animateMotion dur="4.4s" repeatCount="indefinite" begin="2.2s" path="M 500,290 C 620,290 670,215 790,215" />
                </circle>

                {/* Push (Particle 1 & 2) */}
                <circle r="4.5" fill="#72FFAB" style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 8px #72FFAB) drop-shadow(0 0 15px #72FFAB) drop-shadow(0 0 25px rgba(114,255,171,0.8))' : 'drop-shadow(0 0 4px #4FEA8E)' }}>
                  <animateMotion dur="3.4s" repeatCount="indefinite" begin="0s" path="M 500,290 C 620,290 670,340 790,340" />
                </circle>
                <circle r="4.5" fill="#72FFAB" style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 8px #72FFAB) drop-shadow(0 0 15px #72FFAB) drop-shadow(0 0 25px rgba(114,255,171,0.8))' : 'drop-shadow(0 0 4px #4FEA8E)' }}>
                  <animateMotion dur="3.4s" repeatCount="indefinite" begin="1.7s" path="M 500,290 C 620,290 670,340 790,340" />
                </circle>

                {/* SMS (Particle 1 & 2) */}
                <circle r="4.5" fill="#72FFAB" style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 8px #72FFAB) drop-shadow(0 0 15px #72FFAB) drop-shadow(0 0 25px rgba(114,255,171,0.8))' : 'drop-shadow(0 0 4px #4FEA8E)' }}>
                  <animateMotion dur="4.2s" repeatCount="indefinite" begin="0s" path="M 500,290 C 620,290 670,465 790,465" />
                </circle>
                <circle r="4.5" fill="#72FFAB" style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 8px #72FFAB) drop-shadow(0 0 15px #72FFAB) drop-shadow(0 0 25px rgba(114,255,171,0.8))' : 'drop-shadow(0 0 4px #4FEA8E)' }}>
                  <animateMotion dur="4.2s" repeatCount="indefinite" begin="2.1s" path="M 500,290 C 620,290 670,465 790,465" />
                </circle>
              </g>

              {/* ==========================================
                 LEFT COLUMN: CRM INTEGRATION CARDS
                 ========================================== */}
              <foreignObject x="10" y="50" width="200" height="80">
                <div className="l-glass-card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', height: '100%', border: '1px solid var(--border-primary)' }}>
                  <div style={{ background: theme === 'dark' ? 'rgba(0, 161, 224, 0.1)' : '#f0f9ff', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SalesforceIcon />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Salesforce</span>
                </div>
              </foreignObject>

              <foreignObject x="10" y="175" width="200" height="80">
                <div className="l-glass-card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', height: '100%', border: '1px solid var(--border-primary)' }}>
                  <div style={{ background: theme === 'dark' ? 'rgba(255, 122, 89, 0.1)' : '#fff8f6', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HubSpotIcon />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>HubSpot</span>
                </div>
              </foreignObject>

              <foreignObject x="10" y="300" width="200" height="80">
                <div className="l-glass-card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', height: '100%', border: '1px solid var(--border-primary)' }}>
                  <div style={{ background: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#fdfdfd', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ZohoIcon />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Zoho CRM</span>
                </div>
              </foreignObject>

              <foreignObject x="10" y="425" width="200" height="80">
                <div className="l-glass-card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', height: '100%', border: '1px solid var(--border-primary)' }}>
                  <div style={{ background: theme === 'dark' ? 'rgba(150, 191, 72, 0.1)' : '#f7fbf2', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShopifyIcon />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Shopify</span>
                </div>
              </foreignObject>

              {/* ==========================================
                 CENTER STAGE: CAMPAIGNOS ENGINE CARD
                 ========================================== */}
              <foreignObject x="270" y="40" width="460" height="500">
                <div 
                  className="l-card" 
                  style={{ 
                    height: '100%', 
                    position: 'relative', 
                    background: theme === 'dark' ? 'rgba(6, 10, 20, 0.72)' : '#ffffff',
                    border: theme === 'dark' ? '1px solid rgba(34, 197, 94, 0.18)' : '1px solid var(--border-primary)',
                    boxShadow: theme === 'dark' ? 'var(--shadow-glow)' : 'var(--shadow-card)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gridTemplateRows: '1fr 1fr',
                    gap: '120px 20px',
                    padding: '24px',
                    boxSizing: 'border-box'
                  }}
                >
                  
                  {/* Floating Stat 1: Audience Discovery */}
                  <div 
                    className="l-glass-card" 
                    style={{ 
                      padding: '16px', 
                      borderRadius: '12px', 
                      border: '1px solid var(--border-primary)',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      justifyContent: 'center'
                    }}
                  >
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Audience Discovery</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary-green)' }}>342</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>New Segments</span>
                    </div>
                  </div>

                  {/* Floating Stat 2: Opportunity Score */}
                  <div 
                    className="l-glass-card" 
                    style={{ 
                      padding: '16px', 
                      borderRadius: '12px', 
                      border: '1px solid var(--border-primary)',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      justifyContent: 'center'
                    }}
                  >
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Opportunity Score</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary-green)' }}>82</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>High Potential</span>
                    </div>
                  </div>

                  {/* Floating Stat 3: Campaign Generated */}
                  <div 
                    className="l-glass-card" 
                    style={{ 
                      padding: '16px', 
                      borderRadius: '12px', 
                      border: '1px solid var(--border-primary)',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      justifyContent: 'center'
                    }}
                  >
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Campaigns</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary-green)' }}>12</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>New Actions</span>
                    </div>
                  </div>

                  {/* Floating Stat 4: Intelligence Engine */}
                  <div 
                    className="l-glass-card" 
                    style={{ 
                      padding: '16px', 
                      borderRadius: '12px', 
                      border: '1px solid var(--border-primary)',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      justifyContent: 'center'
                    }}
                  >
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Intelligence Engine</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', animation: 'fade-in 1s ease infinite alternate' }}></span>
                      Analyzing 58.7k profiles
                    </span>
                  </div>

                  {/* Absolute Center Circle Logo & Glow Ring */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '140px',
                    height: '140px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {/* Rotating outer ring */}
                    <div 
                      className="l-animate-spin-slow"
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        border: '3px dashed var(--primary-green)',
                        opacity: 0.65,
                        boxShadow: '0 0 20px rgba(34, 197, 94, 0.15)'
                      }}
                    />
                    
                    {/* Rotating second ring with reverse direction */}
                    <div 
                      style={{
                        position: 'absolute',
                        width: '85%',
                        height: '85%',
                        borderRadius: '50%',
                        border: '2px solid rgba(34, 197, 94, 0.15)',
                        background: theme === 'dark' ? 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(34, 197, 94, 0.08) 0%, transparent 70%)'
                      }}
                    />
                    
                    {/* Solid Core circular container */}
                    <div style={{
                      position: 'absolute',
                      width: '74px',
                      height: '74px',
                      borderRadius: '50%',
                      background: theme === 'dark' ? '#090f1e' : '#ffffff',
                      border: '1px solid var(--border-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15), var(--shadow-glow)'
                    }}>
                      <img 
                        src="/logo-c.png" 
                        alt="CampaignOS Icon" 
                        style={{ width: '100px', height: '100px', objectFit: 'contain' }} 
                      />
                    </div>
                  </div>
                </div>
              </foreignObject>

              {/* ==========================================
                 RIGHT COLUMN: CHANNELS CARDS
                 ========================================== */}
              <foreignObject x="790" y="50" width="200" height="80">
                <div className="l-glass-card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', height: '100%', border: '1px solid var(--border-primary)' }}>
                  <div style={{ background: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : '#f0f6ff', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <EmailIcon />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Email</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Newsletter</span>
                  </div>
                </div>
              </foreignObject>

              <foreignObject x="790" y="175" width="200" height="80">
                <div className="l-glass-card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', height: '100%', border: '1px solid var(--border-primary)' }}>
                  <div style={{ background: theme === 'dark' ? 'rgba(37, 211, 102, 0.1)' : '#effbf3', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <WhatsAppIcon />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>WhatsApp</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Business</span>
                  </div>
                </div>
              </foreignObject>

              <foreignObject x="790" y="300" width="200" height="80">
                <div className="l-glass-card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', height: '100%', border: '1px solid var(--border-primary)' }}>
                  <div style={{ background: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : '#f0f6ff', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PushIcon />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Push</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Notifications</span>
                  </div>
                </div>
              </foreignObject>

              <foreignObject x="790" y="425" width="200" height="80">
                <div className="l-glass-card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', height: '100%', border: '1px solid var(--border-primary)' }}>
                  <div style={{ background: theme === 'dark' ? 'rgba(16, 185, 129, 0.1)' : '#effdf8', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SmsIcon />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>SMS</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Broadcasts</span>
                  </div>
                </div>
              </foreignObject>
            </svg>
          </div>
        </div>
      </section>

      {/* ==========================================
         SOCIAL PROOF: BRAND PARTNERS
         ========================================== */}
      <section id="integrations" style={{ 
        padding: '60px 0', 
        borderTop: '1px solid var(--border-primary)', 
        borderBottom: '1px solid var(--border-primary)', 
        background: theme === 'dark' ? 'rgba(7, 11, 20, 0.3)' : 'rgba(249, 250, 251, 0.6)',
        transition: 'background-color 0.4s ease, border-color 0.4s ease'
      }}>
        <div className="l-container" style={{ textAlign: 'center' }}>
          <span style={{ 
            fontSize: '13px', 
            textTransform: 'uppercase', 
            letterSpacing: '2px', 
            color: 'var(--text-muted)', 
            fontWeight: 700 
          }}>
            Trusted by growth teams worldwide
          </span>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '75px', 
            alignItems: 'center', 
            marginTop: '32px', 
            flexWrap: 'wrap',
            transition: 'color 0.3s ease'
          }}>
            {/* Acme Corp */}
            <div className="l-logo-hover">
              <AcmeLogo />
            </div>
            
            {/* Globex */}
            <div className="l-logo-hover">
              <GlobexLogo />
            </div>

            {/* Initech */}
            <div className="l-logo-hover">
              <InitechLogo />
            </div>

            {/* Vertigo */}
            <div className="l-logo-hover">
              <VertigoLogo />
            </div>

            {/* Spherule */}
            <div className="l-logo-hover">
              <SpheruleLogo />
            </div>

            {/* Umbrella */}
            <div className="l-logo-hover">
              <UmbrellaLogo />
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
         "AI THAT WORKS WHILE YOU SLEEP" SECTION
         ========================================== */}
      <section id="features" style={{ padding: '100px 0', position: 'relative' }}>
        <div className="l-container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span style={{ fontSize: '12px', color: 'var(--primary-green)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>AI-Native System</span>
            <h2 style={{ fontSize: '38px', fontWeight: 800, marginTop: '8px', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              AI That Works While You Sleep
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '560px', margin: '12px auto 0 auto', lineHeight: 1.6 }}>
              CampaignOS is your always-on growth engine — finding opportunities, creating campaigns, and driving results on autopilot.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            
            {/* Feature 1 */}
            <div className="l-card" style={{ padding: '30px' }}>
              <div style={{ 
                background: theme === 'dark' ? 'rgba(118, 207, 31, 0.06)' : 'rgba(118, 207, 31, 0.05)', 
                color: 'var(--primary-green)',
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                border: '1px solid var(--border-accent)',
                boxShadow: theme === 'dark' ? '0 0 10px rgba(118,207,31,0.1)' : 'none'
              }}>
                <OpportunityIcon />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>Opportunity Discovery</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                AI finds hidden revenue opportunities in your data. Scan and detect dormant customers or high-spending segments automatically.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="l-card" style={{ padding: '30px' }}>
              <div style={{ 
                background: theme === 'dark' ? 'rgba(118, 207, 31, 0.06)' : 'rgba(118, 207, 31, 0.05)', 
                color: 'var(--primary-green)',
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                border: '1px solid var(--border-accent)',
                boxShadow: theme === 'dark' ? '0 0 10px rgba(118,207,31,0.1)' : 'none'
              }}>
                <AudienceIcon />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>Audience Intelligence</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Auto-segment your audience based on behavior & intent. Build dynamic clusters without manually configuring rules or SQL.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="l-card" style={{ padding: '30px' }}>
              <div style={{ 
                background: theme === 'dark' ? 'rgba(118, 207, 31, 0.06)' : 'rgba(118, 207, 31, 0.05)', 
                color: 'var(--primary-green)',
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                border: '1px solid var(--border-accent)',
                boxShadow: theme === 'dark' ? '0 0 10px rgba(118,207,31,0.1)' : 'none'
              }}>
                <GeneratorIcon />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>Campaign Generator</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Create personalized campaigns that convert. Generates tailored copy, offers, and schedules for each separate audience bucket.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="l-card" style={{ padding: '30px' }}>
              <div style={{ 
                background: theme === 'dark' ? 'rgba(118, 207, 31, 0.06)' : 'rgba(118, 207, 31, 0.05)', 
                color: 'var(--primary-green)',
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                border: '1px solid var(--border-accent)',
                boxShadow: theme === 'dark' ? '0 0 10px rgba(118,207,31,0.1)' : 'none'
              }}>
                <ExecutionIcon />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>Autonomous Execution</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Launch across channels automatically. Distribute payloads directly to Email, WhatsApp, Push, or SMS with zero effort.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
         STATS & NUMBERS SECTION
         ========================================== */}
      <section style={{ 
        padding: '50px 0 70px 0', 
        borderTop: '1px solid var(--border-primary)',
        borderBottom: '1px solid var(--border-primary)',
        background: theme === 'dark' ? 'rgba(7, 11, 20, 0.2)' : 'rgba(249, 250, 251, 0.4)',
        transition: 'background-color 0.4s ease, border-color 0.4s ease'
      }}>
        <div className="l-container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-around', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '40px',
            textAlign: 'center'
          }}>
            {/* Stat 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '48px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-1.5px' }}>60x</span>
                <span style={{ color: 'var(--primary-green)', fontSize: '20px' }}>▲</span>
              </div>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '4px' }}>ROI on Marketing Spends</span>
            </div>

            {/* Stat 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '48px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-1.5px' }}>12%</span>
                <span style={{ color: 'var(--primary-green)', fontSize: '20px' }}>▲</span>
              </div>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '4px' }}>Repeat Sales</span>
            </div>

            {/* Stat 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '48px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-1.5px' }}>15%</span>
                <span style={{ color: '#ef4444', fontSize: '20px' }}>▼</span>
              </div>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '4px' }}>Reduction in Single-Visit</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
         "SEE CAMPAIGNOS IN ACTION" INTERACTIVE WIDGET
         ========================================== */}
      <section id="how-it-works" style={{ 
        padding: '100px 0', 
        borderTop: '1px solid var(--border-primary)',
        background: theme === 'dark' ? 'rgba(5, 8, 16, 0.5)' : 'rgba(249, 250, 251, 0.3)',
        transition: 'background-color 0.4s ease, border-color 0.4s ease'
      }}>
        <div className="l-container">
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '40px', alignItems: 'center' }}>
            
            {/* Left Box: Text + Prompt Input Form */}
            <div>
              <span style={{ fontSize: '12px', color: 'var(--primary-green)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Interactive Sandbox</span>
              <h2 style={{ fontSize: '36px', fontWeight: 800, marginTop: '8px', color: 'var(--text-primary)', lineHeight: 1.15, letterSpacing: '-0.8px' }}>
                See CampaignOS in Action
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '16px', marginBottom: '28px', lineHeight: 1.6 }}>
                Tell the AI what you want to achieve. We'll build the campaign for you. Type your marketing goal below to test the agent engine.
              </p>

              <form onSubmit={triggerFlowAnimation} style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                <textarea 
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="e.g. Find customers likely to churn and launch a retention campaign..."
                  style={{
                    width: '100%',
                    height: '90px',
                    background: theme === 'dark' ? 'rgba(3, 7, 18, 0.6)' : '#ffffff',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    lineHeight: 1.5,
                    resize: 'none',
                    boxShadow: 'var(--shadow-card)'
                  }}
                />
                <button 
                  type="submit"
                  className="l-btn-primary"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    alignSelf: 'flex-start',
                    boxShadow: theme === 'dark' ? '0 4px 15px rgba(34, 197, 94, 0.2)' : 'none'
                  }}
                >
                  Generate Campaign ⚡
                </button>
              </form>
            </div>

            {/* Right Box: Dynamic Progress Flowchart & Connected Channels */}
            <div 
              className="l-card" 
              style={{ 
                padding: '30px 20px', 
                background: theme === 'dark' ? 'rgba(7, 10, 20, 0.6)' : '#ffffff',
                border: '1px solid var(--border-primary)'
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px', color: 'var(--text-primary)' }}>
                {flowState === 'completed' ? 'AI Campaign Output Generated' : 'AI is building your campaign...'}
              </h3>
              
              {/* Flowchart SVG */}
              <svg viewBox="0 0 540 280" style={{ width: '100%', height: 'auto', display: 'block' }}>
                <defs>
                  {/* Glowing Filter */}
                  <filter id="neon-glow-flow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id="flow-line" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4FEA8E" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#4FEA8E" stopOpacity="0.5" />
                  </linearGradient>
                </defs>

                {/* Connecting lines from Checklist to Channels */}
                <g>
                  <path d="M 270,40 C 340,40 370,50 435,50" fill="none" stroke="url(#flow-line)" strokeWidth="2.2" />
                  <path d="M 270,100 C 340,100 370,115 435,115" fill="none" stroke="url(#flow-line)" strokeWidth="2.2" />
                  <path d="M 270,160 C 340,160 370,180 435,180" fill="none" stroke="url(#flow-line)" strokeWidth="2.2" />
                  <path d="M 270,220 C 340,220 370,245 435,245" fill="none" stroke="url(#flow-line)" strokeWidth="2.2" />
                </g>

                {/* Animated Particles flowing on lines */}
                {flowState === 'completed' && (
                  <g>
                    <circle r="4" fill="#72FFAB" style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 8px #72FFAB) drop-shadow(0 0 15px #72FFAB) drop-shadow(0 0 25px rgba(114,255,171,0.8))' : 'drop-shadow(0 0 4px #4FEA8E)' }}>
                      <animateMotion dur="2.4s" repeatCount="indefinite" path="M 270,40 C 340,40 370,50 435,50" />
                    </circle>
                    <circle r="4" fill="#72FFAB" style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 8px #72FFAB) drop-shadow(0 0 15px #72FFAB) drop-shadow(0 0 25px rgba(114,255,171,0.8))' : 'drop-shadow(0 0 4px #4FEA8E)' }}>
                      <animateMotion dur="3s" repeatCount="indefinite" path="M 270,100 C 340,100 370,115 435,115" />
                    </circle>
                    <circle r="4" fill="#72FFAB" style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 8px #72FFAB) drop-shadow(0 0 15px #72FFAB) drop-shadow(0 0 25px rgba(114,255,171,0.8))' : 'drop-shadow(0 0 4px #4FEA8E)' }}>
                      <animateMotion dur="2.6s" repeatCount="indefinite" path="M 270,160 C 340,160 370,180 435,180" />
                    </circle>
                    <circle r="4" fill="#72FFAB" style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 8px #72FFAB) drop-shadow(0 0 15px #72FFAB) drop-shadow(0 0 25px rgba(114,255,171,0.8))' : 'drop-shadow(0 0 4px #4FEA8E)' }}>
                      <animateMotion dur="2.8s" repeatCount="indefinite" path="M 270,220 C 340,220 370,245 435,245" />
                    </circle>
                  </g>
                )}

                {/* Checklist Column (Left) */}
                
                {/* Step 1: Analyzing customer data */}
                <foreignObject x="10" y="20" width="260" height="42">
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: flowState !== 'analyzing' ? 'var(--text-primary)' : 'var(--primary-green)'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: flowState === 'analyzing' ? 'transparent' : 'rgba(34, 197, 94, 0.12)',
                      border: flowState === 'analyzing' ? '2px solid var(--primary-green)' : '1px solid var(--border-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary-green)'
                    }}>
                      {flowState !== 'analyzing' ? <CheckIcon /> : <span style={{ width: '4px', height: '4px', background: '#22c55e', borderRadius: '50%' }}></span>}
                    </div>
                    Analyzing customer data
                  </div>
                </foreignObject>

                {/* Step 2: Identifying at-risk customers */}
                <foreignObject x="10" y="80" width="260" height="42">
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: flowState === 'analyzing' ? 'var(--text-muted)' : flowState === 'segmenting' ? 'var(--primary-green)' : 'var(--text-primary)'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: flowState === 'analyzing' ? 'transparent' : flowState === 'segmenting' ? 'transparent' : 'rgba(34, 197, 94, 0.12)',
                      border: flowState === 'analyzing' ? '1px solid var(--border-primary)' : flowState === 'segmenting' ? '2px solid var(--primary-green)' : '1px solid var(--border-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary-green)'
                    }}>
                      {flowState === 'analyzing' ? null : flowState === 'segmenting' ? <span style={{ width: '4px', height: '4px', background: '#22c55e', borderRadius: '50%' }}></span> : <CheckIcon />}
                    </div>
                    Identifying at-risk customers
                  </div>
                </foreignObject>

                {/* Step 3: Creating campaign */}
                <foreignObject x="10" y="140" width="260" height="42">
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: (flowState === 'analyzing' || flowState === 'segmenting') ? 'var(--text-muted)' : flowState === 'creating' ? 'var(--primary-green)' : 'var(--text-primary)'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: (flowState === 'analyzing' || flowState === 'segmenting') ? 'transparent' : flowState === 'creating' ? 'transparent' : 'rgba(34, 197, 94, 0.12)',
                      border: (flowState === 'analyzing' || flowState === 'segmenting') ? '1px solid var(--border-primary)' : flowState === 'creating' ? '2px solid var(--primary-green)' : '1px solid var(--border-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary-green)'
                    }}>
                      {(flowState === 'analyzing' || flowState === 'segmenting') ? null : flowState === 'creating' ? <span style={{ width: '4px', height: '4px', background: '#22c55e', borderRadius: '50%' }}></span> : <CheckIcon />}
                    </div>
                    Creating campaign
                  </div>
                </foreignObject>

                {/* Step 4: Launching across channels */}
                <foreignObject x="10" y="200" width="260" height="42">
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: flowState !== 'completed' ? 'var(--text-muted)' : 'var(--text-primary)'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: flowState !== 'completed' ? 'transparent' : 'rgba(34, 197, 94, 0.12)',
                      border: flowState !== 'completed' ? '1px solid var(--border-primary)' : '1px solid var(--border-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary-green)'
                    }}>
                      {flowState !== 'completed' ? null : <CheckIcon />}
                    </div>
                    Launching across channels
                  </div>
                </foreignObject>

                {/* Connected Channels Column (Right) */}
                <foreignObject x="435" y="25" width="90" height="46">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--bg-primary)' }}>
                    <EmailIcon />
                  </div>
                </foreignObject>

                <foreignObject x="435" y="90" width="90" height="46">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--bg-primary)' }}>
                    <WhatsAppIcon />
                  </div>
                </foreignObject>

                <foreignObject x="435" y="155" width="90" height="46">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--bg-primary)' }}>
                    <PushIcon />
                  </div>
                </foreignObject>

                <foreignObject x="435" y="220" width="90" height="46">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--bg-primary)' }}>
                    <SmsIcon />
                  </div>
                </foreignObject>
              </svg>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
         "EVERYTHING YOU NEED TO GROW" ROW
         ========================================== */}
      <section style={{ padding: '80px 0', borderTop: '1px solid var(--border-primary)' }}>
        <div className="l-container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              Everything you need to grow
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            {/* Card 1 */}
            <div className="l-card" style={{ padding: '24px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ 
                background: theme === 'dark' ? 'rgba(118, 207, 31, 0.08)' : 'rgba(118, 207, 31, 0.05)', 
                color: 'var(--primary-green)',
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-accent)',
                boxShadow: theme === 'dark' ? '0 0 10px rgba(118,207,31,0.1)' : 'none',
                flexShrink: 0
              }}>
                <AnalyticsIcon />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>Real-time Analytics</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Track every campaign and review live conversions in real-time.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="l-card" style={{ padding: '24px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ 
                background: theme === 'dark' ? 'rgba(118, 207, 31, 0.08)' : 'rgba(118, 207, 31, 0.05)', 
                color: 'var(--primary-green)',
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-accent)',
                boxShadow: theme === 'dark' ? '0 0 10px rgba(118,207,31,0.1)' : 'none',
                flexShrink: 0
              }}>
                <AutomationIcon />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>Smart Automation</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Automate workflows and trigger segmentation with AI logic.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="l-card" style={{ padding: '24px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ 
                background: theme === 'dark' ? 'rgba(118, 207, 31, 0.08)' : 'rgba(118, 207, 31, 0.05)', 
                color: 'var(--primary-green)',
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-accent)',
                boxShadow: theme === 'dark' ? '0 0 10px rgba(118,207,31,0.1)' : 'none',
                flexShrink: 0
              }}>
                <IntegrationsIcon />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>Deep Integrations</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Connect all your marketing and CRM tools seamlessly.</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="l-card" style={{ padding: '24px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ 
                background: theme === 'dark' ? 'rgba(118, 207, 31, 0.08)' : 'rgba(118, 207, 31, 0.05)', 
                color: 'var(--primary-green)',
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-accent)',
                boxShadow: theme === 'dark' ? '0 0 10px rgba(118,207,31,0.1)' : 'none',
                flexShrink: 0
              }}>
                <EnterpriseIcon />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>Enterprise Ready</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Secure database management, SOC2 compliant, and highly scalable.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
         BOTTOM CTA BANNER WITH WAVY GLOW LINES
         ========================================== */}
      <section style={{ padding: '80px 0 100px 0', borderTop: '1px solid var(--border-primary)' }}>
        <div className="l-container">
          <div 
            className="l-card"
            style={{
              padding: '60px 40px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              background: theme === 'dark' ? 'rgba(7, 10, 20, 0.8)' : '#ffffff',
              border: theme === 'dark' ? '1px solid rgba(34, 197, 94, 0.18)' : '1px solid var(--border-primary)',
              boxShadow: theme === 'dark' ? 'var(--shadow-glow)' : 'var(--shadow-card)',
            }}
          >
            {/* Glowing waves SVG background */}
            <svg 
              viewBox="0 0 1440 200" 
              fill="none" 
              style={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                width: '100%', 
                height: 'auto', 
                zIndex: 0, 
                pointerEvents: 'none' 
              }}
            >
              <defs>
                <linearGradient id="wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
                  <stop offset="50%" stopColor="#22c55e" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M 0,140 C 300,190 600,90 900,160 C 1200,230 1350,160 1440,130" stroke="rgba(34, 197, 94, 0.45)" strokeWidth="3" fill="none" filter="url(#neon-glow)" />
              <path d="M 0,155 C 280,195 580,115 880,175 C 1180,235 1360,185 1440,150" stroke="rgba(34, 197, 94, 0.18)" strokeWidth="1.5" fill="none" />
              <path d="M 0,150 C 300,190 600,90 900,160 L 1440,200 L 0,200 Z" fill="url(#wave-grad)" />
            </svg>

            <div style={{ position: 'relative', zIndex: 5 }}>
              <h2 style={{ fontSize: '38px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '-0.8px' }}>
                Ready to launch smarter campaigns?
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '500px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
                Join growth teams who trust CampaignOS to drive more revenue from their existing customer database.
              </p>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleStartWithDemo();
                }}
                style={{ 
                  display: 'flex', 
                  maxWidth: '480px', 
                  margin: '0 auto', 
                  background: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#f3f4f6', 
                  border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e5e7eb', 
                  borderRadius: '100px', 
                  padding: '5px 5px 5px 16px', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  boxShadow: theme === 'dark' ? '0 4px 20px rgba(0,0,0,0.15)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                  <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', color: 'var(--text-muted)' }} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    required 
                    style={{ 
                      background: 'transparent', 
                      border: 'none', 
                      color: 'var(--text-primary)', 
                      fontSize: '14px', 
                      width: '100%',
                      outline: 'none'
                    }} 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={seeding}
                  className="l-btn-primary" 
                  style={{ 
                    padding: '10px 24px', 
                    borderRadius: '100px', 
                    fontSize: '14px', 
                    height: '38px',
                    fontWeight: 700,
                    boxShadow: theme === 'dark' ? '0 0 15px rgba(34, 197, 94, 0.3)' : 'none'
                  }}
                >
                  {seeding ? '⚡ Loading...' : 'Get A Demo  ›'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
         FOOTER SECTION
         ========================================== */}
      <footer style={{ 
        background: theme === 'dark' ? '#010308' : '#f9fafb', 
        borderTop: '1px solid var(--border-primary)', 
        padding: '60px 0 30px 0', 
        marginTop: 'auto',
        transition: 'background-color 0.4s ease, border-color 0.4s ease'
      }}>
        <div className="l-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '16px',
              height: '32px',
              width: '110px',
              overflow: 'hidden'
            }}>
              <img 
                src="/logo-white.png" 
                alt="CampaignOS Logo" 
                style={{ 
                  height: '160px', 
                  width: '160px',
                  marginTop: '-64px',
                  marginBottom: '-64px',
                  marginLeft: '-25px',
                  marginRight: '-25px',
                  filter: 'var(--logo-filter)', 
                  transition: 'filter 0.4s ease',
                  objectFit: 'contain',
                  display: 'block'
                }} 
              />
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '240px' }}>
              CampaignOS is the AI-native campaign planning and execution layer built on top of high-growth retail CRMs.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '16px', fontWeight: 700 }}>Product</h4>
            <ul style={{ listStyle: 'none', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
              <li><a href="#features" style={{ color: 'var(--text-muted)' }}>Features</a></li>
              <li><a href="#integrations" style={{ color: 'var(--text-muted)' }}>Integrations</a></li>
              <li><a href="#how-it-works" style={{ color: 'var(--text-muted)' }}>AI Sandbox</a></li>
              <li><a href="/console" style={{ color: 'var(--text-muted)' }}>Launch Console</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '16px', fontWeight: 700 }}>Resources</h4>
            <ul style={{ listStyle: 'none', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
              <li><a href="/console?tab=data" style={{ color: 'var(--text-muted)' }}>Customer API</a></li>
              <li><a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}>Next.js Docs</a></li>
              <li><a href="#" style={{ color: 'var(--text-muted)' }}>Privacy Policy</a></li>
              <li><a href="#" style={{ color: 'var(--text-muted)' }}>Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '16px', fontWeight: 700 }}>Integrations</h4>
            <ul style={{ listStyle: 'none', fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
              <li>Salesforce Cloud</li>
              <li>HubSpot Marketing</li>
              <li>Shopify Adapter</li>
              <li>Zoho CRM sync</li>
            </ul>
          </div>
        </div>

        <div style={{ 
          borderTop: '1px solid var(--border-secondary)', 
          paddingTop: '20px', 
          textAlign: 'center', 
          fontSize: '12px', 
          color: 'var(--text-muted)' 
        }}>
          © 2026 CampaignOS. Built as the AI Decision Layer for retail customer engagement.
        </div>
      </footer>

    </div>
  );
}
