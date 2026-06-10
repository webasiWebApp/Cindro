const PDFDocument = require('pdfkit-table');

function formatCurrency(amount, currency) {
  const formatter = new Intl.NumberFormat(currency === 'AED' ? 'en-AE' : 'en-GB', {
    style: 'currency',
    currency: currency || 'GBP',
    minimumFractionDigits: 2
  });
  return formatter.format(Number(amount));
}

async function generateDealPdf(deal, settings, res) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });

      const businessName = settings?.businessName || 'Cindro Deals Ltd';
      const footerText = settings?.reportFooterText || 'Confidential Business Report';

      // Pipe output directly to the response object
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=deal-report-${deal.dealId}.pdf`);
      doc.pipe(res);

      // --- HEADER ---
      // Gold accent line
      doc.rect(0, 0, 595, 10).fill('#FFD700'); // Gold

      doc.moveDown(2);
      doc.fillColor('#000000').fontSize(24).text(businessName, { align: 'right' });
      doc.fontSize(10).fillColor('gray').text('Business Deal Tracker & Profit Calculator', { align: 'right' });
      doc.moveDown(1);
      doc.fillColor('black').fontSize(20).text('DEAL REPORT', { align: 'left' });
      doc.fontSize(12).text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'left' });
      doc.moveDown(2);

      // --- GENERAL INFORMATION ---
      doc.fontSize(14).fillColor('#FFD700').text('General Information').fillColor('black');
      doc.moveDown(0.5);
      
      const genInfoTable = {
        headers: ["Field", "Details"],
        rows: [
          ["Deal ID", deal.dealId],
          ["Deal Name", deal.dealName],
          ["Status", deal.status],
          ["Item", deal.itemName],
          ["Quantity", String(deal.quantity)],
          ["Deal Date", new Date(deal.date).toLocaleDateString()]
        ]
      };

      doc.table(genInfoTable, { width: 300 });
      doc.moveDown(2);

      // --- FINANCIAL SUMMARY ---
      doc.fontSize(14).fillColor('#FFD700').text('Financial Breakdown').fillColor('black');
      doc.moveDown(0.5);

      const cur = deal.currency;
      const finTable = {
        headers: ["Category", "Amount"],
        rows: [
          ["Total Stock Cost", formatCurrency(deal.totalStockCost, cur)],
          ["Flight Cost", formatCurrency(deal.flightCost, cur)],
          ["Luggage Cost", formatCurrency(deal.luggageCost, cur)],
          ["Transport Cost", formatCurrency(deal.transportCost, cur)],
          ["Package Cost", formatCurrency(deal.packageCost, cur)],
          ["Salary & Additional", formatCurrency(Number(deal.salaryExpense) + Number(deal.additionalExpenses), cur)],
          ["", ""],
          ["TOTAL EXPENSES", formatCurrency(deal.totalExpenses, cur)],
          ["TOTAL REVENUE", formatCurrency(deal.totalSaleRevenue, cur)],
          ["NET PROFIT / LOSS", formatCurrency(deal.netProfit, cur)]
        ]
      };
      
      doc.table(finTable, { width: 400 });
      doc.moveDown(2);

      // --- INVESTOR CONTRIBUTIONS & PAYOUTS ---
      doc.fontSize(14).fillColor('#FFD700').text('Investor Distributions').fillColor('black');
      doc.moveDown(0.5);

      const invTable = {
        headers: ["Investor", "Contribution", "Profit Share", "Final Payout"],
        rows: [
          [
            deal.investor1Name || "Investor 1", 
            formatCurrency(deal.investor1Contribution, cur), 
            formatCurrency(deal.profitShareInvestor1, cur), 
            formatCurrency(deal.finalPayoutInvestor1, cur)
          ],
          [
            deal.investor2Name || "Investor 2", 
            formatCurrency(deal.investor2Contribution, cur), 
            formatCurrency(deal.profitShareInvestor2, cur), 
            formatCurrency(deal.finalPayoutInvestor2, cur)
          ]
        ]
      };

      doc.table(invTable, { width: 500 });
      doc.moveDown(2);

      // --- NOTES ---
      if (deal.notes || deal.miscellaneousNotes) {
        doc.fontSize(14).fillColor('#FFD700').text('Notes').fillColor('black');
        doc.fontSize(10).text(deal.notes || "None");
        doc.text(deal.miscellaneousNotes || "");
      }

      // --- FOOTER ---
      doc.on('pageAdded', () => {
         doc.rect(0, 0, 595, 10).fill('#FFD700'); // Gold line on new pages
      });

      let pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(8).fillColor('gray').text(
          footerText,
          50,
          doc.page.height - 50,
          { align: 'center', width: doc.page.width - 100 }
        );
      }

      doc.end();

      // Resolve when stream finishes
      res.on('finish', () => resolve());
      res.on('error', (err) => reject(err));

    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generateDealPdf };
