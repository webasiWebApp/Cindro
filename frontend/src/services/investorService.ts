import api from './api';

export const investorService = {
  getSummary: async () => {
    const { data } = await api.get('/investors/summary');
    return data;
  },

  getPayouts: async () => {
    const { data } = await api.get('/investors/payouts');
    return data;
  }
};
