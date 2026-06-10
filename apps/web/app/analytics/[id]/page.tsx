'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AnalyticsPage({ params }: { params: { id: string } }) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 3000);
    return () => clearInterval(interval);
  }, [params.id]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`http://localhost:3000/campaigns/${params.id}/analytics`);
      const data = await res.json();
      setAnalytics(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading analytics...</div>;
  if (!analytics) return <div style={{ padding: 20 }}>No analytics available</div>;

  const { metrics, successScore, insights, topPerformingChannel, funnel, avgRevenue, campaignName, status, audienceSize } = analytics;

  return (
    <div style={{ maxWidth: 1200, margin: '50px auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div>
          <h1 style={{ margin: 0 }}>Campaign Analytics</h1>
          <p style={{ color: '#666', margin: '5px 0 0 0' }}>{campaignName}</p>
        </div>
        <button
          onClick={() => router.push(`/campaign/${params.id}`)}
          style={{
            padding: '8px 16px',
            fontSize: 14,
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
          }}
        >
          Back to Campaign
        </button>
      </div>

      <div style={{ 
        marginTop: 30, 
        padding: 30, 
        background: successScore > 3 ? '#d4edda' : successScore > 1 ? '#fff3cd' : '#f8d7da', 
        borderRadius: 8,
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: 48, margin: 0 }}>{successScore}%</h2>
        <p style={{ fontSize: 18, margin: '10px 0 0 0' }}>Campaign Success Score</p>
        <p style={{ fontSize: 14, color: '#666', margin: '5px 0 0 0' }}>
          {metrics.sent} of {audienceSize} messages sent
        </p>
      </div>

      <div style={{ marginTop: 30 }}>
        <h2>Conversion Funnel</h2>
        <div style={{ 
          marginTop: 15, 
          display: 'grid', 
          gridTemplateColumns: 'repeat(5, 1fr)', 
          gap: 15 
        }}>
          <FunnelStage 
            label="Delivered" 
            value={funnel?.deliveryRate.toFixed(1) || '0'} 
            count={metrics.delivered}
            total={metrics.sent}
          />
          <FunnelStage 
            label="Opened" 
            value={funnel?.openRate.toFixed(1) || '0'} 
            count={metrics.read}
            total={metrics.delivered}
          />
          <FunnelStage 
            label="Clicked" 
            value={funnel?.clickRate.toFixed(1) || '0'} 
            count={metrics.clicked}
            total={metrics.read}
          />
          <FunnelStage 
            label="Converted" 
            value={funnel?.conversionRate.toFixed(1) || '0'} 
            count={metrics.converted}
            total={metrics.clicked}
          />
          <FunnelStage 
            label="Overall" 
            value={funnel?.overallConversion.toFixed(1) || '0'} 
            count={metrics.converted}
            total={metrics.sent}
            highlight
          />
        </div>
      </div>

      <div style={{ 
        marginTop: 30, 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: 20 
      }}>
        <MetricCard label="Messages Sent" value={metrics.sent} />
        <MetricCard label="Total Conversions" value={metrics.converted} />
        <MetricCard label="Revenue Generated" value={`₹${metrics.revenue.toLocaleString()}`} highlight />
      </div>

      <div style={{ marginTop: 30, padding: 20, background: '#f5f5f5', borderRadius: 8 }}>
        <h2>Performance Summary</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginTop: 15 }}>
          <div>
            <strong>Top Channel:</strong> {topPerformingChannel}
          </div>
          <div>
            <strong>Avg Revenue per Conversion:</strong> ₹{avgRevenue.toLocaleString()}
          </div>
          <div>
            <strong>Campaign Status:</strong> {status}
          </div>
        </div>
      </div>

      {insights && insights.length > 0 && (
        <div style={{ marginTop: 30, padding: 20, background: '#e7f3ff', borderRadius: 8 }}>
          <h2>💡 AI-Powered Insights</h2>
          <div style={{ marginTop: 15 }}>
            {insights.map((insight: string, i: number) => (
              <div key={i} style={{ 
                marginBottom: 10, 
                padding: 12, 
                background: 'white', 
                borderRadius: 6,
                borderLeft: '4px solid #0070f3'
              }}>
                {insight}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 20, fontSize: 14, color: '#666', textAlign: 'center' }}>
        🔄 Auto-refreshing every 3 seconds
      </div>
    </div>
  );
}

function MetricCard({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div style={{ 
      padding: 20, 
      background: highlight ? '#e7f3ff' : 'white', 
      border: `2px solid ${highlight ? '#0070f3' : '#ddd'}`, 
      borderRadius: 8 
    }}>
      <div style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 'bold', color: highlight ? '#0070f3' : '#000' }}>{value}</div>
    </div>
  );
}

function FunnelStage({ label, value, count, total, highlight }: { 
  label: string; 
  value: string; 
  count: number; 
  total: number;
  highlight?: boolean;
}) {
  const percentage = parseFloat(value);
  const barColor = percentage > 70 ? '#28a745' : percentage > 40 ? '#ffc107' : '#dc3545';
  
  return (
    <div style={{ 
      padding: 15, 
      background: highlight ? '#f0f8ff' : 'white', 
      border: `2px solid ${highlight ? '#0070f3' : '#ddd'}`, 
      borderRadius: 8,
      textAlign: 'center'
    }}>
      <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 'bold', color: highlight ? '#0070f3' : '#000' }}>
        {value}%
      </div>
      <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
        {count} / {total}
      </div>
      <div style={{ 
        marginTop: 10, 
        height: 6, 
        background: '#e0e0e0', 
        borderRadius: 3, 
        overflow: 'hidden' 
      }}>
        <div style={{ 
          width: `${Math.min(percentage, 100)}%`, 
          height: '100%', 
          background: barColor,
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );
}
