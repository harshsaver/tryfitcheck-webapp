# Stripe Fee Structure for Small Transactions

## Standard Stripe Fees
- **2.9% + $0.30** per successful transaction

## Impact on Our Pricing

| Price | Stripe Fee | You Receive | Effective Fee % |
|-------|-----------|-------------|-----------------|
| $0.10 | $0.303    | **$0.00** (loses money) | -203% |
| $0.25 | $0.307    | **$0.00** (loses money) | -23% |
| $0.50 | $0.315    | $0.185      | 37% |
| $1.00 | $0.329    | $0.671      | 33% |

## ⚠️ CRITICAL ISSUE

**You will LOSE MONEY on transactions under $0.50** due to Stripe's fixed $0.30 fee!

### Current Pricing (Will Lose Money):
- Performance ($0.10): **You LOSE $0.20 per transaction**
- Balanced ($0.25): **You LOSE $0.06 per transaction**
- Quality ($0.50): You receive $0.18

## Recommended Solutions

### Option 1: Minimum Transaction Amount
Set minimum price to **$1.00** to make Stripe fees reasonable (33% instead of 100%+)

```typescript
export const PRICING = {
  performance: { amount: 100, display: '$1.00', mode: 'performance' },
  balanced: { amount: 150, display: '$1.50', mode: 'balanced' },
  quality: { amount: 200, display: '$2.00', mode: 'quality' },
}
```

### Option 2: Credit Bundles
Sell credits in bundles to reduce per-transaction fees:
- 5 credits for $5 (effective $1.00/credit, 33% fee)
- 10 credits for $9 (effective $0.90/credit, 30% fee)
- 25 credits for $20 (effective $0.80/credit, 27% fee)

### Option 3: Alternative Payment Processors

Consider these for micropayments:

1. **Stripe Billing + Invoices** (Monthly billing)
   - Collect $10-20/month
   - Give credits based on amount
   - One fee per month instead of per-transaction

2. **Cryptocurrency** (No processing fees)
   - But requires crypto knowledge from users
   - Higher friction

3. **PayPal Micropayments**
   - 5% + $0.05 (better for under $12)
   - At $0.50: $0.075 fee (you get $0.425)
   - Still loses money under $0.20

## What Your Competition Does

Most AI image generation tools charge:
- **Midjourney**: $10/month minimum
- **DALL-E**: $15 for 115 credits ($0.13/image but bundled)
- **Stable Diffusion**: $9-49/month subscriptions
- **Runway ML**: $12-76/month subscriptions

**None** charge per-transaction under $1 due to payment processor fees.

## Current Implementation Warning

```typescript
// ⚠️ CURRENT CODE - WILL LOSE MONEY
export const PRICING = {
  performance: { amount: 10, display: '$0.10', mode: 'performance' },  // LOSES $0.20
  balanced: { amount: 25, display: '$0.25', mode: 'balanced' },        // LOSES $0.06
  quality: { amount: 50, display: '$0.50', mode: 'quality' },          // Gets $0.18
}
```

## Recommendation

Either:
1. **Raise minimum to $1.00** per transaction
2. **Implement credit bundles** (user buys $10 worth, gets 20-40 credits)
3. **Switch to monthly subscription** model

Otherwise you'll lose money on every transaction!
