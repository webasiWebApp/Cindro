import api from './api';

export const reportService = {
  getReports: async () => {
    const { data } = await api.get('/reports');
    return data;
  },

  downloadDealPdf: async (id: string, dealId: string) => {
    const response = await api.post(`/reports/deal/${id}/pdf`, {}, {
      responseType: 'blob' // Important for handling binary file data
    });
    
    // Create a Blob from the PDF Stream
    const file = new Blob([response.data], { type: 'application/pdf' });
    
    // Build a URL from the file
    const fileURL = URL.createObjectURL(file);
    
    // Create a temp anchor tag to trigger download
    const link = document.createElement('a');
    link.href = fileURL;
    link.download = `deal-report-${dealId}.pdf`;
    link.click();
    
    // Clean up
    URL.revokeObjectURL(fileURL);
    return true;
  }
};
