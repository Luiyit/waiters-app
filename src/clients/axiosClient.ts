import axios, { type AxiosInstance, type AxiosResponse, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

const baseURL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}${process.env.NEXT_PUBLIC_SERVER_API_VERSION}`;

const axiosClient: AxiosInstance = axios.create({
  baseURL,
});

// Request interceptor
axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Get the session and add Bearer authentication header if token is available
    const session = await getSession();
    if (session?.idToken) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${session.idToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => Promise.reject(error)
);

export default axiosClient;
