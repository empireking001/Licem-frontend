import axios from "axios";

export const API_ORIGIN = process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://licem-backend.onrender.com"
    : "http://localhost:5000");
export const API_BASE_URL = `${API_ORIGIN}/api`;

export const resolveMediaUrl = (value) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${API_ORIGIN}${value.startsWith("/") ? value : `/${value}`}`;
};

const API = axios.create({ baseURL: API_BASE_URL });

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("gl_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("gl_token");
      localStorage.removeItem("gl_user");
      window.location.href = "/";
    }
    return Promise.reject(err);
  },
);

export const authAPI = {
  login: (data) => API.post("/auth/login", data),
  me: () => API.get("/auth/me"),
  changePassword: (data) => API.post("/auth/change-password", data),
};

export const sermonsAPI = {
  getAll: (params) => API.get("/sermons", { params }),
  getOne: (id) => API.get(`/sermons/${id}`),
  create: (data) => API.post("/sermons", data),
  update: (id, d) => API.put(`/sermons/${id}`, d),
  delete: (id) => API.delete(`/sermons/${id}`),
  like: (id, v) => API.post(`/sermons/${id}/like`, { visitorId: v }),
};

export const booksAPI = {
  getAll: (params) => API.get("/books", { params }),
  adminAll: () => API.get("/books/admin/all"),
  create: (data) => API.post("/books", data),
  update: (id, data) => API.put(`/books/${id}`, data),
  delete: (id) => API.delete(`/books/${id}`),
  resolveDownload: (id) => API.post(`/books/${id}/download`),
  upload: (formData) => API.post("/books/upload", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  uploadCover: (formData) => API.post("/books/cover-upload", formData, { headers: { "Content-Type": "multipart/form-data" } }),
};

export const radioAnalyticsAPI = {
  pulse: (sessionId) => API.post("/radio-analytics/pulse", { sessionId }),
  release: (sessionId) => API.delete(`/radio-analytics/pulse/${sessionId}`),
  summary: () => API.get("/radio-analytics/summary"),
};

export const devotionalsAPI = {
  getCurrent: () => API.get("/devotionals/current"),
  getAll: () => API.get("/devotionals"),
  create: (data) => API.post("/devotionals", data),
  update: (id, data) => API.put(`/devotionals/${id}`, data),
  delete: (id) => API.delete(`/devotionals/${id}`),
  aiDraft: (data) => API.post("/devotionals/ai-draft", data),
};

export const eventsAPI = {
  getAll: (params) => API.get("/events", { params }),
  getOne: (id) => API.get(`/events/${id}`),
  create: (data) => API.post("/events", data),
  update: (id, d) => API.put(`/events/${id}`, d),
  delete: (id) => API.delete(`/events/${id}`),
  rsvp: (id, d) => API.post(`/events/${id}/rsvp`, d),
};

export const postsAPI = {
  getAll: (params) => API.get("/posts", { params }),
  adminAll: () => API.get("/posts/admin/all"),
  getOne: (id) => API.get(`/posts/${id}`),
  create: (data) => API.post("/posts", data),
  update: (id, d) => API.put(`/posts/${id}`, d),
  delete: (id) => API.delete(`/posts/${id}`),
};

export const commentsAPI = {
  getFor: (type, id) => API.get(`/comments/${type}/${id}`),
  getAll: (params) => API.get("/comments", { params }),
  create: (data) => API.post("/comments", data),
  approve: (id) => API.put(`/comments/${id}/approve`),
  spam: (id) => API.put(`/comments/${id}/spam`),
  delete: (id) => API.delete(`/comments/${id}`),
};

export const donationsAPI = {
  create: (data) => API.post("/donations", data),
  getAll: (params) => API.get("/donations", { params }),
  update: (id, d) => API.put(`/donations/${id}`, d),
  delete: (id) => API.delete(`/donations/${id}`),
};

export const galleryAPI = {
  getAll: (params) => API.get("/gallery", { params }),
  adminAll: () => API.get("/gallery/admin/all"),
  getOne: (id) => API.get(`/gallery/${id}`),
  create: (data) => API.post("/gallery", data),
  update: (id, d) => API.put(`/gallery/${id}`, d),
  delete: (id) => API.delete(`/gallery/${id}`),
  uploadImages: (id, formData) =>
    API.post(`/gallery/${id}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateImage: (albumId, imgId, data) =>
    API.put(`/gallery/${albumId}/images/${imgId}`, data),
  deleteImage: (albumId, imgId) =>
    API.delete(`/gallery/${albumId}/images/${imgId}`),
  downloadImageUrl: (albumId, imgId) =>
    `${API_BASE_URL}/gallery/download/${albumId}/${imgId}`,
};

export const usersAPI = {
  getAll: () => API.get("/users"),
  create: (data) => API.post("/users", data),
  update: (id, d) => API.put(`/users/${id}`, d),
  delete: (id) => API.delete(`/users/${id}`),
};

export const subscribersAPI = {
  subscribe: (email) => API.post("/subscribers", { email, source: "homepage" }),
  getAll: () => API.get("/subscribers"),
  updateStatus: (id, active) => API.put(`/subscribers/${id}/status`, { active }),
};

export const settingsAPI = {
  get: () => API.get("/settings"),
  update: (data) => API.put("/settings", data),
};

export const contactAPI = {
  getAll: () => API.get("/contact"),
  markRead: (id) => API.put(`/contact/${id}/read`),
  delete: (id) => API.delete(`/contact/${id}`),
};

export const mediaAPI = {
  getAll: () => API.get("/media"),
  upload: (formData) =>
    API.post("/media/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (filename) => API.delete(`/media/${filename}`),
};

export default API;
