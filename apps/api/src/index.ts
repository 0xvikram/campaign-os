import Fastify from 'fastify';
import { config } from 'dotenv';
import { 
  AgentOrchestrator, 
  OpportunityAgent, 
  SegmentationAgent, 
  StrategyAgent, 
  ContentAgent 
} from '@repo/agents';
import { 
  createCampaign, 
  getCampaign, 
  launchCampaign,
  getCampaignEvents,
  prisma 
} from '@repo/db';

config();

const app = Fastify({ logger: true });

// Initialize agents
const groqApiKey = process.env.GROQ_API_KEY || '';
const orchestrator = new AgentOrchestrator(
  new OpportunityAgent(),
  new SegmentationAgent(),
  new StrategyAgent(groqApiKey),
  new ContentAgent(groqApiKey)
);

// CORS
app.addHook('onRequest', async (request, reply) => {
  reply.header('Access-Control-Allow-Origin', '*');
  reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (request.method === 'OPTIONS') {
    reply.status(200).send();
  }
});

// Generate campaign
app.post('/campaigns/generate', async (request, reply) => {
  const { goal } = request.body as { goal: string };
  
  if (!goal) {
    return reply.code(400).send({ error: 'Goal is required' });
  }

  try {
    const context = await orchestrator.orchestrate(goal);
    
    const campaign = await createCampaign({
      name: `Campaign: ${context.opportunity?.opportunities[0]?.type || 'Unknown'}`,
      goal,
      opportunity: context.opportunity,
      audience: context.segment,
      strategy: context.strategy,
      content: context.content,
    });

    return campaign;
  } catch (error: any) {
    request.log.error(error);
    return reply.code(500).send({ error: error.message });
  }
});

// Get campaign
app.get('/campaigns/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  
  const campaign = await getCampaign(id);
  
  if (!campaign) {
    return reply.code(404).send({ error: 'Campaign not found' });
  }
  
  return campaign;
});

// Launch campaign
app.post('/campaigns/:id/launch', async (request, reply) => {
  const { id } = request.params as { id: string };
  
  const campaign = await getCampaign(id);
  
  if (!campaign) {
    return reply.code(404).send({ error: 'Campaign not found' });
  }

  if (campaign.status !== 'draft') {
    return reply.code(400).send({ error: 'Campaign already launched' });
  }

  await launchCampaign(id);

  // Trigger channel service
  const channelServiceUrl = process.env.CHANNEL_SERVICE_URL || 'http://localhost:3001';
  
  // Create immediate SENT event for the first customer to show instant feedback
  const customerIds = campaign.audience.customerIds || [];
  if (customerIds.length > 0) {
    try {
      const { createCampaignEvent } = await import('@repo/db');
      await createCampaignEvent({
        campaignId: id,
        customerId: customerIds[0],
        type: 'SENT',
        metadata: { channel: campaign.strategy.channel, timestamp: new Date() },
      });
    } catch (err) {
      request.log.error('Failed to create initial event:', err);
    }
  }
  
  try {
    const channelResponse = await fetch(`${channelServiceUrl}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignId: id,
        channel: campaign.strategy.channel,
        customerIds,
        content: campaign.content,
      }),
    });

    if (!channelResponse.ok) {
      throw new Error(`Channel service returned ${channelResponse.status}`);
    }

    return { 
      success: true, 
      campaignId: id,
      message: 'Campaign launched successfully. Events are being generated.'
    };
  } catch (error) {
    request.log.error('Failed to trigger channel service:', error);
    return reply.code(503).send({ 
      error: 'Campaign launched but channel service is unavailable. Please ensure the channel service is running on port 3001.',
      hint: 'Run the channel service with: pnpm run dev --filter=channel-service'
    });
  }
});

// Get campaign analytics
app.get('/campaigns/:id/analytics', async (request, reply) => {
  const { id } = request.params as { id: string };
  
  const campaign = await getCampaign(id);
  
  if (!campaign) {
    return reply.code(404).send({ error: 'Campaign not found' });
  }

  const events = campaign.events || [];
  
  const metrics = {
    sent: events.filter(e => e.type === 'SENT').length,
    delivered: events.filter(e => e.type === 'DELIVERED').length,
    read: events.filter(e => e.type === 'READ').length,
    clicked: events.filter(e => e.type === 'CLICKED').length,
    converted: events.filter(e => e.type === 'CONVERTED').length,
    revenue: events
      .filter(e => e.type === 'CONVERTED')
      .reduce((sum, e) => sum + (e.metadata?.revenue || 0), 0),
  };

  // Calculate conversion funnel
  const funnel = {
    deliveryRate: metrics.sent > 0 ? (metrics.delivered / metrics.sent) * 100 : 0,
    openRate: metrics.delivered > 0 ? (metrics.read / metrics.delivered) * 100 : 0,
    clickRate: metrics.read > 0 ? (metrics.clicked / metrics.read) * 100 : 0,
    conversionRate: metrics.clicked > 0 ? (metrics.converted / metrics.clicked) * 100 : 0,
    overallConversion: metrics.sent > 0 ? (metrics.converted / metrics.sent) * 100 : 0,
  };

  const successScore = Math.round(funnel.overallConversion);
  const avgRevenue = metrics.converted > 0 ? metrics.revenue / metrics.converted : 0;

  // Generate AI-powered insights
  const insights = [];
  
  // Delivery insights
  if (funnel.deliveryRate < 85) {
    insights.push(`⚠️ Delivery rate is ${funnel.deliveryRate.toFixed(1)}%. Consider cleaning your contact list or verifying customer data quality.`);
  } else if (funnel.deliveryRate > 95) {
    insights.push(`✅ Excellent delivery rate of ${funnel.deliveryRate.toFixed(1)}%. Your contact data quality is strong.`);
  }
  
  // Open rate insights
  if (funnel.openRate > 60) {
    insights.push(`🔥 Outstanding open rate of ${funnel.openRate.toFixed(1)}%. Your ${campaign.strategy.channel} message subject line resonates strongly with this audience.`);
  } else if (funnel.openRate < 30) {
    insights.push(`💡 Open rate is ${funnel.openRate.toFixed(1)}%. Consider testing different subject lines or sending times to improve engagement.`);
  } else if (funnel.openRate > 40) {
    insights.push(`👍 Good open rate of ${funnel.openRate.toFixed(1)}%. Message timing and subject line are working well.`);
  }
  
  // Click rate insights
  if (funnel.clickRate > 35) {
    insights.push(`⭐ High click rate of ${funnel.clickRate.toFixed(1)}%. Your CTA and offer are highly compelling to ${campaign.audience.name}.`);
  } else if (funnel.clickRate < 15) {
    insights.push(`🎯 Click rate is ${funnel.clickRate.toFixed(1)}%. Consider strengthening your call-to-action or making the offer more prominent.`);
  }
  
  // Conversion insights
  if (funnel.conversionRate > 25) {
    insights.push(`💰 Exceptional conversion rate of ${funnel.conversionRate.toFixed(1)}% from clicks. The offer alignment with customer needs is excellent.`);
  } else if (funnel.conversionRate < 10 && metrics.clicked > 5) {
    insights.push(`🔍 Conversion rate is ${funnel.conversionRate.toFixed(1)}%. There may be friction in the checkout process or offer mismatch.`);
  }

  // Revenue insights
  if (metrics.converted > 0) {
    insights.push(`💵 Generated ₹${metrics.revenue.toLocaleString()} from ${metrics.converted} conversions (avg: ₹${Math.round(avgRevenue).toLocaleString()}).`);
    
    const expectedCustomers = campaign.audience.customerCount || metrics.sent;
    const potentialRevenue = expectedCustomers * avgRevenue * (funnel.overallConversion / 100);
    if (potentialRevenue > metrics.revenue * 1.2) {
      insights.push(`📈 Based on current performance, this campaign could generate ₹${Math.round(potentialRevenue).toLocaleString()} when all messages complete.`);
    }
  }

  // Channel performance
  const channelName = campaign.strategy.channel.toUpperCase();
  insights.push(`📱 ${channelName} is performing as your top channel for ${campaign.audience.name} with ${funnel.overallConversion.toFixed(1)}% overall conversion.`);

  // Strategic recommendations
  if (metrics.sent >= (campaign.audience.customerCount || 100) * 0.9) {
    if (funnel.overallConversion > 3) {
      insights.push(`🎉 Campaign is performing well! Consider creating similar campaigns for related customer segments.`);
    } else if (funnel.overallConversion < 1) {
      insights.push(`🔄 Consider adjusting the offer or messaging for better results in future campaigns.`);
    }
  }

  return {
    campaignId: id,
    campaignName: campaign.name,
    status: campaign.status,
    launchedAt: campaign.launchedAt,
    metrics,
    funnel,
    successScore,
    avgRevenue: Math.round(avgRevenue),
    insights,
    topPerformingChannel: campaign.strategy.channel,
    audienceSize: campaign.audience.customerCount || metrics.sent,
  };
});

// List campaigns
app.get('/campaigns', async (request, reply) => {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  
  return campaigns;
});

// Get customers list
app.get('/customers', async (request, reply) => {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return customers;
});

// Get orders list
app.get('/orders', async (request, reply) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { customer: true },
  });
  return orders;
});

// Reset and seed database
app.post('/data/seed', async (request, reply) => {
  try {
    console.log('🌱 Starting database seed...');
    
    // Clear existing data
    await prisma.campaignEvent.deleteMany();
    await prisma.campaign.deleteMany();
    await prisma.segment.deleteMany();
    await prisma.order.deleteMany();
    await prisma.customer.deleteMany();

    const now = new Date();
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    const CATEGORIES = ['Footwear', 'Apparel', 'Accessories', 'Electronics', 'Home'];

    function randomDate(start: Date, end: Date): Date {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    // Create 500 customers with varying behavior
    console.log('Creating 500 customers...');
    const customers = [];
    for (let i = 0; i < 500; i++) {
      const customer = await prisma.customer.create({
        data: {
          email: `customer${i}@example.com`,
          name: `Customer ${i}`,
          phone: `+91${9000000000 + i}`,
          createdAt: randomDate(sixMonthsAgo, now),
        },
      });
      customers.push(customer);
    }

    console.log('✅ Created 500 customers');

    // Create orders with different patterns
    let orderCount = 0;

    for (const customer of customers) {
      const customerType = Math.random();
      
      // 30% VIP customers (high frequency, high value, active)
      if (customerType < 0.3) {
        const orders = Math.floor(Math.random() * 10) + 5;
        for (let j = 0; j < orders; j++) {
          await prisma.order.create({
            data: {
              customerId: customer.id,
              amount: Math.floor(Math.random() * 5000) + 1000,
              category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
              createdAt: randomDate(new Date(customer.createdAt), now),
            },
          });
          orderCount++;
        }
      }
      // 25% Dormant customers (purchased before, but 60-90 days ago)
      else if (customerType < 0.55) {
        const orders = Math.floor(Math.random() * 3) + 2;
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        for (let j = 0; j < orders; j++) {
          await prisma.order.create({
            data: {
              customerId: customer.id,
              amount: Math.floor(Math.random() * 3000) + 500,
              category: j === 0 ? 'Footwear' : CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
              createdAt: randomDate(ninetyDaysAgo, sixtyDaysAgo),
            },
          });
          orderCount++;
        }
      }
      // 25% Churn risk (100+ days inactive, but was active)
      else if (customerType < 0.8) {
        const orders = Math.floor(Math.random() * 4) + 3;
        const threeMonthsAgo = new Date(now.getTime() - 100 * 24 * 60 * 60 * 1000);
        for (let j = 0; j < orders; j++) {
          await prisma.order.create({
            data: {
              customerId: customer.id,
              amount: Math.floor(Math.random() * 2000) + 300,
              category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
              createdAt: randomDate(new Date(customer.createdAt), threeMonthsAgo),
            },
          });
          orderCount++;
        }
      }
      // 20% Active recent customers
      else {
        const orders = Math.floor(Math.random() * 5) + 2;
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        for (let j = 0; j < orders; j++) {
          await prisma.order.create({
            data: {
              customerId: customer.id,
              amount: Math.floor(Math.random() * 1500) + 200,
              category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
              createdAt: randomDate(thirtyDaysAgo, now),
            },
          });
          orderCount++;
        }
      }
    }

    console.log(`✅ Created ${orderCount} orders`);

    // Update customer aggregates
    const allCustomers = await prisma.customer.findMany({
      include: { orders: true },
    });

    for (const customer of allCustomers) {
      const totalSpent = customer.orders.reduce((sum, order) => sum + order.amount, 0);
      const lastOrder = customer.orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

      await prisma.customer.update({
        where: { id: customer.id },
        data: {
          totalSpent,
          orderCount: customer.orders.length,
          lastOrderAt: lastOrder?.createdAt,
        },
      });
    }

    console.log('✅ Updated customer aggregates');
    
    // Get final counts
    const finalCustomerCount = await prisma.customer.count();
    const finalOrderCount = await prisma.order.count();
    
    console.log(`🎉 Seeding complete! ${finalCustomerCount} customers, ${finalOrderCount} orders`);

    return { 
      success: true, 
      message: `Database seeded successfully with ${finalCustomerCount} customers and ${finalOrderCount} orders` 
    };
  } catch (error: any) {
    request.log.error(error);
    return reply.code(500).send({ error: error.message });
  }
});

// Health check
app.get('/health', async () => {
  return { status: 'ok' };
});

const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 API server running on http://localhost:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
