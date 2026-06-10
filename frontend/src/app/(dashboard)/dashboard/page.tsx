"use client";
import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Table, Badge } from '@/components/ui';
import { dealService } from '@/services/dealService';
import { useCurrency } from '@/context/CurrencyContext';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { formatAmount } = useCurrency();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await dealService.getDashboardSummary();
        setSummary(data);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to fetch dashboard summary');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading Dashboard...</div>;
  if (!summary) return <div className="p-8 text-center text-red-500">Failed to load data</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline-lg">Dashboard</h1>
        <p className="text-secondary">Overview of all deals and performance.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="text-sm text-secondary uppercase">Total Revenue</div>
          <div className="text-3xl font-bold">{formatAmount(summary.totalRevenue || 0)}</div>
        </Card>
        <Card>
          <div className="text-sm text-secondary uppercase">Total Net Profit</div>
          <div className={`text-3xl font-bold ${(summary.totalNetProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatAmount(summary.totalNetProfit || 0)}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-secondary uppercase">Total Capital Invested</div>
          <div className="text-3xl font-bold">{formatAmount(summary.totalCapitalInvested || 0)}</div>
        </Card>
        <Card>
          <div className="text-sm text-secondary uppercase">Pending Deals</div>
          <div className="text-3xl font-bold text-[#FFD700]">{summary.activePendingDeals || 0}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-96 p-4">
          <h3 className="font-bold text-secondary mb-4">Profit Over Time</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={summary.profitOverTime}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} tickFormatter={(value) => formatAmount(value)} dx={-10} />
              <Tooltip 
                formatter={(value: any) => [formatAmount(value), 'Profit']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Line type="monotone" dataKey="profit" stroke="#FFD700" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="h-96 p-4">
          <h3 className="font-bold text-secondary mb-4">Monthly Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={summary.monthlyRevenue.map((r: any, i: number) => ({ name: r.name, revenue: r.revenue, expenses: summary.monthlyExpenses[i]?.expenses || 0 }))}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} tickFormatter={(value) => formatAmount(value)} dx={-10} />
              <Tooltip 
                formatter={(value: any, name: string) => [formatAmount(value), name === 'revenue' ? 'Revenue' : 'Expenses']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="expenses" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <h3 className="font-bold mb-4">Recent Deals</h3>
        {summary.recentDeals && summary.recentDeals.length > 0 ? (
          <Table>
            <thead>
               <tr className="border-b text-left">
                 <th className="p-2">ID</th>
                 <th className="p-2">Name</th>
                 <th className="p-2">Net Profit</th>
                 <th className="p-2">Status</th>
               </tr>
            </thead>
            <tbody>
              {summary.recentDeals.map((deal: any) => (
                <tr key={deal.id} className="border-b">
                  <td className="p-2">{deal.dealId}</td>
                  <td className="p-2">{deal.dealName}</td>
                  <td className={`p-2 font-bold ${deal.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatAmount(deal.netProfit)}
                  </td>
                  <td className="p-2">
                    <Badge variant={deal.status === 'PROFITABLE' ? 'success' : deal.status === 'LOSS' ? 'danger' : 'default'}>
                      {deal.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
           <div className="text-secondary text-sm">No recent deals found.</div>
        )}
      </Card>
    </div>
  );
}
