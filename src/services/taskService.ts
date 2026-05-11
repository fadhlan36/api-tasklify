import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const taskService = {
  // CREATE
  createTask: (data: any) => API.post("/tasks", data),

  // DETAIL
  getTaskDetail: (id: string) => API.get(`/tasks/${id}`),

  // UPDATE (EDIT TASK)
  updateTask: (id: string, data: any) =>
    API.put(`/tasks/${id}`, data),

  // DELETE
  deleteTask: (id: string) =>
    API.delete(`/tasks/${id}`),

  // DRAG & DROP TASK
  moveTask: (data: {
    taskId: string;
    columnId: string;
    order?: number;
  }) => API.post(`/tasks/move`, data),
};