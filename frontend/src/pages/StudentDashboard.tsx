import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import {
  DashboardLayout,
  EmptyState,
  Feedback,
  StatCard,
  StatusBadge,
} from "../components/UI";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { fetchApplications, fetchJobs } from "../services/jobs";
import { errorMessage } from "../services/api";
import { Application, Job } from "../utils/types";
import { formatDate, isJobOpen } from "../utils/format";
export default function StudentDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() {
    setLoading(true);
    setError("");
    try {
      const [j, a] = await Promise.all([fetchJobs(), fetchApplications()]);
      setJobs(j);
      setApplications(a);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  return (
    <DashboardLayout role="student">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow">Your career, in motion</p>
          <h1 className="page-heading mt-3">
            Welcome back, {user?.name.split(" ")[0]}.
          </h1>
          <p className="muted mt-3">
            A little progress today. A little closer to what’s next.
          </p>
        </div>
        <Link to="/jobs" className="btn-primary">
          Explore opportunities <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      <Feedback>{error}</Feedback>
      {loading ? (
        <Loader />
      ) : error ? (
        <button className="btn-secondary" onClick={load}>
          Try again
        </button>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Open opportunities"
              value={jobs.filter(isJobOpen).length}
              caption="Active roles within their deadline"
            />
            <StatCard
              label="Your applications"
              value={applications.length}
              caption="Every step you’ve taken so far"
            />
            <StatCard
              label="Moving forward"
              value={
                applications.filter((a) =>
                  ["shortlisted", "selected"].includes(a.status),
                ).length
              }
              caption="Shortlisted or selected"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#d9e4ca] bg-[#edf3e3] p-6">
            <div>
              <h2 className="text-sm font-semibold">
                Your profile opens the conversation.
              </h2>
              <p className="muted mt-1">
                Keep your skills, introduction, and resume up to date.
              </p>
            </div>
            <Link to="/profile" className="text-action">
              Edit my profile <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <section className="panel overflow-hidden">
            <div className="flex items-center justify-between p-6">
              <div>
                <h2 className="text-lg font-semibold">Your applications</h2>
                <p className="hint">
                  Follow each opportunity as recruiters review your application.
                </p>
              </div>
              <button onClick={load} className="text-action text-xs">
                Refresh
              </button>
            </div>
            {applications.length ? (
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Opportunity</th>
                      <th>Applied on</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id}>
                        <td>
                          <Link
                            className="font-medium hover:underline"
                            to={`/jobs/${app.job_id}`}
                          >
                            {app.title}
                          </Link>
                          <p className="hint mt-1">{app.company_name}</p>
                        </td>
                        <td className="whitespace-nowrap text-xs text-[#5f6e57]">
                          {formatDate(app.applied_at)}
                        </td>
                        <td>
                          <StatusBadge status={app.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                title="Your journey starts with one application"
                text="When you apply for an opportunity, it will appear here with its latest status."
                action={
                  <Link to="/jobs" className="btn-secondary">
                    Find an opportunity
                  </Link>
                }
              />
            )}
          </section>
        </>
      )}
    </DashboardLayout>
  );
}
