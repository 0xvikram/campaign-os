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
  reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  reply.header('Access-Control-Allow-Headers', 'Content-Type');
  if (request.method === 'OPTIONS') {
    reply.send();
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
  
  try {
    await fetch(`${channelServiceUrl}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignId: id,
        channel: campaign.strategy.channel,
        customerIds: campaign.audience.customerIds,
        content: campaign.content,
      }),
    });
  } catch (error) {
    request.log.error('Failed to trigger channel service:', error);
  }

  return { success: true, campaignId: id };
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
