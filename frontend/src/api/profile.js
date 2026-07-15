import api from "./axios";

const profileApi = {
  getProfile: () => api.get("/profile"),

  updateProfile: (formData) =>
    api.put("/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  changePassword: (data) =>
    api.put("/profile/password", data),
};

export default profileApi;