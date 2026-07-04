import api from "./api";
import { ApiResponse, User, UserRole } from "../utils/types";

export async function login(email: string, password: string) {
  const response = await api.post<ApiResponse<{ user: User; token: string }>>("/auth/login", {
    email,
    password
  });
  return response.data.data;
}

export async function register(name: string, email: string, password: string, role: UserRole) {
  const response = await api.post<ApiResponse<{ user: User; token: string }>>("/auth/register", {
    name,
    email,
    password,
    role
  });
  return response.data.data;
}

export async function getMe() {
  const response = await api.get<ApiResponse<User>>("/auth/me");
  return response.data.data;
}
