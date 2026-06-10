const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getReports = async (req, res, next) => {
  try {
    const reports = await prisma.reportLog.findMany({
      include: {
        deal: { select: { dealName: true, dealId: true } },
        generatedBy: { select: { name: true, email: true } }
      },
      orderBy: { generatedAt: 'desc' }
    });
    res.json(reports);
  } catch (error) {
    next(error);
  }
};

const { generateDealPdf } = require('../services/pdfService');

const generatePdf = async (req, res, next) => {
  try {
    const deal = await prisma.deal.findUnique({ where: { id: req.params.id } });
    if (!deal) {
      res.status(404);
      throw new Error('Deal not found');
    }

    const settings = await prisma.appSetting.findFirst();

    // Log the PDF generation
    await prisma.reportLog.create({
      data: {
        dealId: deal.id,
        generatedById: req.user.id,
        reportType: 'PDF_REPORT'
      }
    });

    // Stream PDF directly to response
    await generateDealPdf(deal, settings, res);

  } catch (error) {
    next(error);
  }
};

const getPreview = async (req, res, next) => {
  try {
    const deal = await prisma.deal.findUnique({ where: { id: req.params.id } });
    if (!deal) {
      res.status(404);
      throw new Error('Deal not found');
    }

    res.json({ message: 'Preview data', deal });
  } catch (error) {
    next(error);
  }
};

module.exports = { getReports, generatePdf, getPreview };
