import api from "./axios";

const authApi = {
  login: (data) => api.post("/auth/login", data),

  register: (data) => api.post("/auth/register", data),
};

export default authApi;