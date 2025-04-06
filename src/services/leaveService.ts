import api from './api';

export const leaveService = {
  getLeaveTypes: async () => {
    const response = await api.get('/leave-types/');
    return response.data;
  },
  
  getLeaveBalances: async () => {
    const response = await api.get('/leave-balances/');
    return response.data;
  },
  
  getLeaveApplications: async (status?: string) => {
    const params = status ? { status } : {};
    const response = await api.get('/leave-applications/', { params });
    return response.data;
  },
  
  getLeaveApplication: async (id: string) => {
    const response = await api.get(`/leave-applications/${id}/`);
    return response.data;
  },
  
  submitLeaveApplication: async (data: any) => {
    const response = await api.post('/leave-applications/', data);
    return response.data;
  },
  
  approveLeaveApplication: async (id: string, comments: string = '') => {
    const response = await api.post(`/leave-applications/${id}/approve/`, { comments });
    return response.data;
  },
  
  rejectLeaveApplication: async (id: string, comments: string = '') => {
    const response = await api.post(`/leave-applications/${id}/reject/`, { comments });
    return response.data;
  },
  
  forwardLeaveApplication: async (id: string, comments: string = '') => {
    const response = await api.post(`/leave-applications/${id}/forward/`, { comments });
    return response.data;
  },
  
  cancelLeaveApplication: async (id: string) => {
    const response = await api.post(`/leave-applications/${id}/cancel/`);
    return response.data;
  }
};