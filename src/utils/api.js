// API configuration for production deployment
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Fetch wrapper with credentials for cross-domain cookie support
export const fetchWithCredentials = (url, options = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
};
