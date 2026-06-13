import { Agent } from './base';
import { ContentResult, OrchestrationContext } from '@repo/types';
import { GroqClient } from './groq';

export class ContentAgent implements Agent<ContentResult> {
  name = 'ContentAgent';
  private groq: GroqClient;

  constructor(groqApiKey: string) {
    this.groq = new GroqClient(groqApiKey);
  }

  async execute(context: OrchestrationContext): Promise<ContentResult> {
    if (!context.opportunity || !context.segment || !context.strategy) {
      throw new Error('Full context required for content generation');
    }

    const oppType = context.opportunity.opportunities[0].type;
    const channel = context.strategy.channel;
    const offer = context.strategy.offer;

    const systemPrompt = `You are a campaign copywriter who creates DISTINCTLY DIFFERENT content based on customer segment and channel.

TONE RULES BY OPPORTUNITY:
- DORMANT/CHURN: Warm, apologetic, "we miss you" tone with urgency
- VIP: Exclusive, premium, "you deserve this" tone
- FREQUENT: Rewarding, appreciative, "thank you for loyalty" tone  
- CATEGORY: Curious, product-focused, "check out what's new" tone

STYLE RULES BY CHANNEL:
- WhatsApp: Conversational, emoji-friendly, under 150 chars, personal
- Email: Structured, visual descriptions, storytelling, 100-150 words
- Push: Ultra-short, urgent, action-focused, under 50 chars

You must respond with valid JSON in exactly this format:
{
  "channel": "WhatsApp" | "Email" | "Push",
  "subject": "email subject line (only for Email channel)",
  "body": "main message content",
  "cta": "call-to-action text",
  "personalization": {
    "greeting": "personalization token for greeting",
    "offerAmount": "personalization token for offer"
  },
  "reasoning": "why this content approach was chosen"
}`;

    const prompt = `Create UNIQUE campaign content for ${oppType} segment via ${channel}.

BUSINESS GOAL: ${context.goal}

OPPORTUNITY TYPE: ${oppType}
Description: ${context.opportunity.opportunities[0].description}

AUDIENCE:
- Type: ${context.segment.name}
- Size: ${context.segment.customerCount} customers
- Behavior: ${context.segment.reasoning}

STRATEGY:
- Channel: ${channel}
- Timing: ${context.strategy.timing}
- Offer: ${offer}
- Structure: ${context.strategy.structure}

CONTENT REQUIREMENTS FOR ${oppType}:

${oppType === 'DORMANT_CUSTOMERS' ? `
TONE: Warm win-back, "We miss you!"
MESSAGE: Acknowledge absence, entice with strong offer, create urgency
EXAMPLE: "Hi {name} 👋 We noticed you haven't shopped in a while. Here's 25% off to welcome you back! Valid for 48 hours only. Shop now → [link]"
` : ''}

${oppType === 'CHURN_RISK' ? `
TONE: Apologetic, personalized, emotional
MESSAGE: Show you value their past loyalty, major incentive to return
EXAMPLE: "Dear {name}, We truly miss having you. As one of our valued customers, here's an exclusive 30% off your next order. Come back? 💙"
` : ''}

${oppType === 'VIP_UPSELL' ? `
TONE: Premium, exclusive, VIP treatment
MESSAGE: Make them feel special, offer exclusive access/products
EXAMPLE: "Hi {name}, You're invited! As a VIP member, get early access to our new premium collection. Shop before anyone else → [link]"
` : ''}

${oppType === 'FREQUENT_BUYERS' ? `
TONE: Appreciative, rewarding, fun
MESSAGE: Thank them for loyalty, reward with points/perks
EXAMPLE: "Hey {name}! 🎉 You're crushing it! As a thank you, enjoy 2X loyalty points on your next order. Keep it going! → [link]"
` : ''}

${oppType === 'CATEGORY_DROPOFF' ? `
TONE: Friendly, product-focused, "new arrivals"
MESSAGE: Show relevant new products in their favorite category
EXAMPLE: "Hi {name} 👟 New footwear just dropped! Check out fresh styles in your favorite category. Plus 15% off → [link]"
` : ''}

Create content that feels COMPLETELY DIFFERENT from other opportunity types. Match the tone, urgency, and offer presentation to the behavioral segment.`;

    const response = await this.groq.completeJSON<ContentResult>(prompt, systemPrompt);
    return response;
  }
}
