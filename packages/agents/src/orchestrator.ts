import { OrchestrationContext, OpportunityResult, SegmentResult, StrategyResult, ContentResult } from '@repo/types';
import { Agent } from './base';

export class AgentOrchestrator {
  private opportunityAgent: Agent<OpportunityResult>;
  private segmentationAgent: Agent<SegmentResult>;
  private strategyAgent: Agent<StrategyResult>;
  private contentAgent: Agent<ContentResult>;

  constructor(
    opportunityAgent: Agent<OpportunityResult>,
    segmentationAgent: Agent<SegmentResult>,
    strategyAgent: Agent<StrategyResult>,
    contentAgent: Agent<ContentResult>
  ) {
    this.opportunityAgent = opportunityAgent;
    this.segmentationAgent = segmentationAgent;
    this.strategyAgent = strategyAgent;
    this.contentAgent = contentAgent;
  }

  async orchestrate(goal: string): Promise<OrchestrationContext> {
    const context: OrchestrationContext = { goal };

    // Step 1: Discover opportunities
    context.opportunity = await this.opportunityAgent.execute(context);

    // Step 2: Segment audience
    context.segment = await this.segmentationAgent.execute(context);

    // Step 3: Determine strategy
    context.strategy = await this.strategyAgent.execute(context);

    // Step 4: Generate content
    context.content = await this.contentAgent.execute(context);

    return context;
  }
}
