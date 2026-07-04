import { Navigate, Outlet } from "react-router-dom";
import Loader from "./Loader";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../utils/types";

export default function ProtectedRoute({ roles }: { roles?: UserRole[] }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return <Outlet />;
}
