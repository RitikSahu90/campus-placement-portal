import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { Job, User } from "../utils/types";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  async function loadData() {
    const [usersResponse, jobsResponse] = await Promise.all([
      api.get("/users"),
      api.get("/jobs")
    ]);
    setUsers(usersResponse.data.data);
    setJobs(jobsResponse.data.data);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function deleteUser(id: number) {
    await api.delete(`/users/${id}`);
    loadData();
  }

  async function deleteJob(id: number) {
    await api.delete(`/jobs/${id}`);
    loadData();
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[240px_1fr]">
      <Sidebar role="admin" />
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-950">Admin Dashboard</h1>
          <p className="mt-1 text-gray-600">Review users and jobs across the portal.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-md border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Users</p><p className="mt-2 text-3xl font-bold">{users.length}</p></div>
          <div className="rounded-md border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Jobs</p><p className="mt-2 text-3xl font-bold">{jobs.length}</p></div>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-5">
          <h2 className="text-xl font-semibold">Users</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600"><tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Action</th></tr></thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-gray-100">
                    <td className="p-3">{user.name}</td><td className="p-3">{user.email}</td><td className="p-3 capitalize">{user.role}</td>
                    <td className="p-3"><button onClick={() => deleteUser(user.id)} className="rounded-md border px-3 py-1 text-red-700">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-5">
          <h2 className="text-xl font-semibold">Jobs</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600"><tr><th className="p-3">Title</th><th className="p-3">Company</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-t border-gray-100">
                    <td className="p-3">{job.title}</td><td className="p-3">{job.company_name}</td><td className="p-3 capitalize">{job.status}</td>
                    <td className="p-3"><button onClick={() => deleteJob(job.id)} className="rounded-md border px-3 py-1 text-red-700">Delete</button></td>
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
