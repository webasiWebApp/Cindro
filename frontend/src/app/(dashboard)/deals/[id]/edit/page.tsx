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
        if (!data.items) data.items = []; // Ensure items exists
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
  const totalStockCost = (formData.items || []).reduce((sum: number, item: any) => sum + ((Number(item.quantity) || 0) * (Number(item.costPricePerItem) || 0)), 0);
  const totalExpenses = totalStockCost + Number(formData.flightCost || 0) + Number(formData.luggageCost || 0) + Number(formData.baggageAllowanceCost || 0) + Number(formData.transportCost || 0) + Number(formData.packageCost || 0) + Number(formData.salaryExpense || 0) + Number(formData.additionalExpenses || 0);
  const netProfit = Number(formData.totalSaleRevenue || 0) - totalExpenses;

  const inv1 = Number(formData.investor1Contribution) || 0;
  const inv2 = Number(formData.investor2Contribution) || 0;
  const totalCapital = inv1 + inv2;
  const inv1Percent = totalCapital > 0 ? Math.round((inv1 / totalCapital) * 100) : 0;
  const inv2Percent = totalCapital > 0 ? Math.round((inv2 / totalCapital) * 100) : 0;

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index: number, e: any) => {
    const { name, value } = e.target;
    const newItems: any = [...(formData.items || [])];
    newItems[index][name] = value;
    setFormData((prev: any) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData((prev: any) => ({ ...prev, items: [...(prev.items || []), { itemName: '', quantity: 1, costPricePerItem: 0 }] }));
  };

  const removeItem = (index: number) => {
    const newItems = (formData.items || []).filter((_: any, i: number) => i !== index);
    setFormData((prev: any) => ({ ...prev, items: newItems }));
  };

  const handleSave = async () => {
    // Convert and validate numeric fields
    const payload: any = { ...formData, items: [...(formData.items || []).map((i: any) => ({...i}))] };
    const numericFields = ['flightCost', 'luggageCost', 'baggageAllowanceCost', 'transportCost', 'packageCost', 'salaryExpense', 'additionalExpenses', 'investor1Contribution', 'investor2Contribution', 'totalSaleRevenue'];
    
    for (const field of numericFields) {
      if (payload[field] !== '' && payload[field] !== undefined) {
        const val = Number(payload[field]);
        if (isNaN(val)) {
          toast.error(`Invalid number format in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
          return;
        }
        payload[field] = val;
      } else {
        payload[field] = 0;
      }
    }

    for (let i = 0; i < payload.items.length; i++) {
      const item = payload.items[i];
      const q = Number(item.quantity);
      const c = Number(item.costPricePerItem);
      if (isNaN(q) || isNaN(c)) {
        toast.error(`Invalid number format in Stock Item ${i + 1}`);
        return;
      }
      item.quantity = q;
      item.costPricePerItem = c;
    }

    try {
      setSaving(true);
      await dealService.updateDeal(params.id, payload);
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
              <Input label="Deal Name" name="dealName" value={formData.dealName || ''} onChange={handleChange} />
            </div>
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold">Stock Items</h2>
              <Button size="sm" onClick={addItem} type="button">+ Add Item</Button>
            </div>
            <div className="space-y-4">
              {(formData.items || []).map((item: any, index: number) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border-b pb-4 last:border-0 last:pb-0">
                  <div className="md:col-span-5">
                    <Input label="Item Name" name="itemName" value={item.itemName || ''} onChange={(e: any) => handleItemChange(index, e)} />
                  </div>
                  <div className="md:col-span-3">
                    <Input label="Quantity" name="quantity" value={item.quantity || ''} onChange={(e: any) => handleItemChange(index, e)} />
                  </div>
                  <div className="md:col-span-3">
                    <Input label="Cost Price" name="costPricePerItem" value={item.costPricePerItem || ''} onChange={(e: any) => handleItemChange(index, e)} />
                  </div>
                  <div className="md:col-span-1 pb-2">
                    {(formData.items || []).length > 1 && (
                      <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 font-bold" title="Remove Item">
                        &times;
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="font-bold mb-4">Expenses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Flight Cost" name="flightCost" value={formData.flightCost || ''} onChange={handleChange} />
              <Input label="Luggage Cost" name="luggageCost" value={formData.luggageCost || ''} onChange={handleChange} />
              <Input label="Baggage Allowance" name="baggageAllowanceCost" value={formData.baggageAllowanceCost || ''} onChange={handleChange} />
              <Input label="Transport Cost" name="transportCost" value={formData.transportCost || ''} onChange={handleChange} />
              <Input label="Package Cost" name="packageCost" value={formData.packageCost || ''} onChange={handleChange} />
              <Input label="Salary Expense" name="salaryExpense" value={formData.salaryExpense || ''} onChange={handleChange} />
              <Input label="Additional Expenses (Hotel, packing UK, laundry bag etc)" name="additionalExpenses" value={formData.additionalExpenses || ''} onChange={handleChange} />
            </div>
          </Card>

          <Card>
            <h2 className="font-bold mb-4">Investor Contributions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Input label="Investor 1 Name" name="investor1Name" value={formData.investor1Name || ''} onChange={handleChange} />
               <Input label="Contribution" name="investor1Contribution" value={formData.investor1Contribution || ''} onChange={handleChange} helperText={totalCapital > 0 ? `(${inv1Percent}%)` : ''} />
               <Input label="Investor 2 Name" name="investor2Name" value={formData.investor2Name || ''} onChange={handleChange} />
               <Input label="Contribution" name="investor2Contribution" value={formData.investor2Contribution || ''} onChange={handleChange} helperText={totalCapital > 0 ? `(${inv2Percent}%)` : ''} />
            </div>
          </Card>

          <Card>
            <h2 className="font-bold mb-4">Sales</h2>
            <Input label="Total Expected/Actual Revenue" name="totalSaleRevenue" value={formData.totalSaleRevenue || ''} onChange={handleChange} />
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
