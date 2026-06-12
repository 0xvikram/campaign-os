# CampaignOS - Troubleshooting & Startup Guide

## Issues Fixed

### 1. **Missing Environment Variables**
- ✅ Created `apps/api/.env` with GROQ_API_KEY and DATABASE_URL
- ✅ Created `apps/web/.env.local` with NEXT_PUBLIC_API_URL
- ✅ Created `packages/db/.env` with DATABASE_URL

### 2. **CORS Configuration**
- ✅ Enhanced CORS headers in Fastify API to properly handle OPTIONS requests
- ✅ Added proper status code (200) for OPTIONS preflight requests

### 3. **Next.js API Proxy**
- ✅ Added API rewrites in `next.config.js` to proxy `/api/*` requests to backend
- This helps avoid CORS issues in production

### 4. **Centralized API Client**
- ✅ Created `apps/web/lib/api.ts` for type-safe API calls
- Uses environment variable for API base URL
- Handles errors consistently

## Required Setup Steps

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Set Up Database
```bash
cd packages/db
pnpm prisma generate
pnpm prisma db push
```

### 3. Configure Environment Variables

**apps/api/.env:**
```env
GROQ_API_KEY=your_actual_groq_api_key_here
DATABASE_URL="file:../../packages/db/prisma/dev.db"
CHANNEL_SERVICE_URL=http://localhost:3001
```

**apps/web/.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**packages/db/.env:**
```env
DATABASE_URL="file:./prisma/dev.db"
```

### 4. Start Services

**Terminal 1 - API Server (Port 3000):**
```bash
cd apps/api
pnpm dev
```

**Terminal 2 - Web Frontend (Port 3002):**
```bash
cd apps/web
pnpm dev
```

**Terminal 3 - Channel Service (Port 3001) [Optional]:**
```bash
cd apps/channel-service
pnpm dev
```

## Testing the Integration

### 1. Seed the Database
- Navigate to http://localhost:3002
- Click "Enter Console"
- Go to "Data" tab
- Click "Reset & Load Demo Data"
- Verify 100 customers are loaded

### 2. Generate a Campaign
- Go to "Workspace" tab
- Enter a goal or use a preset
- Click "Generate Campaign Strategy"
- Wait for agents to complete (10-15 seconds)
- Verify all 4 agents complete successfully

### 3. Launch and Monitor
- Click "Launch Campaign Now"
- Navigate to Analytics page
- Watch real-time event funnel updates

## Common Issues & Solutions

### Issue: "Connection refused" or "Failed to fetch"
**Solution:**
- Ensure API server is running on port 3000
- Check `apps/api/.env` has correct DATABASE_URL
- Verify CORS headers are applied (check browser console)

### Issue: "Campaign generation fails"
**Solution:**
- Verify GROQ_API_KEY is set in `apps/api/.env`
- Check API logs for errors
- Ensure database has customer/order data (seed first)

### Issue: "Database not found"
**Solution:**
```bash
cd packages/db
pnpm prisma generate
pnpm prisma db push
```

### Issue: "Module not found" errors
**Solution:**
```bash
# From root directory
pnpm install
turbo build
```

### Issue: Styles not loading
**Solution:**
- Verify `apps/web/app/globals.css` is imported in layout.tsx
- Clear Next.js cache: `rm -rf apps/web/.next`
- Restart dev server

## Architecture Overview

```
┌─────────────────────────────────────────┐
│  Web Frontend (Next.js - Port 3002)    │
│  - Console Dashboard                    │
│  - Campaign Workspace                   │
│  - Analytics Views                      │
└──────────────┬──────────────────────────┘
               │ HTTP Requests
               ↓
┌─────────────────────────────────────────┐
│  API Server (Fastify - Port 3000)      │
│  - Campaign Generation                  │
│  - Agent Orchestration                  │
│  - Database Queries                     │
└──────────────┬──────────────────────────┘
               │
         ┌─────┴─────┬──────────────┐
         ↓           ↓              ↓
    ┌────────┐  ┌─────────┐  ┌──────────────┐
    │ Agents │  │ Database│  │ Channel Svc  │
    │Package │  │ (SQLite)│  │ (Port 3001)  │
    └────────┘  └─────────┘  └──────────────┘
```

## Port Configuration

- **3000**: API Server (Fastify)
- **3001**: Channel Service (Event Simulator)
- **3002**: Web Frontend (Next.js)

## Next Steps (Optional Improvements)

1. **Replace hardcoded `localhost:3000`** in frontend with the api helper:
   - Import `api` from `~/lib/api.ts`
   - Replace `fetch('http://localhost:3000/...')` with `api.campaigns.get(id)`

2. **Add error boundaries** to React components for better error handling

3. **Add loading states** during API calls

4. **Implement retry logic** for failed API requests

5. **Add request/response logging** in the API client

## Verification Checklist

- [ ] All 3 services start without errors
- [ ] Database seeds successfully with 100 customers
- [ ] Campaign generation completes with all 4 agents
- [ ] Campaign launches and creates events
- [ ] Analytics page shows real-time funnel data
- [ ] Browser console shows no CORS errors
- [ ] Browser console shows no 404/500 errors

## Need Help?

Check logs in this order:
1. Browser DevTools Console (F12)
2. API Server Terminal Output
3. Database query logs (add `?debug=1` to Prisma client)
