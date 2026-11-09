import { ArrowUpRight, BriefcaseBusiness, LogOut, Menu, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Avatar } from "./UI";
export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="sticky top-0 z-30 border-b border-[#e1e7dc] bg-[#f8f9f5]/95 backdrop-blur-lg">
        <div className="container-page flex min-h-20 flex-wrap items-center justify-between gap-4 py-4">
          <Link
            to="/"
            aria-label="Campus home"
            className="flex items-center gap-2.5"
          >
            <span className="rounded-xl bg-[#193e31] p-2.5 text-[#ddf2ac]">
              <BriefcaseBusiness className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold tracking-tight">
              campus<span className="text-[#71974b]">.</span>
              <span className="ml-3 hidden border-l border-[#dce3d6] pl-3 text-[11px] font-medium uppercase tracking-[.15em] text-[#5f6e57] sm:inline">
                Your next chapter
              </span>
            </span>
          </Link>
          <button
            className="rounded-xl border border-[#dfe5dc] p-2.5 md:hidden"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <nav
            id="main-navigation"
            aria-label="Main navigation"
            className={`${open ? "flex" : "hidden"} w-full flex-col gap-4 pb-2 text-sm md:flex md:w-auto md:flex-row md:items-center md:gap-7 md:pb-0`}
          >
            <NavLink
              to="/jobs"
              className={({ isActive }) =>
                `py-2 ${isActive ? "font-semibold text-emerald-800" : "text-[#62715f] hover:text-[#173e32]"}`
              }
            >
              Find opportunities
            </NavLink>
            <Link
              to="/how-it-works"
              className="py-2 text-[#62715f] hover:text-[#173e32]"
            >
              How it works
            </Link>
            {user ? (
              <>
                <Link to={`/${user.role}`} className="font-semibold">
                  Workspace
                </Link>
                <div className="flex items-center gap-3 border-t border-[#dfe5dc] pt-3 md:border-l md:border-t-0 md:pl-5 md:pt-0">
                  <Avatar name={user.name} size="sm" />
                  <span className="max-w-32 truncate text-xs">{user.name}</span>
                  <button
                    onClick={logout}
                    aria-label="Sign out"
                    title="Sign out"
                    className="rounded-lg p-2 hover:bg-[#e9eee2]"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="font-semibold">
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary">
                  Get started <ArrowUpRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
