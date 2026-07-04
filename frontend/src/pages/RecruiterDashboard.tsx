import { FormEvent, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { createJob, deleteJob, fetchApplications, fetchJobs, updateJob } from "../services/jobs";
import { Application, Job } from "../utils/types";

const emptyForm = {
  companyName: "",
  title: "",
  description: "",
  location: "",
  salary: "",
  jobType: "full-time",
  eligibilityCriteria: "",
  deadline: "",
  status: "open"
};

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  function loadData() {
    fetchJobs().then(setJobs);
    fetchApplications().then((data) => setApplicants(data as Application[]));
  }

  useEffect(loadData, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editingId) {
      await updateJob(editingId, form);
    } else {
      await createJob(form);
    }
    setEditingId(null);
    setForm(emptyForm);
    loadData();
  }

  function startEdit(job: Job) {
    setEditingId(job.id);
    setForm({
      companyName: job.company_name,
      title: job.title,
      description: job.description,
      location: job.location,
      salary: job.salary || "",
      jobType: job.job_type,
      eligibilityCriteria: job.eligibility_criteria || "",
      deadline: String(job.deadline).slice(0, 10),
      status: job.status
    });
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[240px_1fr]">
      <Sidebar role="recruiter" />
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-950">Recruiter Dashboard</h1>
          <p className="mt-1 text-gray-600">Manage company jobs and review applicants.</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">{editingId ? "Edit Job" : "Post Job"}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              ["companyName", "Company name"],
              ["title", "Job title"],
              ["location", "Location"],
              ["salary", "Salary"],
              ["deadline", "Deadline"]
            ].map(([name, label]) => (
              <input
                key={name}
                required={["title", "location", "deadline"].includes(name)}
                type={name === "deadline" ? "date" : "text"}
                value={form[name as keyof typeof form]}
                onChange={(event) => setForm({ ...form, [name]: event.target.value })}
                placeholder={label}
                className="rounded-md border border-gray-300 px-3 py-2"
              />
            ))}
            <select value={form.jobType} onChange={(event) => setForm({ ...form, jobType: event.target.value })} className="rounded-md border border-gray-300 px-3 py-2">
              <option value="full-time">Full-time</option>
              <option value="internship">Internship</option>
              <option value="part-time">Part-time</option>
            </select>
            <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="rounded-md border border-gray-300 px-3 py-2">
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
            <textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description" rows={4} className="rounded-md border border-gray-300 px-3 py-2 md:col-span-2" />
            <textarea value={form.eligibilityCriteria} onChange={(event) => setForm({ ...form, eligibilityCriteria: event.target.value })} placeholder="Eligibility criteria" rows={3} className="rounded-md border border-gray-300 px-3 py-2 md:col-span-2" />
          </div>
          <button className="mt-4 rounded-md bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700">
            {editingId ? "Update Job" : "Create Job"}
          </button>
        </form>

        <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Jobs</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600"><tr><th className="p-3">Title</th><th className="p-3">Company</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-t border-gray-100">
                    <td className="p-3">{job.title}</td><td className="p-3">{job.company_name}</td><td className="p-3 capitalize">{job.status}</td>
                    <td className="flex gap-2 p-3">
                      <button onClick={() => startEdit(job)} className="rounded-md border px-3 py-1 text-blue-700">Edit</button>
                      <button onClick={async () => { await deleteJob(job.id); loadData(); }} className="rounded-md border px-3 py-1 text-red-700">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Applicants</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600"><tr><th className="p-3">Student</th><th className="p-3">Email</th><th className="p-3">Job</th><th className="p-3">Status</th></tr></thead>
              <tbody>
                {applicants.map((app) => (
                  <tr key={app.id} className="border-t border-gray-100">
                    <td className="p-3">{app.student_name}</td><td className="p-3">{app.student_email}</td><td className="p-3">{app.job_title}</td><td className="p-3 capitalize">{app.status}</td>
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
