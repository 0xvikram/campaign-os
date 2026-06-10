// Agent Output Types
export interface OpportunityResult {
  opportunities: Array<{
    type: string;
    description: string;
    customerCount: number;
    estimatedRevenue: number;
    reason: string;
  }>;
  reasoning: string;
}

export interface SegmentResult {
  name: string;
  criteria: Record<string, any>;
  customerIds: string[];
  customerCount: number;
  reasoning: string;
}

export interface StrategyResult {
  channel: string;
  timing: string;
  offer: string;
  structure: string;
  reasoning: {
    channelReason: string;
    timingReason: string;
    offerReason: string;
  };
}

export interface ContentResult {
  channel: string;
  subject?: string;
  body: string;
  cta: string;
  personalization: Record<string, string>;
  reasoning: string;
}

// Campaign Types
export interface Campaign {
  id: string;
  name: string;
  goal: string;
  status: 'draft' | 'active' | 'completed' | 'paused';
  opportunity: OpportunityResult;
  audience: SegmentResult;
  strategy: StrategyResult;
  content: ContentResult;
  createdAt: Date;
  launchedAt?: Date;
}

export interface CreateCampaignRequest {
  goal: string;
}

export interface LaunchCampaignRequest {
  campaignId: string;
}

// Customer Types
export interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  totalSpent: number;
  orderCount: number;
  lastOrderAt?: Date;
  segment?: string;
}

export interface Order {
  id: string;
  customerId: string;
  amount: number;
  category: string;
  createdAt: Date;
}

// Event Types
export type EventType = 'SENT' | 'DELIVERED' | 'READ' | 'CLICKED' | 'CONVERTED';

export interface CampaignEvent {
  id: string;
  campaignId: string;
  customerId?: string;
  type: EventType;
  metadata?: Record<string, any>;
  createdAt: Date;
}

// Analytics Types
export interface CampaignAnalytics {
  campaignId: string;
  metrics: {
    sent: number;
    delivered: number;
    read: number;
    clicked: number;
    converted: number;
    revenue: number;
  };
  successScore: number;
  insights: string[];
  topPerformingAudience?: string;
  topPerformingChannel?: string;
}

// Agent Base Interface
export interface AgentResult<T> {
  data: T;
  reasoning: string;
  timestamp: Date;
}

// Orchestrator Types
export interface OrchestrationContext {
  goal: string;
  opportunity?: OpportunityResult;
  segment?: SegmentResult;
  strategy?: StrategyResult;
  content?: ContentResult;
}
