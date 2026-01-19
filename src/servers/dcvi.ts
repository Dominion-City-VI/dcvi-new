import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Stores } from '@/store';

const BASE_URL = 'https://cms-backend-i97e.onrender.com/api/v1'; // ?? import.meta.env.VITE_APP_API_BASE_URL;
//const BASE_URL = 'http://localhost/api/v1'; // ?? import.meta.env.VITE_APP_API_BASE_URL;

const resourceReqInterceptor = (config: InternalAxiosRequestConfig) => {
  const modifiedConfig = { ...config };
  const _token = Stores.AuthStore.accessToken;

  if (_token && modifiedConfig.headers) modifiedConfig.headers.Authorization = `Bearer ${_token}`;

  return modifiedConfig;
};

const resourceResInterceptor = (response: AxiosResponse) => response;

const resourceResErrorInterceptor = (error: AxiosError) => {
  if (error.response && error.config) {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if ([401, 403].includes(error.response.status) && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh_token = Stores.AuthStore.refreshToken;
      let tokenObj = { token: '', refreshToken: '' };

      if (refresh_token) {
        const gen = Stores.AuthStore.fetchNewToken();
        tokenObj = gen.next().value as { token: string; refreshToken: string };
      }

      const { token } = tokenObj;
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

      return dcviServer(originalRequest);
    }
  }

  return Promise.reject(error);
};

const dcviServer = axios.create({
  baseURL: BASE_URL,
  headers: {
    'content-type': 'application/json'
  }
});

export const dcviServerwithoutInterceptor = axios.create({
  baseURL: BASE_URL,
  headers: {
    'content-type': 'application/json'
  }
});

export const uninterceptedServer = axios.create({
  baseURL: BASE_URL,
  headers: {
    'content-type': 'application/json'
  }
});

export default dcviServer;

dcviServer.interceptors.request.use(resourceReqInterceptor);

dcviServer.interceptors.response.use(resourceResInterceptor, resourceResErrorInterceptor);
