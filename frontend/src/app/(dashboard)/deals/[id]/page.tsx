"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Badge } from '@/components/ui';
import { dealService } from '@/services/dealService';
import { reportService } from '@/services/reportService';
import { useCurrency } from '@/context/CurrencyContext';
import toast from 'react-hot-toast';

export default function DealDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { formatAmount } = useCurrency();
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const data = await dealService.getDealById(params.id);
        setDeal(data);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to fetch deal details');
        router.push('/deals');
      } finally {
        setLoading(false);
      }
    };
    fetchDeal();
  }, [params.id, router]);

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      await reportService.downloadDealPdf(deal.id, deal.dealId);
      toast.success('PDF Downloaded successfully');
    } catch (err) {
      toast.error('Failed to download PDF');
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${deal.dealId}?`)) return;
    try {
      await dealService.deleteDeal(deal.id);
      toast.success('Deal deleted');
      router.push('/deals');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete deal');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading deal details...</div>;
  if (!deal) return <div className="p-8 text-center text-red-500">Deal not found</div>;

  const inv1 = Number(deal.investor1Contribution) || 0;
  const inv2 = Number(deal.investor2Contribution) || 0;
  const totalCapital = inv1 + inv2;
  const inv1Percent = totalCapital > 0 ? Math.round((inv1 / totalCapital) * 100) : 0;
  const inv2Percent = totalCapital > 0 ? Math.round((inv2 / totalCapital) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="font-headline-lg">Deal {deal.dealId} - {deal.dealName}</h1>
        <div className="flex gap-2">
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
          <Button variant="secondary" onClick={() => router.push(`/deals/${deal.id}/edit`)}>Edit</Button>
          <Button onClick={handleDownloadPdf} disabled={downloading}>
            {downloading ? 'Generating PDF...' : 'Download PDF'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-bold border-b pb-2 mb-4">Financial Summary</h2>
          <Badge variant={deal.status === 'PROFITABLE' ? 'success' : deal.status === 'LOSS' ? 'danger' : 'default'} className="mb-4">
            {deal.status}
          </Badge>
          
          <div className="space-y-2 mt-4">
            <div className="flex justify-between"><span>Revenue:</span> <span>{formatAmount(deal.totalSaleRevenue)}</span></div>
            <div className="flex justify-between"><span>Expenses:</span> <span>{formatAmount(deal.totalExpenses)}</span></div>
            <div className="flex justify-between font-bold border-t pt-2 mt-2">
              <span>Net Profit:</span> 
              <span className={deal.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>{formatAmount(deal.netProfit)}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="font-bold border-b pb-2 mb-4">Stock Items</h2>
          <div className="space-y-3">
            {deal.items && deal.items.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center text-sm border-b pb-2 last:border-0 last:pb-0">
                <div>
                  <div className="font-bold">{item.itemName}</div>
                  <div className="text-secondary">{item.quantity} units @ {formatAmount(item.costPricePerItem)}</div>
                </div>
                <div className="font-bold text-right">{formatAmount(item.totalCost)}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-bold border-b pb-2 mb-4">Investor Payouts</h2>
          <div className="space-y-4">
            <div>
              <div className="font-bold">{deal.investor1Name || 'Investor 1'}</div>
              <div className="flex justify-between text-sm"><span>Contribution:</span> <span>{formatAmount(deal.investor1Contribution)} <span className="text-secondary ml-1">({inv1Percent}%)</span></span></div>
              <div className="flex justify-between text-sm"><span>Profit Share:</span> <span>{formatAmount(deal.profitShareInvestor1)}</span></div>
              <div className="flex justify-between font-bold text-green-600 border-t mt-1 pt-1"><span>Final Payout:</span> <span>{formatAmount(deal.finalPayoutInvestor1)}</span></div>
            </div>
            <div className="pt-2 border-t border-dashed">
              <div className="font-bold">{deal.investor2Name || 'Investor 2'}</div>
              <div className="flex justify-between text-sm"><span>Contribution:</span> <span>{formatAmount(deal.investor2Contribution)} <span className="text-secondary ml-1">({inv2Percent}%)</span></span></div>
              <div className="flex justify-between text-sm"><span>Profit Share:</span> <span>{formatAmount(deal.profitShareInvestor2)}</span></div>
              <div className="flex justify-between font-bold text-green-600 border-t mt-1 pt-1"><span>Final Payout:</span> <span>{formatAmount(deal.finalPayoutInvestor2)}</span></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
