'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CampaignPage({ params }: { params: { id: string } }) {
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [launching, setLaunching] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCampaign();
  }, [params.id]);

  const fetchCampaign = async () => {
    try {
      const res = await fetch(`http://localhost:3000/campaigns/${params.id}`);
      const data = await res.json();
      setCampaign(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunch = async () => {
    setLaunching(true);
    try {
      await fetch(`http://localhost:3000/campaigns/${params.id}/launch`, {
        method: 'POST',
      });
      router.push(`/analytics/${params.id}`);
    } catch (err) {
      console.error(err);
      setLaunching(false);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!campaign) return <div style={{ padding: 20 }}>Campaign not found</div>;

  const opp = campaign.opportunity?.opportunities?.[0];

  return (
    <div style={{ maxWidth: 900, margin: '50px auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0 }}>Campaign Workspace</h1>
          <div style={{ 
            display: 'inline-block',
            marginTop: 10,
            padding: '6px 12px',
            background: campaign.status === 'draft' ? '#fff3cd' : '#d4edda',
            color: campaign.status === 'draft' ? '#856404' : '#155724',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 500
          }}>
            {campaign.status === 'draft' ? '📝 Draft' : '✅ Active'}
          </div>
        </div>
        <button
          onClick={() => router.push('/')}
          style={{
            padding: '8px 16px',
            fontSize: 14,
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
          }}
        >
          ← Back to Home
        </button>
      </div>
      
      <div style={{ marginTop: 30 }}>
        <h2>📋 Campaign Goal</h2>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: '#333' }}>{campaign.goal}</p>
      </div>

      {opp && (
        <div style={{ marginTop: 30, padding: 20, background: '#f5f5f5', borderRadius: 8 }}>
          <h2>🎯 Opportunity</h2>
          <h3>{opp.type.replace(/_/g, ' ')}</h3>
          <p>{opp.description}</p>
          <div style={{ display: 'flex', gap: 20, marginTop: 10 }}>
            <div>
              <strong>Customers:</strong> {opp.customerCount}
            </div>
            <div>
              <strong>Est. Revenue:</strong> ₹{opp.estimatedRevenue.toLocaleString()}
            </div>
          </div>
          <div style={{ marginTop: 10, fontSize: 14, color: '#666' }}>
            <strong>Why:</strong> {opp.reason}
          </div>
        </div>
      )}

      {campaign.audience && (
        <div style={{ marginTop: 30, padding: 20, background: '#f0f8ff', borderRadius: 8 }}>
          <h2>👥 Audience</h2>
          <h3>{campaign.audience.name}</h3>
          <p><strong>Size:</strong> {campaign.audience.customerCount} customers</p>
          <div style={{ marginTop: 10, fontSize: 14, color: '#666' }}>
            <strong>Why:</strong> {campaign.audience.reasoning}
          </div>
        </div>
      )}

      {campaign.strategy && (
        <div style={{ marginTop: 30, padding: 20, background: '#fff5f0', borderRadius: 8 }}>
          <h2>📊 Strategy</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <strong>Channel:</strong> {campaign.strategy.channel}
            </div>
            <div>
              <strong>Timing:</strong> {campaign.strategy.timing}
            </div>
            <div>
              <strong>Offer:</strong> {campaign.strategy.offer}
            </div>
            <div>
              <strong>Structure:</strong> {campaign.strategy.structure}
            </div>
          </div>
          <div style={{ marginTop: 15, fontSize: 14 }}>
            <div><strong>Channel:</strong> {campaign.strategy.reasoning.channelReason}</div>
            <div style={{ marginTop: 5 }}><strong>Timing:</strong> {campaign.strategy.reasoning.timingReason}</div>
            <div style={{ marginTop: 5 }}><strong>Offer:</strong> {campaign.strategy.reasoning.offerReason}</div>
          </div>
        </div>
      )}

      {campaign.content && (
        <div style={{ marginTop: 30, padding: 20, background: '#f0fff0', borderRadius: 8 }}>
          <h2>✉️ Content</h2>
          {campaign.content.subject && (
            <div style={{ marginBottom: 10 }}>
              <strong>Subject:</strong> {campaign.content.subject}
            </div>
          )}
          <div style={{ marginBottom: 10 }}>
            <strong>Body:</strong>
            <div style={{ marginTop: 5, padding: 10, background: 'white', borderRadius: 4 }}>
              {campaign.content.body}
            </div>
          </div>
          <div>
            <strong>CTA:</strong> {campaign.content.cta}
          </div>
          <div style={{ marginTop: 10, fontSize: 14, color: '#666' }}>
            <strong>Why:</strong> {campaign.content.reasoning}
          </div>
        </div>
      )}

      <div style={{ marginTop: 40, display: 'flex', gap: 20 }}>
        <button
          onClick={handleLaunch}
          disabled={launching || campaign.status !== 'draft'}
          style={{
            padding: '12px 24px',
            fontSize: 16,
            background: launching || campaign.status !== 'draft' ? '#ccc' : '#00b300',
            color: 'white',
            border: 'none',
            borderRadius: 5,
            cursor: launching || campaign.status !== 'draft' ? 'not-allowed' : 'pointer',
          }}
        >
          {launching ? 'Launching...' : campaign.status !== 'draft' ? 'Already Launched' : 'Launch Campaign'}
        </button>
        {campaign.status === 'active' && (
          <button
            onClick={() => router.push(`/analytics/${params.id}`)}
            style={{
              padding: '12px 24px',
              fontSize: 16,
              background: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: 5,
              cursor: 'pointer',
            }}
          >
            View Analytics
          </button>
        )}
      </div>
    </div>
  );
}
