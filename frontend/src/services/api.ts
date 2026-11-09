import axios from "axios";
export const SESSION_EXPIRED = "campus:session-expired";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
});
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.startsWith("/auth/login") &&
      !error.config?.url?.startsWith("/auth/register")
    ) {
      sessionStorage.removeItem("token");
      window.dispatchEvent(new Event(SESSION_EXPIRED));
    }
    return Promise.reject(error);
  },
);
export function errorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 429)
      return "Too many sign-in attempts. Please wait a minute and try again.";
    if (error.response?.status === 413)
      return "That request is too large. Shorten the content and try again.";
    if (typeof error.response?.data?.message === "string")
      return error.response.data.message;
    if (error.code === "ECONNABORTED")
      return "The request took too long. Please try again.";
    if (!error.response)
      return "We couldn’t connect. Check your connection and try again.";
  }
  return "Something went wrong. Please try again.";
}
export default api;
