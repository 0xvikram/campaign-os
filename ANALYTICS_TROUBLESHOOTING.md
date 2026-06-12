# Analytics Troubleshooting Guide

## Issue: Analytics Not Showing After Campaign Launch

### Symptoms
- Launch a campaign successfully
- Navigate to analytics page
- See zeros for all metrics or "Events are being generated" message
- Data doesn't appear even after waiting

### Root Causes & Solutions

#### 1. Channel Service Not Running

**Problem**: The channel service (port 3001) generates the analytics events. If it's not running, no events will be created.

**Solution**:
```bash
# In a separate terminal, run:
pnpm run dev --filter=channel-service

# Or check if it's running:
curl http://localhost:3001/health
```

**Expected output**: `{"status":"ok"}`

#### 2. Services Not Started in Correct Order

**Problem**: Services must be started in the right sequence.

**Solution - Start all services**:
```bash
# Terminal 1: Database (if using local Postgres)
# Make sure your DATABASE_URL is configured

# Terminal 2: API Server (port 3000)
pnpm run dev --filter=api

# Terminal 3: Channel Service (port 3001)
pnpm run dev --filter=channel-service

# Terminal 4: Web App (port 3002)
pnpm run dev --filter=web
```

#### 3. Check Service Health

```bash
# API Server
curl http://localhost:3000/health

# Channel Service  
curl http://localhost:3001/health

# Web App
# Open http://localhost:3002 in browser
```

#### 4. Database Connection Issues

**Problem**: Events can't be saved if database connection fails.

**Solution**:
```bash
# Check your .env file in apps/api/ and packages/db/
DATABASE_URL="postgresql://user:password@localhost:5432/campaign_os"

# Run migrations
cd packages/db
pnpm prisma migrate dev

# Verify connection
pnpm prisma studio
```

#### 5. Port Conflicts

**Problem**: Another process is using ports 3000, 3001, or 3002.

**Solution**:
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :3002

# Kill processes if needed
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
lsof -i :3001
lsof -i :3002

kill -9 <PID>
```

### How Analytics Work

1. **Campaign Launch**: User clicks "Launch Campaign Now"
2. **API Endpoint**: `/campaigns/:id/launch` is called
3. **Status Update**: Campaign status changes from `draft` to `active`
4. **Channel Service Called**: API calls `http://localhost:3001/send` with campaign details
5. **Event Generation**: Channel service creates events asynchronously:
   - `SENT` - immediately
   - `DELIVERED` - after 1-3 seconds (90% success rate)
   - `READ` - after 2-5 more seconds (60% of delivered)
   - `CLICKED` - after 1-4 more seconds (40% of read)
   - `CONVERTED` - after 2-6 more seconds (30% of clicked)
6. **Analytics Display**: Events are fetched every 3 seconds by the analytics page

### Debugging Tips

#### Check API Logs
```bash
# Look for errors in API server output
# Should see: "Completed processing N messages for campaign XXX"
```

#### Check Database Events
```bash
cd packages/db
pnpm prisma studio

# Navigate to CampaignEvent table
# Should see SENT, DELIVERED, READ, CLICKED, CONVERTED events
```

#### Check Network Requests
```
# In browser DevTools (F12) > Network tab
# Watch for:
# - POST /campaigns/:id/launch (should return 200)
# - GET /campaigns/:id/analytics (should return data, not zeros)
```

#### Manual Event Creation (For Testing)
If you need to test analytics without waiting for the channel service:

```typescript
// In browser console on analytics page
await fetch('http://localhost:3000/campaigns/YOUR_CAMPAIGN_ID/analytics')
  .then(r => r.json())
  .then(console.log);
```

### Quick Fix: Restart Everything

If you're stuck, restart all services:

```bash
# Stop all services (Ctrl+C in each terminal)

# Terminal 1
pnpm run dev --filter=api

# Wait for "API server running on http://localhost:3000"

# Terminal 2  
pnpm run dev --filter=channel-service

# Wait for "Channel service running on http://localhost:3001"

# Terminal 3
pnpm run dev --filter=web

# Open http://localhost:3002
```

### Expected Behavior

✅ **Working correctly**:
- Launch campaign → immediate redirect to analytics
- See "Events are being generated" banner initially
- Within 10-30 seconds, see SENT count increasing
- Within 1-2 minutes, see DELIVERED, READ, CLICKED, CONVERTED events
- Metrics update every 3 seconds automatically

❌ **Not working**:
- Analytics stuck at zeros after 2+ minutes
- "Campaign not found" error
- Network errors in browser console
- Channel service not logging activity

### Environment Variables Checklist

**apps/api/.env**:
```env
DATABASE_URL="postgresql://..."
GROQ_API_KEY="your_key"
CHANNEL_SERVICE_URL="http://localhost:3001"
```

**apps/channel-service/.env**:
```env
DATABASE_URL="postgresql://..."
```

**packages/db/.env**:
```env
DATABASE_URL="postgresql://..."
```

### Still Not Working?

1. Check all terminals for error messages
2. Verify database is running and accessible
3. Ensure all dependencies are installed: `pnpm install`
4. Clear browser cache and hard reload (Ctrl+Shift+R)
5. Check if campaign status is actually 'active' in database
6. Verify customerIds array in campaign.audience is not empty
