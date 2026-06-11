const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getInvestorsSummary = async (req, res, next) => {
  try {
    const deals = await prisma.deal.findMany({ where: { createdById: req.user.id } });
    
    // We only have Investor 1 and Investor 2 loosely defined in the deals as strings for now
    // according to the schema logic. So we group by investor name.
    const investorMap = {};

    deals.forEach(deal => {
      const names = [
        { name: deal.investor1Name, contribution: deal.investor1Contribution, payout: deal.finalPayoutInvestor1 },
        { name: deal.investor2Name, contribution: deal.investor2Contribution, payout: deal.finalPayoutInvestor2 },
      ];

      names.forEach(inv => {
        if (inv.name) {
          if (!investorMap[inv.name]) {
            investorMap[inv.name] = { name: inv.name, totalContribution: 0, totalPayout: 0, dealsCount: 0 };
          }
          investorMap[inv.name].totalContribution += Number(inv.contribution);
          investorMap[inv.name].totalPayout += Number(inv.payout);
          investorMap[inv.name].dealsCount++;
        }
      });
    });

    res.json(Object.values(investorMap));
  } catch (error) {
    next(error);
  }
};

const getInvestorPayouts = async (req, res, next) => {
  try {
    const deals = await prisma.deal.findMany({
      where: { status: { in: ['PROFITABLE', 'LOSS', 'CLOSED'] }, createdById: req.user.id },
      select: {
        dealId: true,
        dealName: true,
        investor1Name: true,
        finalPayoutInvestor1: true,
        investor2Name: true,
        finalPayoutInvestor2: true,
        date: true
      },
      orderBy: { date: 'desc' }
    });
    
    res.json(deals);
  } catch (error) {
    next(error);
  }
};

module.exports = { getInvestorsSummary, getInvestorPayouts };
