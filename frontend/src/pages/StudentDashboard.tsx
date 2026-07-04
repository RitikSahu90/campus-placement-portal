import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { fetchApplications, fetchJobs } from "../services/jobs";
import { Application, Job } from "../utils/types";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    fetchJobs().then(setJobs);
    fetchApplications().then((data) => setApplications(data as Application[]));
  }, []);

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[240px_1fr]">
      <Sidebar role="student" />
      <section>
        <h1 className="text-3xl font-bold text-gray-950">Welcome, {user?.name}</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-md border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Open jobs</p><p className="mt-2 text-3xl font-bold">{jobs.length}</p></div>
          <div className="rounded-md border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Applications</p><p className="mt-2 text-3xl font-bold">{applications.length}</p></div>
          <div className="rounded-md border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Role</p><p className="mt-2 text-3xl font-bold capitalize">{user?.role}</p></div>
        </div>
        <div className="mt-6 rounded-md border border-gray-200 bg-white p-5">
          <h2 className="text-xl font-semibold">Applied Jobs</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600"><tr><th className="p-3">Job</th><th className="p-3">Company</th><th className="p-3">Status</th></tr></thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-t border-gray-100">
                    <td className="p-3">{app.title}</td><td className="p-3">{app.company_name}</td><td className="p-3 capitalize">{app.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
