import { FormEvent, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
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
import {
  createJob,
  deleteJob,
  fetchApplications,
  fetchMyJobs,
  updateJob,
  updateApplicationStatus,
} from "../services/jobs";
import { errorMessage } from "../services/api";
import { Application, Job } from "../utils/types";
import { isJobOpen } from "../utils/format";
const emptyForm = {
  companyName: "",
  title: "",
  description: "",
  location: "",
  salary: "",
  jobType: "full-time",
  eligibilityCriteria: "",
  deadline: "",
  status: "open",
};
export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [updating, setUpdating] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [deleting, setDeleting] = useState<Job | null>(null);
  async function load() {
    setError("");
    setLoadFailed(false);
    try {
      const [j, a] = await Promise.all([fetchMyJobs(), fetchApplications()]);
      setJobs(j);
      setApplicants(a);
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
  function cancel() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    try {
      if (editingId) await updateJob(editingId, form);
      else await createJob(form);
      setMessage(
        editingId
          ? "Your opportunity has been updated."
          : "Your opportunity is now on the job board.",
      );
      cancel();
      await load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }
  function edit(job: Job) {
    setEditingId(job.id);
    setForm({
      companyName: job.company_name,
      title: job.title,
      description: job.description,
      location: job.location,
      salary: job.salary || "",
      jobType: job.job_type,
      eligibilityCriteria: job.eligibility_criteria || "",
      deadline: job.deadline.slice(0, 10),
      status: job.status,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function remove() {
    if (!deleting) return;
    setBusy(true);
    setError("");
    try {
      await deleteJob(deleting.id);
      setMessage("The opportunity and its applications were deleted.");
      await load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
      setDeleting(null);
    }
  }
  async function changeStatus(id: number, status: string) {
    setUpdating(id);
    setError("");
    setMessage("");
    try {
      await updateApplicationStatus(id, status);
      setApplicants((current) =>
        current.map((a) => (a.id === id ? { ...a, status } : a)),
      );
      setMessage(
        "Application status updated. The student can see it in their workspace.",
      );
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setUpdating(null);
    }
  }
  const fields = [
    {
      name: "companyName",
      label: "Company name",
      placeholder: "e.g. Acme Technologies",
      max: 150,
    },
    {
      name: "title",
      label: "Role title",
      placeholder: "e.g. Graduate Java Developer",
      required: true,
      max: 150,
    },
    {
      name: "location",
      label: "Location",
      placeholder: "e.g. Bengaluru or Remote",
      required: true,
      max: 120,
    },
    {
      name: "salary",
      label: "Compensation",
      placeholder: "e.g. ₹6–8 LPA",
      max: 80,
    },
    {
      name: "deadline",
      label: "Application deadline (UTC)",
      type: "date",
      required: true,
    },
  ];
  return (
    <DashboardLayout role="recruiter">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow">Build your next great team</p>
          <h1 className="page-heading mt-3">Good people. Great beginnings.</h1>
          <p className="muted mt-3">
            Your opportunities and applicants, thoughtfully in one place.
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            cancel();
            setShowForm(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Post an opportunity
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
              label="Your opportunities"
              value={jobs.length}
              caption="Only roles posted by your account"
            />
            <StatCard
              label="Open for applications"
              value={jobs.filter(isJobOpen).length}
              caption="Active roles within their deadline"
            />
            <StatCard
              label="Applications received"
              value={applicants.length}
              caption="Students interested in your team"
            />
          </div>
          {showForm && (
            <section
              className="panel p-6 sm:p-8"
              aria-labelledby="job-form-title"
            >
              <div className="mb-7 flex items-center justify-between gap-3">
                <div>
                  <h2 id="job-form-title" className="text-xl font-semibold">
                    {editingId
                      ? "Refine your opportunity"
                      : "Make room for new talent"}
                  </h2>
                  <p className="hint">
                    Company name changes apply to all of your company’s roles.
                  </p>
                </div>
                <button
                  disabled={busy}
                  className="rounded-lg p-2 hover:bg-gray-50"
                  aria-label="Close opportunity form"
                  onClick={cancel}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
                {fields.map((field) => (
                  <label className="label" key={field.name}>
                    {field.label}
                    {field.required && (
                      <span
                        className="ml-1 text-[#5f6e57]"
                        aria-label="required"
                      >
                        *
                      </span>
                    )}
                    <input
                      className="field"
                      type={field.type || "text"}
                      required={field.required}
                      maxLength={field.max}
                      value={form[field.name as keyof typeof form]}
                      onChange={(e) =>
                        setForm({ ...form, [field.name]: e.target.value })
                      }
                      placeholder={field.placeholder}
                    />
                  </label>
                ))}
                <label className="label">
                  Opportunity type
                  <select
                    className="field"
                    value={form.jobType}
                    onChange={(e) =>
                      setForm({ ...form, jobType: e.target.value })
                    }
                  >
                    <option value="full-time">Full-time</option>
                    <option value="internship">Internship</option>
                    <option value="part-time">Part-time</option>
                  </select>
                </label>
                <label className="label sm:col-span-2">
                  Description *
                  <textarea
                    className="field"
                    required
                    maxLength={20000}
                    rows={5}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Describe the work, the team, and what the student will learn."
                  />
                </label>
                <label className="label sm:col-span-2">
                  Eligibility criteria
                  <textarea
                    className="field"
                    rows={3}
                    value={form.eligibilityCriteria}
                    onChange={(e) =>
                      setForm({ ...form, eligibilityCriteria: e.target.value })
                    }
                    placeholder="Eligible departments, graduation years, or academic requirements."
                  />
                </label>
                <label className="label">
                  Accepting applications
                  <select
                    className="field"
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </label>
                <div className="flex items-end gap-3 sm:col-span-2">
                  <button disabled={busy} className="btn-primary">
                    {busy
                      ? "Saving…"
                      : editingId
                        ? "Save changes"
                        : "Publish opportunity"}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={cancel}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}
          <section className="panel overflow-hidden">
            <div className="flex items-center justify-between p-6">
              <div>
                <h2 className="text-lg font-semibold">Your opportunities</h2>
                <p className="hint">Manage the roles you’ve posted.</p>
              </div>
              <button onClick={load} className="text-action text-xs">
                Refresh
              </button>
            </div>
            {jobs.length ? (
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
                    {jobs.map((job) => (
                      <tr key={job.id}>
                        <td>
                          <p className="font-medium">{job.title}</p>
                          <p className="hint mt-1">
                            {job.company_name} · {job.location}
                          </p>
                        </td>
                        <td>
                          <StatusBadge
                            status={isJobOpen(job) ? "open" : "closed"}
                          />
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button
                              aria-label={`Edit ${job.title}`}
                              title="Edit opportunity"
                              onClick={() => edit(job)}
                              className="rounded-lg border border-[#dfe5d6] p-2.5 hover:bg-[#f3f6ec]"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              aria-label={`Delete ${job.title}`}
                              title="Delete opportunity"
                              onClick={() => setDeleting(job)}
                              className="rounded-lg border border-[#eadbd8] p-2.5 text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                title="Your next hire starts here"
                text="Post your first opportunity and introduce your team to campus talent."
                action={
                  <button
                    className="btn-secondary"
                    onClick={() => setShowForm(true)}
                  >
                    Post an opportunity
                  </button>
                }
              />
            )}
          </section>
          <section className="panel overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold">Meet your applicants</h2>
              <p className="hint">
                Update their status as your hiring conversation progresses.
              </p>
            </div>
            {applicants.length ? (
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Opportunity</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map((app) => (
                      <tr key={app.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <Avatar name={app.student_name} size="sm" />
                            <div>
                              <p className="font-medium">{app.student_name}</p>
                              <p className="hint mt-1">{app.student_email}</p>
                              <p className="hint mt-1">
                                {app.department || "Department not provided"}
                                {app.cgpa != null ? ` · CGPA ${app.cgpa}` : ""}
                              </p>
                            </div>
                          </div>
                          {app.cover_letter && (
                            <details className="mt-2 max-w-sm text-xs text-[#5f6e57]">
                              <summary className="cursor-pointer">
                                Read introduction
                              </summary>
                              <p className="mt-2 whitespace-pre-wrap leading-6">
                                {app.cover_letter}
                              </p>
                            </details>
                          )}
                        </td>
                        <td className="text-xs">{app.job_title}</td>
                        <td>
                          <label>
                            <span className="sr-only">
                              Application status for {app.student_name} —{" "}
                              {app.job_title}
                            </span>
                            <select
                              disabled={updating !== null}
                              className="rounded-lg border border-[#dce4d1] bg-[#f7f9f2] p-2 text-xs capitalize"
                              value={app.status}
                              onChange={(e) =>
                                changeStatus(app.id, e.target.value)
                              }
                            >
                              {[
                                "applied",
                                "shortlisted",
                                "rejected",
                                "selected",
                              ].map((status) => (
                                <option key={status}>{status}</option>
                              ))}
                            </select>
                          </label>
                          {updating === app.id && (
                            <span className="hint block">Saving…</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                title="Good conversations take a first step"
                text="Applications to your roles will appear here when students apply."
              />
            )}
          </section>
        </>
      )}
      <ConfirmDialog
        open={!!deleting}
        title="Delete this opportunity?"
        description={`“${deleting?.title}” and all associated applications will be permanently removed.`}
        pending={busy}
        onConfirm={remove}
        onClose={() => setDeleting(null)}
      />
    </DashboardLayout>
  );
}
