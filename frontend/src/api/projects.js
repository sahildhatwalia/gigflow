import api from "./axios";

const projectsApi = {
  getProjects: (page = 1, limit = 8) => api.get(`/projects?page=${page}&limit=${limit}`),

  searchProjects: (query) => api.get(`/projects/search?query=${query}`),

  getProject: (id) => api.get(`/projects/${id}`),

  createProject: (formData) => api.post("/projects", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),

  updateProject: (id, formData) => api.put(`/projects/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),

  deleteProject: (id) => api.delete(`/projects/${id}`),
  
  submitProposal: (id, bidAmount, coverLetter) => api.post(`/projects/${id}/proposal`, { bidAmount, coverLetter }),
  cancelProposal: (id) => api.delete(`/projects/${id}/proposal`),
  getMyProposals: () => api.get("/projects/my-proposals"),
  updateProposalStatus: (projectId, proposalId, status) => api.put(`/projects/${projectId}/proposal/${proposalId}`, { status }),
};

export default projectsApi;
