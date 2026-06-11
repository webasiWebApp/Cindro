import api from './api';

export const authService = {
  updateProfile: async (data: { name?: string, password?: string }) => {
    const { data: responseData } = await api.put('/auth/profile', data);
    return responseData;
  },

  register: async (name: string, email: string, password: string) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    if (data.token) {
      localStorage.setItem('cindro_token', data.token);
    }
    return data;
  },

  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.token) {
      localStorage.setItem('cindro_token', data.token);
    }
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('cindro_token');
    window.location.href = '/login';
  },

  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  }
};
