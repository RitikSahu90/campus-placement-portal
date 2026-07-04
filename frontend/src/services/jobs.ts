import api from "./api";
import { ApiResponse, Job } from "../utils/types";

export interface JobPayload {
  companyName?: string;
  title: string;
  description: string;
  location: string;
  salary?: string;
  jobType?: string;
  eligibilityCriteria?: string;
  deadline: string;
  status?: string;
}

export async function fetchJobs() {
  const response = await api.get<ApiResponse<Job[]>>("/jobs");
  return response.data.data;
}

export async function fetchJob(id: string) {
  const response = await api.get<ApiResponse<Job>>(`/jobs/${id}`);
  return response.data.data;
}

export async function createJob(payload: JobPayload) {
  const response = await api.post<ApiResponse<Job>>("/jobs", payload);
  return response.data.data;
}

export async function updateJob(id: number, payload: JobPayload) {
  const response = await api.put<ApiResponse<Job>>(`/jobs/${id}`, payload);
  return response.data.data;
}

export async function deleteJob(id: number) {
  await api.delete(`/jobs/${id}`);
}

export async function applyToJob(jobId: number, coverLetter: string) {
  const response = await api.post<ApiResponse<unknown>>("/applications", { jobId, coverLetter });
  return response.data.data;
}

export async function fetchApplications() {
  const response = await api.get<ApiResponse<unknown[]>>("/applications");
  return response.data.data;
}
