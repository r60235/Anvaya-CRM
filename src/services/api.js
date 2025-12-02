import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, config.params || config.data);
    }
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      const duration = new Date() - response.config.metadata.startTime;
      console.log(`[API Response] ${response.config.method.toUpperCase()} ${response.config.url} (${duration}ms)`, response.data);
    }
    
    // Transform date strings to Date objects if needed
    if (response.data) {
      response.data = transformDates(response.data);
    }
    
    return response;
  },
  (error) => {
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[API Error]', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }
    
    // Normalize error response
    const normalizedError = {
      message: 'An error occurred',
      status: null,
      data: null,
      originalError: error
    };
    
    if (error.response) {
      // Server responded with error status
      normalizedError.status = error.response.status;
      normalizedError.data = error.response.data;
      
      switch (error.response.status) {
        case 400:
          normalizedError.message = error.response.data?.error || 'Invalid request data';
          break;
        case 404:
          normalizedError.message = error.response.data?.error || 'Resource not found';
          break;
        case 409:
          normalizedError.message = error.response.data?.error || 'Resource already exists';
          break;
        case 500:
          normalizedError.message = 'Server error. Please try again later';
          break;
        default:
          normalizedError.message = error.response.data?.error || error.response.data?.message || 'An error occurred';
      }
    } else if (error.request) {
      // Request made but no response received
      normalizedError.message = 'Network error. Please check your connection';
    } else {
      // Error in request setup
      normalizedError.message = error.message || 'An error occurred';
    }
    
    // Attach normalized error to the error object
    error.normalized = normalizedError;
    
    return Promise.reject(error);
  }
);

// (comment reduced)
const transformDates = (data) => {
  if (data === null || data === undefined) {
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => transformDates(item));
  }
  
  if (typeof data === 'object') {
    const transformed = {};
    for (const [key, value] of Object.entries(data)) {
      // Check if the key suggests it's a date field
      if ((key.includes('At') || key.includes('Date')) && typeof value === 'string') {
        const date = new Date(value);
        transformed[key] = isNaN(date.getTime()) ? value : date;
      } else {
        transformed[key] = transformDates(value);
      }
    }
    return transformed;
  }
  
  return data;
};

// Leads API
export const leadsAPI = {
  // (comment reduced)
  getAll: (params = {}) => api.get('/leads', { params }).then(res => res.data),
  
  // (comment reduced)
  getById: (id) => api.get(`/leads/${id}`).then(res => res.data),
  
  // (comment reduced)
  create: (data) => api.post('/leads', data).then(res => res.data),
  
  // (comment reduced)
  update: (id, data) => api.put(`/leads/${id}`, data).then(res => res.data),
  
  // (comment reduced)
  delete: (id) => api.delete(`/leads/${id}`).then(res => res.data),
};

// Sales Agents API
export const agentsAPI = {
  // (comment reduced)
  getAll: () => api.get('/agents').then(res => res.data),
  
  // (comment reduced)
  create: (data) => api.post('/agents', data).then(res => res.data),
  
  // (comment reduced)
  delete: (id) => api.delete(`/agents/${id}`).then(res => res.data),
};

// Comments API
export const commentsAPI = {
  // (comment reduced)
  getByLead: (leadId) => api.get(`/${leadId}/comments`).then(res => res.data),
  
  // (comment reduced)
  create: (leadId, data) => api.post(`/${leadId}/comments`, data).then(res => res.data),
};

// Tags API
export const tagsAPI = {
  // (comment reduced)
  getAll: () => api.get('/tags').then(res => res.data),
  
  // (comment reduced)
  create: (data) => api.post('/tags', data).then(res => res.data),
};

// Reports API
export const reportsAPI = {
  // (comment reduced)
  getLastWeek: () => api.get('/report/last-week').then(res => res.data),
  
  // (comment reduced)
  getPipeline: () => api.get('/report/pipeline').then(res => res.data),
  
  // (comment reduced)
  getClosedByAgent: () => api.get('/report/closed-by-agent').then(res => res.data),
};

export default api;