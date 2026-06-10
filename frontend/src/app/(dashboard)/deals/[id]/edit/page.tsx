"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Input, Button } from '@/components/ui';
import { dealService } from '@/services/dealService';
import { useCurrency } from '@/context/CurrencyContext';
import toast from 'react-hot-toast';

export default function EditDealPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { formatAmount } = useCurrency();
  const [loadingInit, setLoadingInit] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const data = await dealService.getDealById(params.id);
        setFormData(data);
      } catch (err) {
        toast.error('Failed to load deal');
        router.push('/deals');
      } finally {
        setLoadingInit(false);
      }
    };
    fetchDeal();
  }, [params.id, router]);

  // Live preview calculation
  const quantity = Number(formData.quantity || 0);
  const cost = Number(formData.costPricePerItem || 0);
  const totalStockCost = quantity * cost;
  const totalExpenses = totalStockCost + Number(formData.flightCost || 0) + Number(formData.luggageCost || 0) + Number(formData.transportCost || 0) + Number(formData.packageCost || 0) + Number(formData.salaryExpense || 0) + Number(formData.additionalExpenses || 0);
  const netProfit = Number(formData.totalSaleRevenue || 0) - totalExpenses;

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await dealService.updateDeal(params.id, formData);
      toast.success('Deal updated and recalculated successfully!');
      router.push(`/deals/${params.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update deal');
    } finally {
      setSaving(false);
    }
  };

  if (loadingInit) return <div className="p-8">Loading deal data...</div>;

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <h1 className="font-headline-lg">Edit Deal {formData.dealId}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-col-reverse lg:flex-row">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <p className="text-red-500 text-sm mb-4 font-bold">Warning: Changing financial values will recalculate profits on the backend.</p>
            <h2 className="font-bold mb-4">General Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Deal Name" name="dealName" value={formData.dealName} onChange={handleChange} />
              <Input label="Item Name" name="itemName" value={formData.itemName} onChange={handleChange} />
              <Input label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} />
              <Input label="Cost Price" name="costPricePerItem" type="number" value={formData.costPricePerItem} onChange={handleChange} />
            </div>
          </Card>

          <Card>
            <h2 className="font-bold mb-4">Expenses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Flight Cost" name="flightCost" type="number" value={formData.flightCost} onChange={handleChange} />
              <Input label="Luggage Cost" name="luggageCost" type="number" value={formData.luggageCost} onChange={handleChange} />
              <Input label="Transport Cost" name="transportCost" type="number" value={formData.transportCost} onChange={handleChange} />
              <Input label="Package Cost" name="packageCost" type="number" value={formData.packageCost} onChange={handleChange} />
            </div>
          </Card>

          <Card>
            <h2 className="font-bold mb-4">Sales</h2>
            <Input label="Total Expected/Actual Revenue" name="totalSaleRevenue" type="number" value={formData.totalSaleRevenue} onChange={handleChange} />
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <h2 className="font-bold mb-4">Live Preview</h2>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between"><span>Stock Cost</span><span>{formatAmount(totalStockCost)}</span></div>
              <div className="flex justify-between"><span>Total Expenses</span><span>{formatAmount(totalExpenses)}</span></div>
              <div className="flex justify-between border-t pt-2 mt-2 font-bold">
                 <span>Net Profit Preview</span>
                 <span className={netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>{formatAmount(netProfit)}</span>
              </div>
            </div>
            <Button className="w-full" onClick={handleSave} disabled={saving}>
              {saving ? 'Updating...' : 'Save Changes'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
