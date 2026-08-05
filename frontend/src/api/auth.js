import api from "./axios";

const authApi = {
  login: (data) => api.post("/auth/login", data),

  register: (data) => api.post("/auth/register", data),

  forgotPassword: (data) => api.post("/auth/forgot-password", data),

  verifyResetCode: (data) => api.post("/auth/verify-reset-code", data),

  resetPassword: (data) => api.post("/auth/reset-password", data),
};

export default authApi;