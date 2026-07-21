import api from "./axios";

const portfolioApi = {
  getPortfolios: () => api.get("/portfolio"),

  createPortfolio: (formData) => api.post("/portfolio", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),

  updatePortfolio: (id, formData) => api.put(`/portfolio/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),

  deletePortfolio: (id) => api.delete(`/portfolio/${id}`),
};

export default portfolioApi;
