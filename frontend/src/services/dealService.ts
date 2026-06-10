import api from './api';

export const dealService = {
  getDeals: async (params?: any) => {
    const { data } = await api.get('/deals', { params });
    return data;
  },
  
  getDealById: async (id: string) => {
    const { data } = await api.get(`/deals/${id}`);
    return data;
  },

  getDashboardSummary: async () => {
    const { data } = await api.get('/deals/summary/dashboard');
    return data;
  },

  createDeal: async (dealData: any) => {
    const { data } = await api.post('/deals', dealData);
    return data;
  },

  updateDeal: async (id: string, dealData: any) => {
    const { data } = await api.put(`/deals/${id}`, dealData);
    return data;
  },

  deleteDeal: async (id: string) => {
    const { data } = await api.delete(`/deals/${id}`);
    return data;
  }
};
