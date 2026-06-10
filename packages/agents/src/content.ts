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

    const systemPrompt = `You are a campaign copywriter. Create compelling, personalized campaign content.

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

    const prompt = `Create campaign content based on this strategy:

BUSINESS GOAL: ${context.goal}

AUDIENCE:
- Type: ${context.segment.name}
- Size: ${context.segment.customerCount} customers
- Context: ${context.segment.reasoning}

STRATEGY:
- Channel: ${context.strategy.channel}
- Timing: ${context.strategy.timing}
- Offer: ${context.strategy.offer}
- Structure: ${context.strategy.structure}

OPPORTUNITY:
${context.opportunity.opportunities[0].description}

Create engaging, personalized content that:
1. Addresses the customer's specific situation (dormant, VIP, etc.)
2. Presents the offer compellingly
3. Includes clear call-to-action
4. Uses appropriate tone for the channel (casual for WhatsApp, professional for Email, urgent for Push)
5. Includes personalization tokens like {name}, {offerAmount}

Keep WhatsApp messages under 160 characters, emails under 150 words, push notifications under 50 characters.`;

    const response = await this.groq.completeJSON<ContentResult>(prompt, systemPrompt);
    return response;
  }
}
