import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Wallet,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { Feedback, StatusBadge } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import { applyToJob, fetchJob } from "../services/jobs";
import { errorMessage } from "../services/api";
import { Job } from "../utils/types";
import { formatDate, isJobOpen } from "../utils/format";
export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applyError, setApplyError] = useState("");
  const [applied, setApplied] = useState(false);
  const [busy, setBusy] = useState(false);
  async function load() {
    setLoading(true);
    setError("");
    try {
      if (id) setJob(await fetchJob(id));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    setApplied(false);
    setApplyError("");
    void load();
  }, [id]);
  async function apply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setApplyError("");
    try {
      await applyToJob(Number(id), String(form.get("coverLetter") || ""));
      setApplied(true);
    } catch (err) {
      setApplyError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <main id="main-content" className="container-page py-8 sm:py-12">
      <Link to="/jobs" className="text-action mb-7">
        <ArrowLeft className="h-4 w-4" />
        All opportunities
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <>
          <Feedback>{error}</Feedback>
          <button className="btn-secondary mt-4" onClick={load}>
            Try again
          </button>
        </>
      ) : (
        job && (
          <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
            <section className="panel p-6 sm:p-9">
              <div className="flex items-center justify-between gap-3">
                <p className="eyebrow">{job.company_name}</p>
                <StatusBadge status={isJobOpen(job) ? "open" : "closed"} />
              </div>
              <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                {job.title}
              </h1>
              <div className="my-6 flex flex-wrap gap-3">
                <span className="chip capitalize">
                  {job.job_type.replace(/-/g, " ")}
                </span>
                <span className="chip">
                  <MapPin className="h-3 w-3" />
                  {job.location}
                </span>
              </div>
              <div className="space-y-8 border-t border-[#e4eade] pt-8">
                <div>
                  <h2 className="text-lg font-semibold">The opportunity</h2>
                  <p className="muted mt-4 whitespace-pre-wrap leading-7">
                    {job.description}
                  </p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Who can apply</h2>
                  <p className="muted mt-4 whitespace-pre-wrap leading-7">
                    {job.eligibility_criteria ||
                      "The recruiter hasn’t specified additional eligibility criteria."}
                  </p>
                  <p className="hint">
                    Please review the criteria before applying. Academic
                    eligibility is reviewed by the recruiter.
                  </p>
                </div>
              </div>
            </section>
            <aside className="space-y-5 lg:sticky lg:top-28">
              <section className="panel p-6">
                <h2 className="font-semibold">At a glance</h2>
                <div className="mt-6 space-y-5">
                  {[
                    {
                      icon: Wallet,
                      label: "Compensation",
                      value: job.salary || "Not disclosed",
                    },
                    { icon: MapPin, label: "Location", value: job.location },
                    {
                      icon: CalendarDays,
                      label: "Apply by (UTC)",
                      value: formatDate(job.deadline),
                    },
                  ].map(({ icon: Icon, label, value }) => (
                    <div className="flex gap-3" key={label}>
                      <Icon className="mt-1 h-4 w-4 shrink-0 text-[#8c9c75]" />
                      <div>
                        <p className="text-xs text-[#5f6e57]">{label}</p>
                        <p className="mt-1 text-sm font-medium">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              <section className="panel p-6">
                {!isJobOpen(job) ? (
                  <>
                    <h2 className="font-semibold">
                      This opportunity has closed.
                    </h2>
                    <p className="muted mt-3">
                      There are more beginnings out there. Explore the latest
                      open roles.
                    </p>
                    <Link to="/jobs" className="btn-secondary mt-5 w-full">
                      Find another opportunity
                    </Link>
                  </>
                ) : !user ? (
                  <>
                    <h2 className="font-semibold">
                      Ready to take the next step?
                    </h2>
                    <p className="muted mt-3">
                      Sign in with a student account to apply.
                    </p>
                    <Link to="/login" className="btn-primary mt-5 w-full">
                      Sign in to apply <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </>
                ) : user.role !== "student" ? (
                  <p className="muted">
                    Applications are available to student accounts. Manage
                    hiring from your workspace.
                  </p>
                ) : applied ? (
                  <>
                    <Feedback success>Your application is on its way.</Feedback>
                    <Link to="/student" className="text-action mt-5">
                      Track my application <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </>
                ) : (
                  <>
                    <h2 className="font-semibold">Introduce yourself.</h2>
                    <p className="muted mt-2">
                      Share a little about why this role interests you.
                    </p>
                    <div className="mt-4">
                      <Feedback>{applyError}</Feedback>
                    </div>
                    <form onSubmit={apply} className="mt-4">
                      <label className="label">
                        Cover letter{" "}
                        <span className="font-normal text-[#8a947d]">
                          (optional)
                        </span>
                        <textarea
                          name="coverLetter"
                          rows={6}
                          maxLength={10000}
                          className="field"
                          placeholder="What would you bring to this team?"
                        />
                      </label>
                      <Link
                        to="/profile"
                        className="hint mt-3 inline-block underline"
                      >
                        Check your profile before applying
                      </Link>
                      <button
                        disabled={busy}
                        className="btn-primary mt-5 w-full"
                      >
                        {busy ? "Sending application…" : "Send my application"}
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </form>
                  </>
                )}
              </section>
            </aside>
          </div>
        )
      )}
    </main>
  );
}
