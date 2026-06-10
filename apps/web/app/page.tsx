'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const EXAMPLE_GOALS = [
  "Increase repeat purchases among footwear buyers who have not purchased in the last 45 days",
  "Re-engage dormant customers who haven't made a purchase in 90 days with a personalized offer",
  "Target high-value customers who spent more than ₹10,000 last month to drive loyalty",
  "Win back customers who made only one purchase and haven't returned in 60 days",
];

export default function Home() {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
      router.push(`/campaign/${campaign.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '50px auto', padding: 20 }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 48, margin: 0, color: '#0070f3' }}>CampaignOS</h1>
        <p style={{ fontSize: 18, color: '#666', marginTop: 10 }}>
          AI-powered campaign generation. From business goal to executed campaign.
        </p>
      </div>

      <div style={{ 
        padding: 30, 
        background: '#f8f9fa', 
        borderRadius: 12, 
        marginBottom: 30 
      }}>
        <h2 style={{ marginTop: 0 }}>How it works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 15, marginTop: 20 }}>
          <Step number="1" title="Define Goal" description="Describe your business objective" />
          <Step number="2" title="AI Analysis" description="Agents discover opportunities" />
          <Step number="3" title="Review Campaign" description="Check strategy & content" />
          <Step number="4" title="Launch & Track" description="Execute and monitor results" />
        </div>
      </div>

      <form onSubmit={handleGenerate}>
        <div>
          <label htmlFor="goal" style={{ display: 'block', marginBottom: 8, fontSize: 16, fontWeight: 500 }}>
            What's your business goal?
          </label>
          <textarea
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Describe your campaign goal in natural language..."
            required
            rows={4}
            style={{ 
              width: '100%', 
              padding: 15, 
              fontSize: 16, 
              borderRadius: 8, 
              border: '2px solid #ddd',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ marginTop: 20 }}>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 10 }}>Try these examples:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {EXAMPLE_GOALS.map((example, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setGoal(example)}
                style={{
                  padding: '8px 12px',
                  fontSize: 13,
                  background: 'white',
                  color: '#0070f3',
                  border: '1px solid #0070f3',
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#0070f3';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = '#0070f3';
                }}
              >
                Example {i + 1}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ 
            color: '#d32f2f', 
            marginTop: 15, 
            padding: 12, 
            background: '#ffebee', 
            borderRadius: 6,
            border: '1px solid #ef5350'
          }}>
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !goal.trim()}
          style={{
            marginTop: 20,
            width: '100%',
            padding: '16px 24px',
            fontSize: 18,
            fontWeight: 600,
            background: loading || !goal.trim() ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: loading || !goal.trim() ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseOver={(e) => {
            if (!loading && goal.trim()) {
              e.currentTarget.style.background = '#0051cc';
            }
          }}
          onMouseOut={(e) => {
            if (!loading && goal.trim()) {
              e.currentTarget.style.background = '#0070f3';
            }
          }}
        >
          {loading ? '🤖 Generating Campaign...' : '🚀 Generate Campaign'}
        </button>
      </form>

      {loading && (
        <div style={{ 
          marginTop: 30, 
          padding: 20, 
          background: '#e7f3ff', 
          borderRadius: 8,
          textAlign: 'center' 
        }}>
          <p style={{ fontSize: 16, margin: 0, fontWeight: 500 }}>🤖 AI Agents are working...</p>
          <p style={{ fontSize: 14, color: '#666', marginTop: 10 }}>
            Analyzing opportunities → Building segments → Planning strategy → Creating content
          </p>
          <p style={{ fontSize: 13, color: '#888', marginTop: 10 }}>
            This typically takes 10-30 seconds
          </p>
        </div>
      )}

      <div style={{ marginTop: 40, padding: 20, background: '#fff9e6', borderRadius: 8 }}>
        <h3 style={{ marginTop: 0 }}>💡 Pro Tips</h3>
        <ul style={{ marginLeft: 20, lineHeight: 1.8 }}>
          <li>Be specific about your target audience (e.g., "footwear buyers")</li>
          <li>Include timeframes (e.g., "last 45 days")</li>
          <li>Mention the desired action (e.g., "increase repeat purchases")</li>
          <li>The AI will handle segmentation, channel selection, and content creation</li>
        </ul>
      </div>
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ 
        width: 40, 
        height: 40, 
        background: '#0070f3', 
        color: 'white', 
        borderRadius: '50%', 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10
      }}>
        {number}
      </div>
      <div style={{ fontWeight: 600, marginBottom: 5 }}>{title}</div>
      <div style={{ fontSize: 13, color: '#666' }}>{description}</div>
    </div>
  );
}
