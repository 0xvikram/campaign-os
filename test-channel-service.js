#!/usr/bin/env node

/**
 * Channel Service Verification Script
 * 
 * This script tests the channel service event simulation
 * Run after starting the channel service on port 3001
 */

const testChannelService = async () => {
  const CHANNEL_SERVICE_URL = 'http://localhost:3001';
  
  console.log('🧪 Testing Channel Service Event Simulation\n');
  
  // Test 1: Health Check
  console.log('Test 1: Health Check');
  try {
    const healthRes = await fetch(`${CHANNEL_SERVICE_URL}/health`);
    const health = await healthRes.json();
    console.log('✅ Health check passed:', health);
  } catch (err) {
    console.error('❌ Health check failed. Is the channel service running on port 3001?');
    console.error('   Start it with: cd apps/channel-service && pnpm dev');
    process.exit(1);
  }
  
  // Test 2: Send Message Simulation
  console.log('\nTest 2: Message Sending Simulation');
  try {
    const sendRes = await fetch(`${CHANNEL_SERVICE_URL}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignId: 'test-campaign-123',
        channel: 'WhatsApp',
        customerIds: ['test-customer-1', 'test-customer-2'],
        content: {
          subject: 'Test Message',
          body: 'This is a test',
          cta: 'Click Here'
        }
      }),
    });
    
    if (!sendRes.ok) {
      throw new Error(`HTTP ${sendRes.status}: ${await sendRes.text()}`);
    }
    
    const result = await sendRes.json();
    console.log('✅ Message sending initiated:', result);
    console.log('   The channel service will now simulate events asynchronously');
    console.log('   Events: SENT → DELIVERED → READ → CLICKED → CONVERTED');
  } catch (err) {
    console.error('❌ Message sending failed:', err.message);
    process.exit(1);
  }
  
  // Test 3: Invalid Request Handling
  console.log('\nTest 3: Invalid Request Handling');
  try {
    const invalidRes = await fetch(`${CHANNEL_SERVICE_URL}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // Missing required fields
      }),
    });
    
    if (invalidRes.status === 400) {
      console.log('✅ Invalid request properly rejected with 400 status');
    } else {
      console.log('⚠️  Expected 400 status for invalid request, got', invalidRes.status);
    }
  } catch (err) {
    console.error('❌ Invalid request test failed:', err.message);
  }
  
  console.log('\n✨ Channel Service Verification Complete!\n');
  console.log('Event Simulation Behavior:');
  console.log('  - SENT: Immediate (100%)');
  console.log('  - DELIVERED: 1-3s delay (90% success)');
  console.log('  - READ: 2-5s after delivery (60% of delivered)');
  console.log('  - CLICKED: 1-4s after read (40% of read)');
  console.log('  - CONVERTED: 2-6s after click (30% of clicked)');
  console.log('  - Revenue: ₹500-₹2500 per conversion\n');
};

testChannelService();
