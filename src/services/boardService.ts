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

export const boardService = {
  getBoards: () => API.get("/boards"),

  createBoard: (data: any) => API.post("/boards", data),

  updateBoard: (id: string, data: any) =>
    API.put(`/boards/${id}`, data),

  deleteBoard: (id: string) =>
    API.delete(`/boards/${id}`),

  getBoardDetail: (id: string) =>
    API.get(`/boards/${id}`),
};