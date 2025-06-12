import axios, { type AxiosInstance, type AxiosResponse, type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const baseURL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}${process.env.NEXT_PUBLIC_SERVER_API_VERSION}`;

const axiosClient: AxiosInstance = axios.create({
  baseURL,
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // TODO: Add authentication headers here in the future
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
