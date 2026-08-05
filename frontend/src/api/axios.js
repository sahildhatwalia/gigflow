import axios from "axios";

// Trim any whitespace or trailing slashes from VITE_HOST environment variable
const rawHost = import.meta.env.VITE_HOST || "";
export const HOST = rawHost.trim().replace(/\/+$/, "");

const api = axios.create({
  baseURL: HOST ? `${HOST}/api` : "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;