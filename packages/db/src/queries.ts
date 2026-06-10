import { prisma } from './client';

export async function getCustomers(filters?: {
  segment?: string;
  minSpent?: number;
  maxSpent?: number;
  lastOrderBefore?: Date;
  lastOrderAfter?: Date;
}) {
  return prisma.customer.findMany({
    where: {
      segment: filters?.segment,
      totalSpent: {
        gte: filters?.minSpent,
        lte: filters?.maxSpent,
      },
      lastOrderAt: {
        lt: filters?.lastOrderBefore,
        gt: filters?.lastOrderAfter,
      },
    },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });
}

export async function getCustomersByIds(ids: string[]) {
  return prisma.customer.findMany({
    where: { id: { in: ids } },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}

export async function getOrdersByCategory(category: string, daysAgo?: number) {
  const since = daysAgo
    ? new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
    : undefined;

  return prisma.order.findMany({
    where: {
      category,
      createdAt: since ? { gte: since } : undefined,
    },
    include: {
      customer: true,
    },
  });
}

export async function createCampaign(data: {
  name: string;
  goal: string;
  opportunity: any;
  audience: any;
  strategy: any;
  content: any;
}) {
  return prisma.campaign.create({
    data: {
      ...data,
      status: 'draft',
    },
  });
}

export async function getCampaign(id: string) {
  return prisma.campaign.findUnique({
    where: { id },
    include: {
      events: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}

export async function launchCampaign(id: string) {
  return prisma.campaign.update({
    where: { id },
    data: {
      status: 'active',
      launchedAt: new Date(),
    },
  });
}

export async function createCampaignEvent(data: {
  campaignId: string;
  customerId?: string;
  type: string;
  metadata?: any;
}) {
  return prisma.campaignEvent.create({
    data,
  });
}

export async function getCampaignEvents(campaignId: string) {
  return prisma.campaignEvent.findMany({
    where: { campaignId },
    orderBy: { createdAt: 'desc' },
  });
}
