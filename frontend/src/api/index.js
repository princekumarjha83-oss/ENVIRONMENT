import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Attach token
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('ecowatch_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export const dashboardAPI = {
  getMetrics: (city = 'Delhi') => api.get(`/dashboard/metrics?city=${city}`),
  getHistory: (city = 'Delhi', days = 30) => api.get(`/dashboard/history?city=${city}&days=${days}`),
  getCities: () => api.get('/dashboard/cities'),
  getGlobalStats: () => api.get('/dashboard/global-stats'),
};

export const copilotAPI = {
  chat: (message, city = 'Delhi') => api.post('/copilot/chat', { message, city }),
  getSuggestions: () => api.get('/copilot/suggestions'),
};

export const imageAPI = {
  analyze: (file) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/image/analyze', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  getCategories: () => api.get('/image/categories'),
};

export const predictionsAPI = {
  getForecast: (city = 'Delhi') => api.get(`/predictions/forecast?city=${city}`),
  getModels: () => api.get('/predictions/models'),
  getRisk: (city = 'Delhi') => api.get(`/predictions/risk-assessment?city=${city}`),
};

export const citiesAPI = {
  getRankings: () => api.get('/cities/rankings'),
  getHotspots: () => api.get('/cities/hotspots'),
  getTips: () => api.get('/cities/sustainability-tips'),
};

export const carbonAPI = {
  calculate: (data) => api.post('/carbon/calculate', data),
  getStats: () => api.get('/carbon/average-stats'),
};

export const newsAPI = {
  getNews: () => api.get('/news/'),
};

export const usersAPI = {
  login: (username, password) => api.post('/users/login', { username, password }),
  register: (data) => api.post('/users/register', data),
  getProfile: () => api.get('/users/profile'),
  getAllUsers: () => api.get('/users/all'),
};

export const alertsAPI = {
  getAlerts: () => api.get('/alerts/'),
  dismiss: (id) => api.post(`/alerts/${id}/dismiss`),
};

export const reportsAPI = {
  generate: (data) => api.post('/reports/generate', data, { responseType: 'blob' }),
  getDatasets: () => api.get('/reports/datasets'),
  uploadDataset: (file) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/reports/datasets/upload', form);
  },
};

export default api;
