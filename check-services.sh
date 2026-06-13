#!/bin/bash

echo "🔍 CampaignOS Service Health Check"
echo "=================================="
echo ""

# Check API Server (port 3000)
echo -n "API Server (port 3000): "
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Running"
else
    echo "❌ Not responding"
    echo "   Start with: pnpm run dev --filter=api"
fi

echo -n "Channel Service (port 3001): "
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Running"
else
    echo "❌ Not responding"
    echo "   Start with: pnpm run dev --filter=channel-service"
fi

echo -n "Web App (port 3002): "
if curl -s http://localhost:3002 > /dev/null 2>&1; then
    echo "✅ Running"
else
    echo "❌ Not responding"
    echo "   Start with: pnpm run dev --filter=web"
fi

echo ""
echo "=================================="
echo "Quick Test Commands:"
echo "=================================="
echo ""
echo "1. Test campaign creation:"
echo "   curl -X POST http://localhost:3000/campaigns/generate \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"goal\": \"Re-engage dormant customers\"}'"
echo ""
echo "2. List campaigns:"
echo "   curl http://localhost:3000/campaigns"
echo ""
echo "3. Check customers:"
echo "   curl http://localhost:3000/customers | jq 'length'"
echo ""
