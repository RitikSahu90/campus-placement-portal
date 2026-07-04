import { FormEvent, useEffect, useState } from "react";
import { CalendarDays, MapPin, WalletCards } from "lucide-react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { applyToJob, fetchJob } from "../services/jobs";
import { Job } from "../utils/types";

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (id) fetchJob(id).then(setJob);
  }, [id]);

  async function handleApply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await applyToJob(Number(id), String(form.get("coverLetter") || ""));
      setMessage("Application submitted successfully.");
    } catch {
      setMessage("Unable to apply. You may have already applied.");
    }
  }

  if (!job) return <Loader />;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <section className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-blue-700">{job.company_name}</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950">{job.title}</h1>
        <div className="mt-5 grid gap-3 text-sm text-gray-600 sm:grid-cols-3">
          <span className="flex items-center gap-2"><MapPin className="h-4 w-4" />{job.location}</span>
          <span className="flex items-center gap-2"><WalletCards className="h-4 w-4" />{job.salary || "Not disclosed"}</span>
          <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4" />{new Date(job.deadline).toLocaleDateString()}</span>
        </div>
        <div className="mt-6 space-y-5 text-gray-700">
          <div>
            <h2 className="font-semibold text-gray-950">Description</h2>
            <p className="mt-2 leading-7">{job.description}</p>
          </div>
          <div>
            <h2 className="font-semibold text-gray-950">Eligibility</h2>
            <p className="mt-2 leading-7">{job.eligibility_criteria || "No extra criteria provided."}</p>
          </div>
        </div>
      </section>

      {user?.role === "student" && (
        <section className="mt-6 rounded-md border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-950">Apply for this job</h2>
          {message && <p className="mt-3 rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700">{message}</p>}
          <form onSubmit={handleApply} className="mt-4 space-y-4">
            <textarea
              name="coverLetter"
              rows={5}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Short cover letter"
            />
            <button className="rounded-md bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700">
              Submit Application
            </button>
          </form>
        </section>
      )}
    </main>
  );
}
