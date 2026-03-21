import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Stores } from '@/store';
import { AUTH } from '@/constants/api';

const BASE_URL = 'https://cms-backend-i97e.onrender.com/api/v1';

const resourceReqInterceptor = (config: InternalAxiosRequestConfig) => {
  const modifiedConfig = { ...config };
  const _token = Stores.AuthStore.accessToken;

  if (_token && modifiedConfig.headers) modifiedConfig.headers.Authorization = `Bearer ${_token}`;

  return modifiedConfig;
};

const resourceResInterceptor = (response: AxiosResponse) => response;

const resourceResErrorInterceptor = async (error: AxiosError) => {
  if (error.response && error.config) {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if ([401, 403].includes(error.response.status) && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh_token = Stores.AuthStore.refreshToken;
      const access_token = Stores.AuthStore.accessToken;

      if (refresh_token) {
        try {
          const { data } = await axios.post(`${BASE_URL}${AUTH.NEW_TOKEN}`, {
            token: access_token,
            refreshToken: refresh_token
          });

          if (data?.data?.token) {
            Stores.AuthStore.setTokens(data.data.token, data.data.refreshToken);
            originalRequest.headers!['Authorization'] = `Bearer ${data.data.token}`;
            return dcviServer(originalRequest);
          }
        } catch (_refreshErr) {
          Stores.AuthStore.logout();
          return Promise.reject(_refreshErr);
        }
      } else {
        Stores.AuthStore.logout();
      }
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
