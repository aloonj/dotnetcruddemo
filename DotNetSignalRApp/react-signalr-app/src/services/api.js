import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5062/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const itemsApi = {
  getAll: () => api.get('/items'),
  getById: (id) => api.get(`/items/${id}`),
  create: (item) => api.post('/items', item),
  update: (id, item) => api.put(`/items/${id}`, item),
  delete: (id) => api.delete(`/items/${id}`),
};

export default api;