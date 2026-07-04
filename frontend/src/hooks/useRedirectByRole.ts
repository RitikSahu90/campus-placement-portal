import { useNavigate } from "react-router-dom";
import { UserRole } from "../utils/types";

export function useRedirectByRole() {
  const navigate = useNavigate();

  return (role: UserRole) => {
    if (role === "admin") navigate("/admin");
    if (role === "recruiter") navigate("/recruiter");
    if (role === "student") navigate("/student");
  };
}
