import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export const healthCheck = () => api.get("/health");

export const loginUser = (payload) =>
  api.post("/auth/login", payload);

export const registerUser = (payload) =>
  api.post("/auth/register", payload);

export const generateContent = (payload) =>
  api.post("/content/generate", payload);

export const askTutor = (payload) =>
  api.post("/ai/tutor", payload);

export default api;