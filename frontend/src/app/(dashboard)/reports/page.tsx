"use client";
import React, { useEffect, useState } from 'react';
import { Card, Table, Button } from '@/components/ui';
import { reportService } from '@/services/reportService';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await reportService.getReports();
        setReports(data);
      } catch (err: any) {
        toast.error('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleDownload = async (dealId: string, id: string) => {
    try {
      setDownloadingId(id);
      await reportService.downloadDealPdf(dealId, id);
      toast.success('Downloaded successfully');
    } catch (err) {
      toast.error('Download failed');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-headline-lg">Reports</h1>
      <Card>
        {loading ? (
          <div className="text-center py-4">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-4 text-secondary">No reports generated yet.</div>
        ) : (
          <Table>
             <thead><tr className="text-left border-b"><th className="p-2">Report Type</th><th className="p-2">Deal ID</th><th className="p-2">Generated Date</th><th className="p-2">Action</th></tr></thead>
             <tbody>
               {reports.map((report: any) => (
                 <tr key={report.id} className="border-b">
                   <td className="p-2">{report.reportType}</td>
                   <td className="p-2">{report.deal?.dealId}</td>
                   <td className="p-2">{new Date(report.generatedAt).toLocaleString()}</td>
                   <td className="p-2">
                     <Button 
                        variant="secondary" 
                        onClick={() => handleDownload(report.dealId, report.deal?.dealId)}
                        disabled={downloadingId === report.deal?.dealId}
                      >
                        {downloadingId === report.deal?.dealId ? 'Downloading...' : 'Download PDF'}
                     </Button>
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
