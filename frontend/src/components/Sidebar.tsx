import {
  ArrowUpRight,
  BriefcaseBusiness,
  ClipboardList,
  LayoutDashboard,
  UserRound,
} from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { UserRole } from "../utils/types";
import { useAuth } from "../context/AuthContext";
const links = {
  student: [
    { to: "/student", label: "Overview", icon: LayoutDashboard },
    { to: "/jobs", label: "Find opportunities", icon: BriefcaseBusiness },
    { to: "/profile", label: "My profile", icon: UserRound },
  ],
  recruiter: [
    { to: "/recruiter", label: "Hiring overview", icon: LayoutDashboard },
    { to: "/jobs", label: "All opportunities", icon: ClipboardList },
  ],
  admin: [
    { to: "/admin", label: "Portal overview", icon: LayoutDashboard },
    { to: "/jobs", label: "All opportunities", icon: ClipboardList },
  ],
};
export default function Sidebar({ role }: { role: UserRole }) {
  const { user } = useAuth();
  return (
    <aside className="lg:sticky lg:top-28">
      <div className="mb-6 hidden px-3 lg:block">
        <p className="eyebrow">Your workspace</p>
        <p className="mt-2 text-sm font-semibold capitalize">{role} account</p>
        <p className="mt-1 truncate text-xs text-[#5f6e57]">{user?.email}</p>
      </div>
      <nav
        aria-label="Workspace navigation"
        className="flex flex-wrap gap-1 lg:flex-col"
      >
        {links[role].map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              end
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${isActive ? "bg-[#e7eedb] text-[#3f602b]" : "text-[#5f6e57] hover:bg-[#eff3e8]"}`
              }
            >
              <Icon className="h-[18px] w-[18px]" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="mt-8 hidden rounded-2xl bg-[#edf1e3] p-5 lg:block">
        <p className="text-sm font-semibold">A little clarity helps.</p>
        <p className="mt-2 text-xs leading-5 text-[#5f6e57]">
          Understand every step of your placement journey.
        </p>
        <Link to="/how-it-works" className="text-action mt-4 text-xs">
          Read the guide <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </aside>
  );
}
