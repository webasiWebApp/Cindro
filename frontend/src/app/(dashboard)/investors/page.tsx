"use client";
import React, { useEffect, useState } from 'react';
import { Card, Table } from '@/components/ui';
import { investorService } from '@/services/investorService';
import { useCurrency } from '@/context/CurrencyContext';
import toast from 'react-hot-toast';

export default function InvestorsPage() {
  const { formatAmount } = useCurrency();
  const [summary, setSummary] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumData, payData] = await Promise.all([
          investorService.getSummary(),
          investorService.getPayouts()
        ]);
        setSummary(sumData);
        setPayouts(payData);
      } catch (err: any) {
        toast.error('Failed to load investor data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-headline-lg">Investors</h1>
      
      {loading ? (
        <div>Loading investor data...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {summary.map((inv: any, idx: number) => (
               <Card key={idx}>
                 <h2 className="font-bold text-secondary">{inv.name}</h2>
                 <p className="text-3xl mt-2 font-bold">{formatAmount(inv.totalPayout)} Returns</p>
                 <p className="text-sm text-secondary mt-1">From {inv.dealsCount} deals</p>
               </Card>
             ))}
             {summary.length === 0 && <Card>No investors found.</Card>}
          </div>

          <Card>
             <h2 className="font-bold mb-4">Recent Payouts</h2>
             <Table>
               <thead>
                 <tr className="border-b text-left">
                   <th className="p-2">Deal</th>
                   <th className="p-2">Date</th>
                   <th className="p-2">Investor 1 Payout</th>
                   <th className="p-2">Investor 2 Payout</th>
                 </tr>
               </thead>
               <tbody>
                 {payouts.map((p: any) => (
                   <tr key={p.dealId} className="border-b">
                     <td className="p-2">{p.dealName} ({p.dealId})</td>
                     <td className="p-2">{new Date(p.date).toLocaleDateString()}</td>
                     <td className="p-2 font-bold text-green-600">{formatAmount(p.finalPayoutInvestor1)}</td>
                     <td className="p-2 font-bold text-green-600">{formatAmount(p.finalPayoutInvestor2)}</td>
                   </tr>
                 ))}
               </tbody>
             </Table>
          </Card>
        </>
      )}
    </div>
  );
}
