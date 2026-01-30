import axios, { AxiosError } from 'axios';

// In dev, use relative URLs so Vite proxies to the gateway (avoids CORS). In prod, use env or default.
const BASE_URL =
  import.meta.env.DEV
    ? ''
    : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:6000');

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const refreshUrl = BASE_URL ? `${BASE_URL}/auth/refresh` : '/auth/refresh';
          const { data } = await axios.post<{ token: string; refreshToken: string }>(
            refreshUrl,
            { refreshToken },
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
          );
          localStorage.setItem('token', data.token);
          localStorage.setItem('refreshToken', data.refreshToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.token}`;
          }
          return apiClient(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.data) {
      const data = error.response.data as { message?: string };
      return data.message || error.message || 'Request failed';
    }
    if (error.code === 'ERR_NETWORK' || !error.response) {
      const apiHost = import.meta.env.DEV ? 'http://localhost:6000 (proxied)' : BASE_URL || 'API';
      return `Cannot reach the API at ${apiHost}. Ensure the API Gateway is running on port 6000.`;
    }
  }
  return error instanceof Error ? error.message : 'Request failed';
}
