import api from './api';

export const settingsService = {
  getSettings: async () => {
    const { data } = await api.get('/settings');
    return data;
  },

  updateSettings: async (settingsData: any) => {
    const { data } = await api.put('/settings', settingsData);
    return data;
  }
};
