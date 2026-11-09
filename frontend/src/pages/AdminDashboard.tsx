import { useEffect, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import {
  Avatar,
  ConfirmDialog,
  DashboardLayout,
  EmptyState,
  Feedback,
  StatCard,
  StatusBadge,
} from "../components/UI";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import api, { errorMessage } from "../services/api";
import { ApiResponse, Job, User } from "../utils/types";
export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"users" | "jobs">("users");
  const [target, setTarget] = useState<{
    type: "users" | "jobs";
    id: number;
    name: string;
  } | null>(null);
  async function load() {
    setError("");
    setLoadFailed(false);
    try {
      const [u, j] = await Promise.all([
        api.get<ApiResponse<User[]>>("/users"),
        api.get<ApiResponse<Job[]>>("/jobs"),
      ]);
      setUsers(u.data.data);
      setJobs(j.data.data);
    } catch (err) {
      setLoadFailed(true);
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  async function remove() {
    if (!target) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await api.delete(`/${target.type}/${target.id}`);
      setMessage(
        `${target.type === "users" ? "Account" : "Opportunity"} deleted, including its associated records.`,
      );
      await load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
      setTarget(null);
    }
  }
  const matchedUsers = users.filter((u) =>
    `${u.name} ${u.email} ${u.role}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const matchedJobs = jobs.filter((j) =>
    `${j.title} ${j.company_name}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <DashboardLayout role="admin">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Keep the community moving</p>
          <h1 className="page-heading mt-3">A clear view of your campus.</h1>
          <p className="muted mt-3">
            Oversee accounts and opportunities across the portal.
          </p>
        </div>
        <button className="btn-secondary" onClick={load}>
          Refresh overview
        </button>
      </div>
      <Feedback>{error}</Feedback>
      <Feedback success>{message}</Feedback>
      {loading ? (
        <Loader />
      ) : loadFailed ? (
        <button className="btn-secondary" onClick={load}>
          Try again
        </button>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Community members"
              value={users.length}
              caption="Registered accounts across all roles"
            />
            <StatCard
              label="Student accounts"
              value={users.filter((u) => u.role === "student").length}
              caption="The next generation of talent"
            />
            <StatCard
              label="Opportunities posted"
              value={jobs.length}
              caption="Open and closed campus roles"
            />
          </div>
          <section className="panel overflow-hidden">
            <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
              <div
                className="flex gap-1 rounded-xl bg-[#f0f4e9] p-1"
                aria-label="Manage records"
              >
                {(["users", "jobs"] as const).map((t) => (
                  <button
                    key={t}
                    aria-pressed={tab === t}
                    onClick={() => {
                      setTab(t);
                      setQuery("");
                    }}
                    className={`rounded-lg px-4 py-2 text-xs font-semibold ${tab === t ? "bg-white shadow-sm" : "text-[#5f6e57]"}`}
                  >
                    {t === "users" ? "Community" : "Opportunities"}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 rounded-xl border border-[#dfe5d6] px-3">
                <Search className="h-3.5 w-3.5 text-[#849474]" />
                <span className="sr-only">Search {tab}</span>
                <input
                  className="min-h-10 min-w-0 bg-transparent text-xs outline-none"
                  placeholder={
                    tab === "users"
                      ? "Search people, email, or role"
                      : "Search roles or companies"
                  }
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
            </div>
            {tab === "users" ? (
              matchedUsers.length ? (
                <div className="table-scroll">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Member</th>
                        <th>Role</th>
                        <th>Manage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matchedUsers.map((u) => (
                        <tr key={u.id}>
                          <td>
                            <div className="flex items-center gap-3">
                              <Avatar name={u.name} size="sm" />
                              <div>
                                <p className="font-medium">
                                  {u.name}
                                  {u.id === user?.id && (
                                    <span className="ml-2 text-xs text-[#5f6e57]">
                                      (you)
                                    </span>
                                  )}
                                </p>
                                <p className="hint mt-1">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="chip capitalize">{u.role}</span>
                          </td>
                          <td>
                            <button
                              disabled={u.id === user?.id}
                              title={
                                u.id === user?.id
                                  ? "You cannot delete your own account"
                                  : "Delete account"
                              }
                              aria-label={`Delete ${u.name}`}
                              onClick={() =>
                                setTarget({
                                  type: "users",
                                  id: u.id,
                                  name: u.name,
                                })
                              }
                              className="rounded-lg border border-red-100 p-2.5 text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState
                  title="No members found"
                  text="Try another name, role, or email address."
                />
              )
            ) : matchedJobs.length ? (
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Opportunity</th>
                      <th>Status</th>
                      <th>Manage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matchedJobs.map((job) => (
                      <tr key={job.id}>
                        <td>
                          <p className="font-medium">{job.title}</p>
                          <p className="hint mt-1">{job.company_name}</p>
                        </td>
                        <td>
                          <StatusBadge status={job.status} />
                        </td>
                        <td>
                          <button
                            aria-label={`Delete ${job.title}`}
                            onClick={() =>
                              setTarget({
                                type: "jobs",
                                id: job.id,
                                name: job.title,
                              })
                            }
                            className="rounded-lg border border-red-100 p-2.5 text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                title="No opportunities found"
                text="Try another search or check back when recruiters post new roles."
              />
            )}
          </section>
          <p className="hint">
            Deleting an account or opportunity also deletes its related records.
            Administrator access is provisioned privately; public registration
            creates student or recruiter accounts only.
          </p>
        </>
      )}
      <ConfirmDialog
        open={!!target}
        title={`Delete ${target?.type === "users" ? "this account" : "this opportunity"}?`}
        description={`“${target?.name}” and its related records will be permanently deleted. This action cannot be undone.`}
        pending={busy}
        onConfirm={remove}
        onClose={() => setTarget(null)}
      />
    </DashboardLayout>
  );
}
