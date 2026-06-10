"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Input, Select, Table, Badge, Button } from '@/components/ui';
import { dealService } from '@/services/dealService';
import { useCurrency } from '@/context/CurrencyContext';
import toast from 'react-hot-toast';

export default function DealsPage() {
  const router = useRouter();
  const { formatAmount } = useCurrency();
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;
      
      const response = await dealService.getDeals(params);
      setDeals(response.deals || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, [statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="font-headline-lg">Deal History</h1>
        <Button onClick={() => router.push('/deals/new')}>+ New Deal</Button>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Input 
            placeholder="Search deals..." 
            className="w-full md:w-64" 
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e.target.value)}
          />
          <select 
            className="w-full md:w-48 bg-surface border border-border-hairline rounded px-3 py-2 outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
             <option value="">All Statuses</option>
             <option value="PENDING">Pending</option>
             <option value="PROFITABLE">Profitable</option>
             <option value="LOSS">Loss</option>
             <option value="CLOSED">Closed</option>
          </select>
        </div>
        
        {loading ? (
          <div className="py-4 text-center text-secondary">Loading...</div>
        ) : deals.length === 0 ? (
          <div className="py-4 text-center text-secondary">No deals found.</div>
        ) : (
          <Table>
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Net Profit</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal) => (
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
                  <td 
                    className="p-2 text-blue-500 cursor-pointer hover:underline"
                    onClick={() => router.push(`/deals/${deal.id}`)}
                  >
                    View
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
