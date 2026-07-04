import api from "./api";
import { ApiResponse, Profile } from "../utils/types";

export async function fetchProfile() {
  const response = await api.get<ApiResponse<Profile | null>>("/profile");
  return response.data.data;
}

export async function saveProfile(profile: {
  phone?: string;
  department?: string;
  graduationYear?: number;
  cgpa?: number;
  skills?: string;
  resumeUrl?: string;
  bio?: string;
}) {
  const response = await api.put<ApiResponse<Profile>>("/profile", profile);
  return response.data.data;
}
