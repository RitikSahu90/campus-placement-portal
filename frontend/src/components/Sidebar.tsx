import { Building2, ClipboardList, LayoutDashboard, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";
import { UserRole } from "../utils/types";

const links = {
  student: [
    { to: "/student", label: "Dashboard", icon: LayoutDashboard },
    { to: "/jobs", label: "Browse Jobs", icon: ClipboardList },
    { to: "/profile", label: "Profile", icon: UserRound }
  ],
  recruiter: [
    { to: "/recruiter", label: "Dashboard", icon: LayoutDashboard },
    { to: "/jobs", label: "All Jobs", icon: ClipboardList },
    { to: "/recruiter", label: "Company Jobs", icon: Building2 }
  ],
  admin: [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/jobs", label: "Jobs", icon: ClipboardList }
  ]
};

export default function Sidebar({ role }: { role: UserRole }) {
  return (
    <aside className="rounded-md border border-gray-200 bg-white p-3">
      <div className="mb-3 px-3 text-xs font-semibold uppercase text-gray-500">{role} menu</div>
      <div className="space-y-1">
        {links[role].map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={`${item.to}-${item.label}`}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
}
