import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const taskService = {
  createTask: (data: any) => API.post("/tasks", data),
  getTaskDetail: (id: string) => API.get(`/tasks/${id}`),
  updateTask: (id: string, data: any) => API.put(`/tasks/${id}`, data),
  deleteTask: (id: string) => API.delete(`/tasks/${id}`),
  moveTask: (data: { taskId: string; columnId: string; order?: number }) =>
    API.post(`/tasks/move`, data),
};