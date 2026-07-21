import api from "./axios";

const profileApi = {
  getProfile() {
    return api.get("/profile");
  },

  updateProfile(formData) {
    return api.put("/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  changePassword(data) {
    return api.put("/profile/password", data);
  },
};

export default profileApi;