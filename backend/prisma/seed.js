const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create an Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cindro.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@cindro.com',
      passwordHash: 'hashed_password_placeholder', // In a real app, hash this with bcrypt!
      role: 'ADMIN',
    },
  });

  console.log(`Created admin user with id: ${admin.id}`);

  // Create AppSettings
  const settings = await prisma.appSetting.create({
    data: {
      businessName: 'Cindro Deals Ltd',
      defaultCurrency: 'GBP',
      currencyDisplayFormat: 'SYMBOL',
      reportFooterText: 'Confidential Report - Cindro Deals Ltd',
      businessEmail: 'contact@cindro.com',
      defaultProfitSplitInvestor1: 50.0,
      defaultProfitSplitInvestor2: 50.0,
      lossHandling: 'SPLIT_PROPORTIONALLY',
    },
  });

  console.log(`Created app settings: ${settings.businessName}`);

  // Create a sample Deal
  const deal1 = await prisma.deal.create({
    data: {
      dealId: 'DL-0001',
      dealName: 'Dubai Electronics Batch',
      date: new Date('2026-06-01'),
      notes: 'High demand electronics imported from Dubai.',
      itemName: 'Smartphones',
      quantity: 50,
      costPricePerItem: 200.0,
      totalStockCost: 10000.0,
      flightCost: 500.0,
      luggageCost: 100.0,
      transportCost: 150.0,
      packageCost: 50.0,
      salaryExpense: 0.0,
      additionalExpenses: 0.0,
      investor1Name: 'Investor A',
      investor1Contribution: 5400.0,
      investor2Name: 'Investor B',
      investor2Contribution: 5400.0,
      totalCapitalInvested: 10800.0,
      totalSaleRevenue: 15000.0,
      totalExpenses: 10800.0,
      netProfit: 4200.0,
      profitShareInvestor1: 50.0,
      profitShareInvestor2: 50.0,
      finalPayoutInvestor1: 7500.0,
      finalPayoutInvestor2: 7500.0,
      status: 'PROFITABLE',
      currency: 'GBP',
      createdById: admin.id,
    },
  });

  console.log(`Created sample deal: ${deal1.dealId}`);

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
