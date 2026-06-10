import { Agent } from './base';
import { SegmentResult, OrchestrationContext } from '@repo/types';
import { prisma } from '@repo/db';

export class SegmentationAgent implements Agent<SegmentResult> {
  name = 'SegmentationAgent';

  async execute(context: OrchestrationContext): Promise<SegmentResult> {
    if (!context.opportunity) {
      throw new Error('Opportunity data required for segmentation');
    }

    // Get the top opportunity
    const topOpportunity = context.opportunity.opportunities[0];
    if (!topOpportunity) {
      throw new Error('No opportunities found');
    }

    let customers: any[] = [];
    let criteria: Record<string, any> = {};
    let reasoning = '';

    const now = new Date();

    switch (topOpportunity.type) {
      case 'DORMANT_CUSTOMERS': {
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        const fortyFiveDaysAgo = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000);

        customers = await prisma.customer.findMany({
          where: {
            lastOrderAt: {
              gte: ninetyDaysAgo,
              lte: fortyFiveDaysAgo,
            },
          },
        });

        criteria = {
          type: 'DORMANT_CUSTOMERS',
          lastOrderBetween: [ninetyDaysAgo.toISOString(), fortyFiveDaysAgo.toISOString()],
          minOrders: 1,
        };

        reasoning = `Selected ${customers.length} customers who last purchased between 45-90 days ago. This window is optimal for re-engagement before customers fully churn. They have demonstrated purchase intent and familiarity with the brand.`;
        break;
      }

      case 'CHURN_RISK': {
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

        customers = await prisma.customer.findMany({
          where: {
            lastOrderAt: {
              lt: ninetyDaysAgo,
            },
            orderCount: {
              gte: 2,
            },
          },
        });

        criteria = {
          type: 'CHURN_RISK',
          lastOrderBefore: ninetyDaysAgo.toISOString(),
          minOrders: 2,
        };

        reasoning = `Selected ${customers.length} previously loyal customers (2+ orders) who haven't purchased in over 90 days. These customers have proven value and purchase history, making them prime candidates for win-back campaigns with strong incentives.`;
        break;
      }

      case 'VIP_UPSELL': {
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        customers = await prisma.customer.findMany({
          where: {
            totalSpent: {
              gte: 10000,
            },
            lastOrderAt: {
              gte: sixtyDaysAgo,
            },
          },
        });

        criteria = {
          type: 'VIP_UPSELL',
          minSpent: 10000,
          lastOrderAfter: sixtyDaysAgo.toISOString(),
        };

        reasoning = `Selected ${customers.length} high-value customers with lifetime spend over ₹10,000 who are currently active. These customers have high engagement and purchasing power, making them ideal for premium products and exclusive offers.`;
        break;
      }

      case 'FREQUENT_BUYERS': {
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        const allCustomers = await prisma.customer.findMany({
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

        customers = allCustomers.filter((c) => c.orders.length >= 3);

        criteria = {
          type: 'FREQUENT_BUYERS',
          minOrdersInPeriod: 3,
          periodDays: 60,
        };

        reasoning = `Selected ${customers.length} highly engaged customers with 3+ orders in the last 60 days. These frequent buyers show strong brand loyalty and respond well to new product launches, early access programs, and loyalty rewards.`;
        break;
      }

      case 'CATEGORY_DROPOFF': {
        const categoryMatch = topOpportunity.description.match(/^(\w+) buyers/);
        const category = categoryMatch ? categoryMatch[1] : 'Footwear';
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        const categoryCustomers = await prisma.customer.findMany({
          where: {
            orders: {
              some: {
                category,
              },
            },
          },
          include: {
            orders: {
              where: { category },
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        });

        customers = categoryCustomers.filter(
          (c) => c.orders[0] && c.orders[0].createdAt < sixtyDaysAgo
        );

        criteria = {
          type: 'CATEGORY_DROPOFF',
          category,
          lastCategoryPurchaseBefore: sixtyDaysAgo.toISOString(),
        };

        reasoning = `Selected ${customers.length} customers who previously purchased ${category} products but haven't returned to the category in 60+ days. Category-specific campaigns with relevant products can effectively reactivate these customers.`;
        break;
      }

      default:
        throw new Error(`Unknown opportunity type: ${topOpportunity.type}`);
    }

    const customerIds = customers.map((c) => c.id);

    return {
      name: topOpportunity.type.replace(/_/g, ' ').toLowerCase(),
      criteria,
      customerIds,
      customerCount: customers.length,
      reasoning,
    };
  }
}
