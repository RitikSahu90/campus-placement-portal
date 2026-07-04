import { Request } from "express";

export type UserRole = "student" | "recruiter" | "admin";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface ApiError extends Error {
  statusCode?: number;
}
