# CampaignOS - Setup & Testing Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or Neon DB account)
- Groq API key (for AI-powered content generation)

## Quick Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Create `.env` files in the following locations:

#### `packages/db/.env`
```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
```

#### `apps/api/.env`
```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
GROQ_API_KEY="your_groq_api_key_here"
CHANNEL_SERVICE_URL="http://localhost:3001"
```

### 3. Initialize Database

```bash
cd packages/db
pnpm db:generate
pnpm db:push
pnpm db:seed
```

This will:
- Generate Prisma client
- Push schema to database
- Seed with sample customer data (100 customers with orders)

### 4. Start Services

You need to run 3 services in separate terminals:

#### Terminal 1: API Server
```bash
cd apps/api
pnpm dev
```
Runs on http://localhost:3000

#### Terminal 2: Channel Service
```bash
cd apps/channel-service
pnpm dev
```
Runs on http://localhost:3001

#### Terminal 3: Web Frontend
```bash
cd apps/web
pnpm dev
```
Runs on http://localhost:3002

## Testing the End-to-End Flow

### 1. Campaign Creation
1. Open http://localhost:3002
2. Enter a business goal (or click an example)
3. Wait for AI agents to generate the campaign (~10-30 seconds)

**Example Goals:**
- "Increase repeat purchases among footwear buyers who have not purchased in the last 45 days"
- "Re-engage dormant customers who haven't made a purchase in 90 days"
- "Target high-value customers who spent more than ₹10,000 last month"

### 2. Campaign Workspace
After generation, you'll be redirected to the campaign workspace where you can:
- Review the AI-discovered opportunity
- See the generated audience segment
- Check the recommended strategy (channel, timing, offer)
- Preview the AI-generated content

### 3. Launch Campaign
Click "Launch Campaign" to:
- Change campaign status to "active"
- Trigger the channel service to simulate message delivery
- Start generating campaign events (SENT → DELIVERED → READ → CLICKED → CONVERTED)

### 4. Analytics Dashboard
After launch, you're redirected to the analytics dashboard which shows:
- **Real-time metrics** (auto-refreshes every 3 seconds)
- **Conversion funnel** with visual progress bars
- **Performance metrics** (delivery rate, open rate, click rate, conversion rate)
- **Revenue tracking** with average revenue per conversion
- **AI-powered insights** explaining campaign performance

## Testing Channel Service Event Simulation

The channel service simulates realistic campaign behavior:

1. **SENT** - Immediate (100%)
2. **DELIVERED** - 1-3 seconds delay (90% success rate)
3. **READ** - 2-5 seconds after delivery (60% of delivered)
4. **CLICKED** - 1-4 seconds after read (40% of read)
5. **CONVERTED** - 2-6 seconds after click (30% of clicked)

Revenue is randomly generated between ₹500-₹2500 for each conversion.

## Architecture Overview

### Apps
- **api** - Main API server (Fastify)
- **channel-service** - Message delivery simulation service (Fastify)
- **web** - Next.js frontend

### Packages
- **db** - Prisma schema and database queries
- **agents** - AI agents (Opportunity, Segmentation, Strategy, Content)
- **types** - Shared TypeScript types
- **ui** - Shared UI components

### Agent Pipeline

When you submit a goal, the following agents run in sequence:

1. **OpportunityAgent** - Analyzes customer data to find opportunities
2. **SegmentationAgent** - Creates targeted audience segments
3. **StrategyAgent** - Determines channel, timing, and offer (uses Groq LLM)
4. **ContentAgent** - Generates personalized content (uses Groq LLM)

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL in .env files
- Ensure PostgreSQL is running
- Check that database migrations are applied: `pnpm db:push`

### AI Agent Failures
- Verify GROQ_API_KEY is valid
- Check API rate limits
- View logs in the terminal running the API server

### Channel Service Not Triggering
- Ensure channel service is running on port 3001
- Check CHANNEL_SERVICE_URL in apps/api/.env
- View logs in both API and channel service terminals

### Frontend Not Loading Data
- Verify all 3 services are running
- Check browser console for errors
- Ensure CORS is not blocked

## API Endpoints

### Campaign Endpoints
- `POST /campaigns/generate` - Generate new campaign from goal
- `GET /campaigns/:id` - Get campaign details
- `POST /campaigns/:id/launch` - Launch campaign
- `GET /campaigns/:id/analytics` - Get campaign analytics
- `GET /campaigns` - List all campaigns

### Channel Service
- `POST /send` - Trigger message sending
- `GET /health` - Health check

## Sample Data

The seed script creates:
- 100 customers across different segments
- Orders in categories: Footwear, Clothing, Electronics, Books, Sports
- Various customer behaviors (dormant, active, high-value, etc.)

## Production Considerations

This is a demo/prototype. For production:

1. **Async Processing** - Use job queues (Bull, BullMQ) for campaign generation
2. **Real Channel Integration** - Replace simulation with actual APIs (Twilio, SendGrid, etc.)
3. **Database Optimization** - Add indexes, connection pooling
4. **Authentication** - Add user auth and multi-tenancy
5. **Error Handling** - Comprehensive error handling and retry logic
6. **Rate Limiting** - Protect APIs from abuse
7. **Monitoring** - Add logging, metrics, and alerts
8. **Scaling** - Deploy to cloud with auto-scaling

## Success Criteria Checklist

- [x] Customer data ingestion (via seed script)
- [x] Goal-based campaign generation
- [x] Multiple agents collaborating (Opportunity, Segmentation, Strategy, Content)
- [x] AI-generated audience and strategy
- [x] AI-generated campaign content
- [x] Campaign execution
- [x] Delivery event simulation (SENT, DELIVERED, READ, CLICKED, CONVERTED)
- [x] Analytics and campaign performance tracking
- [x] Explainability for every major decision
- [x] Believable vision as AI Brain for CRM systems

## Next Steps

This prototype demonstrates the core CampaignOS vision. Future enhancements:

1. **CRM Integrations** - Salesforce, HubSpot, Shopify connectors
2. **A/B Testing** - Automated experimentation framework
3. **Predictive Models** - ML-based conversion probability
4. **Multi-Channel** - Orchestrate across email, SMS, push, WhatsApp
5. **Customer Lifecycle** - Automated journey mapping
6. **Revenue Attribution** - Advanced ROI tracking
