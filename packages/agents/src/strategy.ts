import { Agent } from './base';
import { StrategyResult, OrchestrationContext } from '@repo/types';
import { GroqClient } from './groq';

export class StrategyAgent implements Agent<StrategyResult> {
  name = 'StrategyAgent';
  private groq: GroqClient;

  constructor(groqApiKey: string) {
    this.groq = new GroqClient(groqApiKey);
  }

  async execute(context: OrchestrationContext): Promise<StrategyResult> {
    if (!context.opportunity || !context.segment) {
      throw new Error('Opportunity and segment data required for strategy');
    }

    const systemPrompt = `You are a campaign strategy expert. Your job is to determine the best channel, timing, offer, and campaign structure for a marketing campaign.

You must respond with valid JSON in exactly this format:
{
  "channel": "WhatsApp" | "Email" | "Push",
  "timing": "string describing when to send",
  "offer": "string describing the offer/incentive",
  "structure": "string describing campaign structure",
  "reasoning": {
    "channelReason": "why this channel was chosen",
    "timingReason": "why this timing was chosen",
    "offerReason": "why this offer was chosen"
  }
}`;

    const prompt = `Analyze this campaign opportunity and create an optimal strategy:

BUSINESS GOAL: ${context.goal}

OPPORTUNITY:
${context.opportunity.opportunities[0].description}
Customer Count: ${context.opportunity.opportunities[0].customerCount}
Estimated Revenue: ₹${context.opportunity.opportunities[0].estimatedRevenue}
Reason: ${context.opportunity.opportunities[0].reason}

AUDIENCE SEGMENT:
Type: ${context.segment.name}
Size: ${context.segment.customerCount} customers
Selection Criteria: ${context.segment.reasoning}

Based on this data, determine:
1. Best channel (WhatsApp for high-intent/urgent, Email for nurturing/informational, Push for immediate action)
2. Optimal timing (when during the day, week, or campaign lifecycle)
3. Recommended offer (discount percentage, free shipping, exclusive access, etc.)
4. Campaign structure (single blast, drip sequence, triggered, etc.)

Provide detailed reasoning for each decision based on customer behavior patterns and opportunity type.`;

    const response = await this.groq.completeJSON<StrategyResult>(prompt, systemPrompt);
    return response;
  }
}
