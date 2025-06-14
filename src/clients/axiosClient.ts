import axios, { type AxiosInstance, type AxiosResponse, type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const baseURL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}${process.env.NEXT_PUBLIC_SERVER_API_VERSION}`;

const axiosClient: AxiosInstance = axios.create({
  baseURL,
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add Bearer authentication header if token is available
    const token = process.env.NEXT_PUBLIC_SESSION_TOKEN;
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
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
