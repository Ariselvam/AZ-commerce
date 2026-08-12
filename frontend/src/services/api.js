import axios from 'axios';

// Django REST Framework backend API base URL
const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT token into headers if logged in
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catch authentication errors (e.g. expired tokens)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is invalid or expired, log out the user
    if (error.response && error.response.status === 401) {
      const originalRequest = error.config;
      
      // Avoid infinite loop if login request itself fails auth
      if (!originalRequest.url.includes('/auth/login/')) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        // Optionally redirect user to login, or let Context handle it
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
