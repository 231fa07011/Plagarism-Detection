import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const analysisService = {
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  analyzeText: (text) => {
    return api.post('/analyze', { text });
  },
  
  getReports: () => {
    return api.get('/reports');
  },
  
  getReportById: (id) => {
    return api.get(`/reports/${id}`);
  },
  
  exportPdf: (scanId) => {
    return api.get(`/reports/${scanId}/pdf`, { responseType: 'blob' });
  }
};

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (userData) => api.post('/auth/signup', userData),
};

export default api;
