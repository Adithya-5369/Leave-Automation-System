import api from './api';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login/', { email, password });
    return response.data;
  },
  
  verifyOtp: async (email: string, otp: string) => {
    const response = await api.post('/auth/verify-otp/', { email, otp });
    return response.data;
  },
  
  logout: async () => {
    await api.post('/auth/logout/');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me/');
    return response.data;
  }
};