# Testing the Fixes

## Quick Start

1. **Check if services are running:**
   ```bash
   # Windows
   check-services.bat
   
   # Linux/Mac
   bash check-services.sh
   ```

2. **Start all services** (3 separate terminals):
   ```bash
   # Terminal 1: API Server
   pnpm run dev --filter=api
   
   # Terminal 2: Channel Service (CRITICAL for analytics)
   pnpm run dev --filter=channel-service
   
   # Terminal 3: Web App
   pnpm run dev --filter=web
   ```

3. **Open browser**: http://localhost:3002

---

## Test 1: Verify AI Differentiation

**Goal**: Confirm that different campaign goals produce different strategies

### Steps:

1. Go to Console (http://localhost:3002/console)

2. Create **Campaign 1 - Dormant Customers**:
   - Goal: "Re-engage dormant footwear customers who haven't purchased in 60 days"
   - Click "Generate Campaign Strategy"
   - **Expected Strategy**:
     - Channel: WhatsApp
     - Offer: 20-30% discount
     - Timing: Morning (9-11 AM) or urgent deadline
     - Tone: Urgent, "we miss you"

3. Create **Campaign 2 - VIP Upsell**:
   - Goal: "Target high-value customers who spent over ₹10,000 for premium products"
   - Click "Generate Campaign Strategy"
   - **Expected Strategy**:
     - Channel: Email
     - Offer: Exclusive access OR small discount (5-10%)
     - Timing: Weekend or evening
     - Tone: Premium, exclusive, VIP treatment

4. Create **Campaign 3 - Frequent Buyers**:
   - Goal: "Reward customers who made 3+ purchases in the last 60 days"
   - Click "Generate Campaign Strategy"
   - **Expected Strategy**:
     - Channel: Push Notification
     - Offer: Loyalty points, free shipping, rewards
     - Timing: Afternoon (3-5 PM)
     - Tone: Appreciative, "thank you"

### ✅ Success Criteria:
- Each campaign has a **DIFFERENT** channel
- Each campaign has a **DIFFERENT** offer type and amount
- Each campaign has a **DIFFERENT** timing
- Content tone matches the segment (urgent vs premium vs appreciative)

### ❌ Failure (Old Behavior):
- All campaigns: WhatsApp, 15% discount, 6-8 PM
- Same reasoning across all campaigns

---

## Test 2: Verify Analytics Work

**Goal**: Confirm analytics load properly and show real-time events

### Steps:

1. Create any campaign (use preset or custom goal)

2. Click "Launch Campaign Now"
   - Should redirect to analytics page immediately
   - Should NOT see "Campaign not found" error

3. **Check Analytics Page**:
   - ✅ Should see at least 1 SENT event immediately
   - ✅ Should see yellow banner: "Events are being generated"
   - ✅ Within 10-30 seconds, see DELIVERED count increasing
   - ✅ Within 1-2 minutes, see READ, CLICKED, CONVERTED events
   - ✅ Page auto-refreshes every 3 seconds

### ✅ Success Criteria:
- Analytics page loads (not "not found")
- At least 1 event shows immediately
- Events increase over time (30-120 seconds)
- Informational banner explains what's happening
- No silent failures

### ❌ If You See Zeros After 2 Minutes:

**Error Message**: "Events are being generated" banner still showing

**Solution**:
1. Check channel service is running:
   ```bash
   curl http://localhost:3001/health
   ```
   Should return: `{"status":"ok"}`

2. If not running:
   ```bash
   pnpm run dev --filter=channel-service
   ```

3. Re-launch the campaign

**Error Message**: "Campaign not found"

**Solution**: Campaign ID is invalid, create a new campaign

---

## Test 3: Console Data Tab

**Goal**: Verify customer/order data loads properly

### Steps:

1. Go to Console → Data tab

2. If no data shows:
   - Click "Reset & Load Demo Data"
   - Wait 5-10 seconds
   - Should see success message

3. Click "Customers" tab:
   - Should see 500 customers
   - Should show name, email, orders, spent, last order
   - Pagination should work

4. Click "Orders" tab:
   - Should see 1000+ orders
   - Should show order ID, customer, amount, category, date
   - Pagination should work

### ✅ Success Criteria:
- Data loads within 2 seconds
- Customers show: 500 rows
- Orders show: 1000+ rows
- Pagination works correctly

---

## Common Issues

### Issue: "GROQ_API_KEY not configured"

**Solution**: 
```bash
cd apps/api
cp .env.example .env
# Edit .env and add your Groq API key
```

### Issue: Analytics stuck at 0 after 2+ minutes

**Cause**: Channel service not running

**Solution**:
```bash
# Start channel service in new terminal
pnpm run dev --filter=channel-service
```

### Issue: All campaigns produce identical strategies

**Cause**: Old code still cached

**Solution**:
```bash
# Stop all services (Ctrl+C)
# Restart API server
pnpm run dev --filter=api
```

### Issue: Database errors

**Solution**:
```bash
cd packages/db
pnpm prisma migrate dev
pnpm prisma generate
```

---

## Verification Checklist

Use this to confirm all fixes are working:

- [ ] Created 3 different campaigns with different goals
- [ ] Each campaign has different channel (WhatsApp, Email, Push)
- [ ] Each campaign has different offer amounts (25% vs 10% vs loyalty rewards)
- [ ] Each campaign has different timing (morning vs evening vs afternoon)
- [ ] Content tone matches segment type (urgent vs premium vs appreciative)
- [ ] Launched campaign redirects to analytics immediately
- [ ] Analytics shows at least 1 SENT event right away
- [ ] Analytics shows informational banner explaining progress
- [ ] Events increase over 30-120 seconds
- [ ] Console data tab loads customers and orders
- [ ] No silent errors or stuck loading states

---

## Expected Timeline for Analytics

After clicking "Launch Campaign Now":

- **0 seconds**: Redirect to analytics page
- **0-1 seconds**: See 1 SENT event (instant feedback)
- **5-10 seconds**: See 10-20 SENT events
- **15-30 seconds**: See DELIVERED events appearing (~90% of sent)
- **30-60 seconds**: See READ events appearing (~60% of delivered)
- **60-90 seconds**: See CLICKED events appearing (~40% of read)
- **90-120 seconds**: See CONVERTED events appearing (~30% of clicked)

Total processing time: **2-5 minutes** for 50-100 customers

---

## Logs to Check

### API Server Logs:
```
✅ OpportunityAgent analyzing X customers
✅ Found Y dormant customers
🤖 StrategyAgent executing...
✅ Campaign created: [ID]
📡 Triggering channel service...
```

### Channel Service Logs:
```
📡 Channel service running on http://localhost:3001
✅ Completed processing X messages for campaign Y
```

### Browser Console (F12):
```
GET /campaigns/:id/analytics → 200 OK
Response: { metrics: { sent: 10, delivered: 9, ... } }
```

---

## Next Steps After Testing

Once you verify:
1. ✅ Campaigns produce different strategies
2. ✅ Analytics work and show events
3. ✅ Data tab loads properly

You're ready to demonstrate the system showing:
- Intelligent AI differentiation based on customer segments
- Real-time analytics with event tracking
- Complete end-to-end campaign workflow
