import axios from "axios";

const API_URL = "https://back-admin-production.up.railway.app/api";
// const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const eventos = {
  getAll: () => api.get("/eventos"),
  getById: (id: string) => api.get(`/eventos/${id}`),
  create: (data: any) => api.post("/eventos", data),
  update: (id: string, data: any) => api.put(`/eventos/${id}`, data),
  delete: (id: string) => api.delete(`/eventos/${id}`),
};

export const auth = {
  login: (credentials: { username: string; password: string }) =>
    api.post("/auth/login", credentials),
  changePassword: (passwords: { oldPassword: string; newPassword: string }) =>
    api.put("/auth/cambiar-password", passwords),
};

export const fechas = {
  getAll: () => api.get("/fechas"),
  getById: (id: string) => api.get(`/fechas/${id}`),
  create: (data: any) => api.post("/fechas", data),
  update: (id: string, data: any) => api.put(`/fechas/${id}`, data),
  delete: (id: string) => api.delete(`/fechas/${id}`),
};

