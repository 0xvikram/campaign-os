import Fastify from 'fastify';
import { config } from 'dotenv';
import { createCampaignEvent } from '@repo/db';

config();

const app = Fastify({ logger: true });

// CORS
app.addHook('onRequest', async (request, reply) => {
  reply.header('Access-Control-Allow-Origin', '*');
  reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  reply.header('Access-Control-Allow-Headers', 'Content-Type');
  if (request.method === 'OPTIONS') {
    reply.send();
  }
});

// Simulate message sending
app.post('/send', async (request, reply) => {
  const { campaignId, channel, customerIds, content } = request.body as {
    campaignId: string;
    channel: string;
    customerIds: string[];
    content: any;
  };

  if (!campaignId || !customerIds || customerIds.length === 0) {
    return reply.code(400).send({ error: 'Invalid request' });
  }

  // Start async processing
  processMessages(campaignId, channel, customerIds, content).catch(err => 
    app.log.error('Message processing error:', err)
  );

  return { success: true, message: `Processing ${customerIds.length} messages` };
});

async function processMessages(
  campaignId: string, 
  channel: string, 
  customerIds: string[], 
  content: any
) {
  for (const customerId of customerIds) {
    // SENT event (immediate)
    await createCampaignEvent({
      campaignId,
      customerId,
      type: 'SENT',
      metadata: { channel, timestamp: new Date() },
    });

    // Random delay 1-3 seconds
    await delay(1000 + Math.random() * 2000);

    // DELIVERED event (90% success rate)
    if (Math.random() < 0.9) {
      await createCampaignEvent({
        campaignId,
        customerId,
        type: 'DELIVERED',
        metadata: { channel, timestamp: new Date() },
      });

      // Random delay 2-5 seconds
      await delay(2000 + Math.random() * 3000);

      // READ event (60% of delivered)
      if (Math.random() < 0.6) {
        await createCampaignEvent({
          campaignId,
          customerId,
          type: 'READ',
          metadata: { channel, timestamp: new Date() },
        });

        // Random delay 1-4 seconds
        await delay(1000 + Math.random() * 3000);

        // CLICKED event (40% of read)
        if (Math.random() < 0.4) {
          await createCampaignEvent({
            campaignId,
            customerId,
            type: 'CLICKED',
            metadata: { channel, timestamp: new Date() },
          });

          // Random delay 2-6 seconds
          await delay(2000 + Math.random() * 4000);

          // CONVERTED event (30% of clicked)
          if (Math.random() < 0.3) {
            const revenue = Math.floor(Math.random() * 2000) + 500;
            await createCampaignEvent({
              campaignId,
              customerId,
              type: 'CONVERTED',
              metadata: { 
                channel, 
                revenue, 
                timestamp: new Date() 
              },
            });
          }
        }
      }
    }
  }

  console.log(`✅ Completed processing ${customerIds.length} messages for campaign ${campaignId}`);
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Health check
app.get('/health', async () => {
  return { status: 'ok' };
});

const start = async () => {
  try {
    await app.listen({ port: 3001, host: '0.0.0.0' });
    console.log('📡 Channel service running on http://localhost:3001');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
