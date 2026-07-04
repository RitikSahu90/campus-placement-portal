import { BriefcaseBusiness, LogOut, UserRound } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-blue-700">
          <BriefcaseBusiness className="h-6 w-6" />
          Campus Placement Portal
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium text-gray-700">
          <NavLink to="/jobs" className={({ isActive }) => (isActive ? "text-blue-700" : "hover:text-blue-700")}>
            Jobs
          </NavLink>
          {user ? (
            <>
              <NavLink to={`/${user.role === "student" ? "student" : user.role}`} className="hover:text-blue-700">
                Dashboard
              </NavLink>
              <div className="hidden items-center gap-2 rounded-md bg-gray-100 px-3 py-2 sm:flex">
                <UserRound className="h-4 w-4 text-blue-600" />
                <span>{user.name}</span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="hover:text-blue-700">
                Login
              </NavLink>
              <Link to="/register" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
