# Data Loading Fix - Console Data Tab

## Problem

The Console Data tab sometimes loads customer/order data and sometimes doesn't. Users see an empty table with no explanation.

## Root Cause

**Line 125-126 in `apps/web/app/console/page.tsx`:**

```typescript
if (cRes.ok && oRes.ok) {  // ⚠️ BOTH must succeed
  setCustomers(await cRes.json());
  setOrders(await oRes.json());
}
```

**Issues:**
1. If **either** API call fails, **neither** customers nor orders get set
2. Errors are only logged to console (user sees nothing)
3. No way to retry without refreshing entire page
4. No empty state message when data fails to load

## Solution

### 1. Independent Loading
Each dataset now loads independently:
```typescript
if (cRes.ok) {
  const customerData = await cRes.json();
  setCustomers(customerData);
} else {
  setError('Failed to load customers...');
}

if (oRes.ok) {
  const orderData = await oRes.json();
  setOrders(orderData);
} else {
  setError('Failed to load orders...');
}
```

### 2. Error Messages
User now sees visible error messages when data fails to load.

### 3. Empty State UI
When no data loads, user sees:
- 📭 Empty state icon
- Clear message: "No data loaded"
- "Retry Loading" button
- "Seed Demo Data" button

### 4. Better Error Handling
Catch block now shows helpful message:
```
Cannot connect to API server. Make sure it's running: pnpm run dev --filter=api
```

## Result

**Before:**
- ❌ Sometimes empty table, no explanation
- ❌ Silent failures
- ❌ Must refresh page to retry

**After:**
- ✅ Customers load even if orders fail (and vice versa)
- ✅ Clear error messages
- ✅ Empty state with retry button
- ✅ Specific instructions on how to fix

## Files Modified

- `apps/web/app/console/page.tsx` - Fixed `fetchCustomerData()` function and added empty state UI

## Testing

1. **Stop API server**:
   - Navigate to Data tab
   - Should see empty state with "Cannot connect to API server" error
   - Should see retry button

2. **Start API server but empty database**:
   - Should see empty state
   - Click "Seed Demo Data"
   - Should load 500 customers and 1000+ orders

3. **Normal operation**:
   - Both customers and orders should load
   - Pagination should work
   - No errors visible
