import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES = ['Footwear', 'Apparel', 'Accessories', 'Electronics', 'Home'];

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seed() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.campaignEvent.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.segment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();

  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

  // Create 500 customers with varying behavior
  const customers = [];
  for (let i = 0; i < 500; i++) {
    const customer = await prisma.customer.create({
      data: {
        email: `customer${i}@example.com`,
        name: `Customer ${i}`,
        phone: `+91${9000000000 + i}`,
        createdAt: randomDate(sixMonthsAgo, now),
      },
    });
    customers.push(customer);
  }

  console.log('✅ Created 500 customers');

  // Create orders with different patterns
  let orderCount = 0;

  for (const customer of customers) {
    const customerType = Math.random();
    
    // 30% VIP customers (high frequency, high value)
    if (customerType < 0.3) {
      const orders = Math.floor(Math.random() * 10) + 5;
      for (let j = 0; j < orders; j++) {
        await prisma.order.create({
          data: {
            customerId: customer.id,
            amount: Math.floor(Math.random() * 5000) + 1000,
            category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
            createdAt: randomDate(new Date(customer.createdAt), now),
          },
        });
        orderCount++;
      }
    }
    // 25% Dormant customers (purchased before, not recently)
    else if (customerType < 0.55) {
      const orders = Math.floor(Math.random() * 3) + 1;
      const cutoff = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      for (let j = 0; j < orders; j++) {
        await prisma.order.create({
          data: {
            customerId: customer.id,
            amount: Math.floor(Math.random() * 3000) + 500,
            category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
            createdAt: randomDate(new Date(customer.createdAt), cutoff),
          },
        });
        orderCount++;
      }
    }
    // 25% At-risk customers (decreasing frequency)
    else if (customerType < 0.8) {
      const orders = Math.floor(Math.random() * 4) + 2;
      for (let j = 0; j < orders; j++) {
        const daysAgo = 30 + j * 15;
        await prisma.order.create({
          data: {
            customerId: customer.id,
            amount: Math.floor(Math.random() * 2000) + 300,
            category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
            createdAt: new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000),
          },
        });
        orderCount++;
      }
    }
    // 20% Regular customers (moderate activity)
    else {
      const orders = Math.floor(Math.random() * 5) + 2;
      for (let j = 0; j < orders; j++) {
        await prisma.order.create({
          data: {
            customerId: customer.id,
            amount: Math.floor(Math.random() * 1500) + 200,
            category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
            createdAt: randomDate(new Date(customer.createdAt), now),
          },
        });
        orderCount++;
      }
    }
  }

  console.log(`✅ Created ${orderCount} orders`);

  // Update customer aggregates
  const allCustomers = await prisma.customer.findMany({
    include: { orders: true },
  });

  for (const customer of allCustomers) {
    const totalSpent = customer.orders.reduce((sum, order) => sum + order.amount, 0);
    const lastOrder = customer.orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        totalSpent,
        orderCount: customer.orders.length,
        lastOrderAt: lastOrder?.createdAt,
      },
    });
  }

  console.log('✅ Updated customer aggregates');
  console.log('🎉 Seeding complete!');
}

seed()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
