import { Agent } from './base';
import { OpportunityResult, OrchestrationContext } from '@repo/types';
import { prisma } from '@repo/db';

export class OpportunityAgent implements Agent<OpportunityResult> {
  name = 'OpportunityAgent';

  async execute(context: OrchestrationContext): Promise<OpportunityResult> {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    const totalCustomers = await prisma.customer.count();
    console.log(`🔍 OpportunityAgent analyzing ${totalCustomers} total customers`);

    const opportunities = [];

    // Dormant customers (45-90 days since last order)
    const dormantCustomers = await prisma.customer.findMany({
      where: {
        lastOrderAt: {
          gte: ninetyDaysAgo,
          lte: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        },
      },
    });

    if (dormantCustomers.length > 0) {
      const estimatedRevenue = dormantCustomers.reduce((sum, c) => sum + c.totalSpent / c.orderCount, 0);
      console.log(`✅ Found ${dormantCustomers.length} dormant customers (45-90 days inactive)`);
      opportunities.push({
        type: 'DORMANT_CUSTOMERS',
        description: `Customers who haven't purchased in 45-90 days`,
        customerCount: dormantCustomers.length,
        estimatedRevenue: Math.round(estimatedRevenue),
        reason: 'These customers have purchased before but are at risk of churning. Re-engagement campaigns have high success rates within this window.',
      });
    }

    // Churn risk (no order in 90+ days, but active before)
    const churnRiskCustomers = await prisma.customer.findMany({
      where: {
        lastOrderAt: {
          lt: ninetyDaysAgo,
        },
        orderCount: {
          gte: 2,
        },
      },
    });

    if (churnRiskCustomers.length > 0) {
      const estimatedRevenue = churnRiskCustomers.reduce((sum, c) => sum + (c.totalSpent / c.orderCount) * 0.3, 0);
      opportunities.push({
        type: 'CHURN_RISK',
        description: 'Previously active customers at high churn risk',
        customerCount: churnRiskCustomers.length,
        estimatedRevenue: Math.round(estimatedRevenue),
        reason: 'These customers have made multiple purchases in the past but have been inactive for over 90 days. Win-back campaigns can recover 20-30% of these customers.',
      });
    }

    // VIP customers (high spend, active)
    const vipCustomers = await prisma.customer.findMany({
      where: {
        totalSpent: {
          gte: 10000,
        },
        lastOrderAt: {
          gte: sixtyDaysAgo,
        },
      },
    });

    if (vipCustomers.length > 0) {
      const estimatedRevenue = vipCustomers.reduce((sum, c) => sum + c.totalSpent / c.orderCount, 0);
      opportunities.push({
        type: 'VIP_UPSELL',
        description: 'High-value customers ready for premium offers',
        customerCount: vipCustomers.length,
        estimatedRevenue: Math.round(estimatedRevenue),
        reason: 'These customers have spent over ₹10,000 and are actively engaged. They respond well to exclusive offers and premium products.',
      });
    }

    // Frequent buyers (3+ orders in last 60 days)
    const frequentBuyers = await prisma.customer.findMany({
      where: {
        lastOrderAt: {
          gte: sixtyDaysAgo,
        },
      },
      include: {
        orders: {
          where: {
            createdAt: {
              gte: sixtyDaysAgo,
            },
          },
        },
      },
    });

    const highFrequency = frequentBuyers.filter((c) => c.orders.length >= 3);

    if (highFrequency.length > 0) {
      const estimatedRevenue = highFrequency.reduce((sum, c) => sum + c.totalSpent / c.orderCount, 0);
      opportunities.push({
        type: 'FREQUENT_BUYERS',
        description: 'Highly engaged customers with repeat purchases',
        customerCount: highFrequency.length,
        estimatedRevenue: Math.round(estimatedRevenue),
        reason: 'These customers have made 3+ purchases in the last 60 days. They are highly engaged and responsive to new product launches and loyalty programs.',
      });
    }

    // Category drop-off detection
    const categories = await prisma.order.groupBy({
      by: ['category'],
      _count: true,
    });

    for (const cat of categories) {
      const categoryCustomers = await prisma.customer.findMany({
        where: {
          orders: {
            some: {
              category: cat.category,
            },
          },
        },
        include: {
          orders: {
            where: { category: cat.category },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });

      const droppedOff = categoryCustomers.filter(
        (c) => c.orders[0] && c.orders[0].createdAt < sixtyDaysAgo
      );

      if (droppedOff.length > 20) {
        const estimatedRevenue = droppedOff.reduce((sum, c) => {
          const avgOrderValue = c.totalSpent / c.orderCount;
          return sum + avgOrderValue * 0.25;
        }, 0);

        opportunities.push({
          type: 'CATEGORY_DROPOFF',
          description: `${cat.category} buyers who haven't repurchased`,
          customerCount: droppedOff.length,
          estimatedRevenue: Math.round(estimatedRevenue),
          reason: `These customers previously bought ${cat.category} products but haven't returned to the category in 60+ days. Category-specific campaigns can reactivate 25-30% of these customers.`,
        });
      }
    }

    // Sort by estimated revenue
    opportunities.sort((a, b) => b.estimatedRevenue - a.estimatedRevenue);

    return {
      opportunities: opportunities.slice(0, 5), // Top 5 opportunities
      reasoning: `Analyzed ${await prisma.customer.count()} customers across multiple behavioral patterns. Identified ${opportunities.length} distinct opportunities based on recency, frequency, and monetary value. Prioritized by estimated revenue potential.`,
    };
  }
}
