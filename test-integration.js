#!/usr/bin/env node

const API_URL = 'http://localhost:3000';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function test() {
  console.log('🧪 Testing CampaignOS Integration\n');
  
  // 1. Generate campaign
  console.log('1. Generating campaign...');
  const res = await fetch(`${API_URL}/campaigns/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      goal: 'Increase repeat purchases among footwear buyers who have not purchased in the last 45 days'
    }),
  });
  
  const campaign = await res.json();
  console.log(`✅ Campaign created: ${campaign.id}\n`);
  
  // 2. Launch campaign
  console.log('2. Launching campaign...');
  await fetch(`${API_URL}/campaigns/${campaign.id}/launch`, { method: 'POST' });
  console.log('✅ Campaign launched\n');
  
  // 3. Monitor analytics
  console.log('3. Monitoring analytics for 20 seconds...');
  for (let i = 0; i < 7; i++) {
    await delay(3000);
    const analytics = await fetch(`${API_URL}/campaigns/${campaign.id}/analytics`).then(r => r.json());
    console.log(`  [${i*3}s] Sent: ${analytics.metrics.sent}, Converted: ${analytics.metrics.converted}, Revenue: ₹${analytics.metrics.revenue}`);
  }
  
  console.log('\n✅ Integration test complete!');
  console.log(`   View campaign: http://localhost:3002/campaign/${campaign.id}`);
  console.log(`   View analytics: http://localhost:3002/analytics/${campaign.id}`);
}

test().catch(console.error);
