const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { calculateDealTotals, validateDealInput, generateDealId } = require('../services/dealCalculator');

const getDeals = async (req, res, next) => {
  try {
    const { search, startDate, endDate, status, sortBy, page = 1, limit = 10 } = req.query;

    const where = {};
    if (search) {
      where.OR = [
        { dealName: { contains: search, mode: 'insensitive' } },
        { dealId: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) {
      where.status = status;
    }
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    let orderBy = { createdAt: 'desc' };
    if (sortBy === 'date_asc') orderBy = { date: 'asc' };
    if (sortBy === 'date_desc') orderBy = { date: 'desc' };
    if (sortBy === 'profit_desc') orderBy = { netProfit: 'desc' };
    if (sortBy === 'profit_asc') orderBy = { netProfit: 'asc' };

    const skip = (Number(page) - 1) * Number(limit);

    const [deals, total] = await Promise.all([
      prisma.deal.findMany({ where, orderBy, skip, take: Number(limit) }),
      prisma.deal.count({ where })
    ]);

    res.json({
      deals,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    next(error);
  }
};

const getDealById = async (req, res, next) => {
  try {
    const deal = await prisma.deal.findUnique({ where: { id: req.params.id } });
    if (!deal) {
      res.status(404);
      throw new Error('Deal not found');
    }
    res.json(deal);
  } catch (error) {
    next(error);
  }
};

const createDeal = async (req, res, next) => {
  try {
    const errors = validateDealInput(req.body);
    if (errors.length > 0) {
      res.status(400);
      throw new Error(`Validation Error: ${errors.join(', ')}`);
    }

    const calculatedData = calculateDealTotals(req.body);
    
    // Auto generate ID
    const lastDeal = await prisma.deal.findFirst({ orderBy: { createdAt: 'desc' }, select: { dealId: true } });
    const newDealId = generateDealId(lastDeal ? lastDeal.dealId : null);

    const deal = await prisma.deal.create({
      data: {
        dealId: newDealId,
        dealName: calculatedData.dealName || 'Unnamed Deal',
        date: calculatedData.date ? new Date(calculatedData.date) : new Date(),
        notes: calculatedData.notes,
        itemName: calculatedData.itemName,
        quantity: Number(calculatedData.quantity),
        costPricePerItem: calculatedData.costPricePerItem,
        totalStockCost: calculatedData.totalStockCost,
        flightCost: calculatedData.flightCost,
        luggageCost: calculatedData.luggageCost,
        transportCost: calculatedData.transportCost,
        packageCost: calculatedData.packageCost,
        salaryExpense: calculatedData.salaryExpense,
        additionalExpenses: calculatedData.additionalExpenses,
        miscellaneousNotes: calculatedData.miscellaneousNotes,
        investor1Name: calculatedData.investor1Name,
        investor1Contribution: calculatedData.investor1Contribution,
        investor2Name: calculatedData.investor2Name,
        investor2Contribution: calculatedData.investor2Contribution,
        totalCapitalInvested: calculatedData.totalCapitalInvested,
        totalSaleRevenue: calculatedData.totalSaleRevenue,
        totalExpenses: calculatedData.totalExpenses,
        netProfit: calculatedData.netProfit,
        profitShareInvestor1: calculatedData.profitShareInvestor1,
        profitShareInvestor2: calculatedData.profitShareInvestor2,
        finalPayoutInvestor1: calculatedData.finalPayoutInvestor1,
        finalPayoutInvestor2: calculatedData.finalPayoutInvestor2,
        status: calculatedData.status,
        currency: calculatedData.currency || 'GBP',
        createdById: req.user.id
      }
    });

    res.status(201).json(deal);
  } catch (error) {
    next(error);
  }
};

const updateDeal = async (req, res, next) => {
  try {
    const existing = await prisma.deal.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404);
      throw new Error('Deal not found');
    }

    const mergedData = { ...existing, ...req.body };
    const errors = validateDealInput(mergedData);
    if (errors.length > 0) {
      res.status(400);
      throw new Error(`Validation Error: ${errors.join(', ')}`);
    }

    const calculatedData = calculateDealTotals(mergedData);

    const deal = await prisma.deal.update({
      where: { id: req.params.id },
      data: {
        dealName: calculatedData.dealName,
        date: calculatedData.date ? new Date(calculatedData.date) : existing.date,
        notes: calculatedData.notes,
        itemName: calculatedData.itemName,
        quantity: Number(calculatedData.quantity),
        costPricePerItem: calculatedData.costPricePerItem,
        totalStockCost: calculatedData.totalStockCost,
        flightCost: calculatedData.flightCost,
        luggageCost: calculatedData.luggageCost,
        transportCost: calculatedData.transportCost,
        packageCost: calculatedData.packageCost,
        salaryExpense: calculatedData.salaryExpense,
        additionalExpenses: calculatedData.additionalExpenses,
        miscellaneousNotes: calculatedData.miscellaneousNotes,
        investor1Name: calculatedData.investor1Name,
        investor1Contribution: calculatedData.investor1Contribution,
        investor2Name: calculatedData.investor2Name,
        investor2Contribution: calculatedData.investor2Contribution,
        totalCapitalInvested: calculatedData.totalCapitalInvested,
        totalSaleRevenue: calculatedData.totalSaleRevenue,
        totalExpenses: calculatedData.totalExpenses,
        netProfit: calculatedData.netProfit,
        profitShareInvestor1: calculatedData.profitShareInvestor1,
        profitShareInvestor2: calculatedData.profitShareInvestor2,
        finalPayoutInvestor1: calculatedData.finalPayoutInvestor1,
        finalPayoutInvestor2: calculatedData.finalPayoutInvestor2,
        status: calculatedData.status,
        currency: calculatedData.currency,
      }
    });

    res.json(deal);
  } catch (error) {
    next(error);
  }
};

const deleteDeal = async (req, res, next) => {
  try {
    const deal = await prisma.deal.findUnique({ where: { id: req.params.id } });
    if (!deal) {
      res.status(404);
      throw new Error('Deal not found');
    }

    await prisma.deal.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deal removed' });
  } catch (error) {
    next(error);
  }
};

const getDashboardSummary = async (req, res, next) => {
  try {
    // We could optimize this using aggregate functions
    const allDeals = await prisma.deal.findMany();
    
    let totalDeals = allDeals.length;
    let totalRevenue = 0;
    let totalExpenses = 0;
    let totalNetProfit = 0;
    let totalCapitalInvested = 0;
    let investor1TotalReturns = 0;
    let investor2TotalReturns = 0;
    let activePendingDeals = 0;

    allDeals.forEach(d => {
      totalRevenue += Number(d.totalSaleRevenue);
      totalExpenses += Number(d.totalExpenses);
      totalNetProfit += Number(d.netProfit);
      totalCapitalInvested += Number(d.totalCapitalInvested);
      investor1TotalReturns += Number(d.finalPayoutInvestor1);
      investor2TotalReturns += Number(d.finalPayoutInvestor2);
      if (d.status === 'PENDING') activePendingDeals++;
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize last 6 months
    const last6Months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      last6Months.push({
        month: `${monthNames[d.getMonth()]}`,
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
        profit: 0,
        revenue: 0,
        expenses: 0
      });
    }

    allDeals.forEach(d => {
      if (d.date) {
        const dealDate = new Date(d.date);
        const match = last6Months.find(m => m.monthIndex === dealDate.getMonth() && m.year === dealDate.getFullYear());
        if (match) {
          match.profit += Number(d.netProfit);
          match.revenue += Number(d.totalSaleRevenue);
          match.expenses += Number(d.totalExpenses);
        }
      }
    });

    const profitOverTime = last6Months.map(m => ({ name: m.month, profit: m.profit }));
    const monthlyRevenue = last6Months.map(m => ({ name: m.month, revenue: m.revenue }));
    const monthlyExpenses = last6Months.map(m => ({ name: m.month, expenses: m.expenses }));

    const bestPerformingDeals = await prisma.deal.findMany({
      where: { status: 'PROFITABLE' },
      orderBy: { netProfit: 'desc' },
      take: 5
    });

    const recentDeals = await prisma.deal.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    res.json({
      totalDeals,
      totalRevenue,
      totalExpenses,
      totalNetProfit,
      totalCapitalInvested,
      investor1TotalReturns,
      investor2TotalReturns,
      activePendingDeals,
      profitOverTime,
      monthlyRevenue,
      monthlyExpenses,
      bestPerformingDeals,
      recentDeals
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDeals,
  getDealById,
  createDeal,
  updateDeal,
  deleteDeal,
  getDashboardSummary
};
