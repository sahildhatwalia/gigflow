import axios from "axios";

export const HOST = import.meta.env.VITE_HOST;

const api = axios.create({
  baseURL: `${HOST}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;