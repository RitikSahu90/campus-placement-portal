export type UserRole = "student" | "recruiter" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  salary?: string;
  job_type: "internship" | "full-time" | "part-time";
  eligibility_criteria?: string;
  deadline: string;
  status: "open" | "closed";
  company_name: string;
  recruiter_name: string;
}

export interface Profile {
  id?: number;
  phone?: string;
  department?: string;
  graduation_year?: number;
  cgpa?: number;
  skills?: string;
  resume_url?: string;
  bio?: string;
}

export interface Application {
  id: number;
  job_id: number;
  student_id: number;
  status: string;
  title?: string;
  job_title?: string;
  company_name?: string;
  student_name?: string;
  student_email?: string;
  applied_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
