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

    const opp = context.opportunity.opportunities[0];
    const oppType = opp.type;
    const customerCount = context.segment.customerCount;

    const systemPrompt = `You are a data-driven campaign strategist. You MUST differentiate your recommendations based on customer behavior patterns.

CRITICAL RULES:
- DORMANT/CHURN customers need AGGRESSIVE offers (20-30% off) via URGENT channels (WhatsApp/Push) with IMMEDIATE timing
- VIP/HIGH-VALUE customers need EXCLUSIVE offers (early access, premium products, <10% off) via PERSONALIZED channels (Email) with EVENING timing
- FREQUENT buyers need LOYALTY rewards (points, free shipping) via CONVENIENT channels (Push/Email) with FLEXIBLE timing
- CATEGORY-SPECIFIC dropoffs need TARGETED product offers (related items, bundles) via VISUAL channels (Email/WhatsApp) with WEEKEND timing

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

    const prompt = `You MUST create a DISTINCT strategy based on this specific customer behavior pattern.

BUSINESS GOAL: ${context.goal}

OPPORTUNITY TYPE: ${oppType}
Description: ${opp.description}
Customer Count: ${customerCount}
Estimated Revenue: ₹${opp.estimatedRevenue}
Behavioral Pattern: ${opp.reason}

AUDIENCE SEGMENT:
Type: ${context.segment.name}
Size: ${customerCount} customers
Selection Criteria: ${context.segment.reasoning}

REQUIRED DIFFERENTIATION BY OPPORTUNITY TYPE:

${oppType === 'DORMANT_CUSTOMERS' ? `
THIS IS A DORMANT CUSTOMER SEGMENT (45-90 days inactive)
- Channel: WhatsApp (URGENT, direct, high open rates)
- Timing: Morning 9-11 AM (catch them early in day)
- Offer: 25% discount + free shipping (AGGRESSIVE to reactivate)
- Structure: Single urgent message with 48-hour deadline
` : ''}

${oppType === 'CHURN_RISK' ? `
THIS IS A CHURN RISK SEGMENT (90+ days inactive, previously loyal)
- Channel: Email (PERSONAL, detailed win-back story)
- Timing: Evening 7-9 PM (relaxed browsing time)
- Offer: 30% off + "We miss you" personalized message
- Structure: 3-email drip over 7 days with escalating offers
` : ''}

${oppType === 'VIP_UPSELL' ? `
THIS IS A VIP HIGH-VALUE SEGMENT (₹10K+ spent, active)
- Channel: Email (PREMIUM, rich content with images)
- Timing: Weekend mornings 10 AM-12 PM (leisure shopping)
- Offer: Exclusive early access to new collection OR 10% off premium items
- Structure: Personalized product recommendations, VIP-only event invite
` : ''}

${oppType === 'FREQUENT_BUYERS' ? `
THIS IS A FREQUENT BUYER SEGMENT (3+ orders in 60 days)
- Channel: Push notification (CONVENIENT, they're already engaged)
- Timing: Afternoon 3-5 PM (mid-day break, impulse)
- Offer: Loyalty points 2X OR free express shipping
- Structure: Immediate reward unlock, gamification elements
` : ''}

${oppType === 'CATEGORY_DROPOFF' ? `
THIS IS A CATEGORY-SPECIFIC DROPOFF (bought category before, 60+ days ago)
- Channel: WhatsApp (VISUAL product showcases work well)
- Timing: Evening 6-8 PM (browsing time after work)
- Offer: 15% off + "New arrivals in [category]" + related products bundle
- Structure: Product catalog with 3-5 relevant items, personalized picks
` : ''}

Based on the above guidance for ${oppType}, create a strategy that is DISTINCTLY DIFFERENT from other opportunity types. Make sure channel, timing, and offer match the behavioral pattern.`;

    const response = await this.groq.completeJSON<StrategyResult>(prompt, systemPrompt);
    return response;
  }
}
