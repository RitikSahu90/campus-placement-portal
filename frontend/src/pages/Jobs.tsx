import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import JobCard from "../components/JobCard";
import Loader from "../components/Loader";
import { EmptyState, Feedback } from "../components/UI";
import { fetchJobs } from "../services/jobs";
import { errorMessage } from "../services/api";
import { Job } from "../utils/types";
import { isJobOpen } from "../utils/format";
export default function Jobs() {
  const [params, setParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [showClosed, setShowClosed] = useState(false);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const query = params.get("q") || "";
  async function load() {
    setLoading(true);
    setError("");
    try {
      setJobs(await fetchJobs());
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => setPage(1), [query, type, location, showClosed, sort]);
  const filtered = useMemo(
    () =>
      jobs
        .filter(
          (job) =>
            (showClosed || isJobOpen(job)) &&
            (!type || job.job_type === type) &&
            (!location || job.location === location) &&
            `${job.title} ${job.company_name} ${job.description} ${job.eligibility_criteria || ""}`
              .toLowerCase()
              .includes(query.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "deadline"
            ? a.deadline.localeCompare(b.deadline)
            : b.id - a.id,
        ),
    [jobs, query, type, location, showClosed, sort],
  );
  const locations = [...new Set(jobs.map((job) => job.location))].sort();
  function clear() {
    setParams({});
    setType("");
    setLocation("");
    setShowClosed(false);
  }
  return (
    <main id="main-content" className="container-page py-10 sm:py-14">
      <div className="mb-9">
        <p className="eyebrow">A new chapter is calling</p>
        <h1 className="display mt-4 text-5xl sm:text-6xl">
          Find work that feels
          <br className="hidden sm:block" /> like{" "}
          <span className="italic text-[#72934c]">a beginning.</span>
        </h1>
        <p className="muted mt-5 max-w-lg">
          Explore campus internships and graduate roles. Find the team, the
          challenge, and the opportunity that’s right for you.
        </p>
      </div>
      <div className="grid items-start gap-7 lg:grid-cols-[235px_minmax(0,1fr)]">
        <aside className="panel space-y-6 p-5 lg:sticky lg:top-28">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <SlidersHorizontal className="h-4 w-4" />
              Your preferences
            </h2>
            <button
              onClick={clear}
              className="text-xs text-[#5f6e57] hover:underline"
            >
              Reset
            </button>
          </div>
          <label className="label">
            Opportunity type
            <select
              className="field"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">All types</option>
              <option value="internship">Internship</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
            </select>
          </label>
          <label className="label">
            Location
            <select
              className="field"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Anywhere</option>
              {locations.map((place) => (
                <option key={place}>{place}</option>
              ))}
            </select>
          </label>
          <label className="flex items-start gap-2 text-xs leading-5 text-[#5f6e57]">
            <input
              type="checkbox"
              checked={showClosed}
              onChange={(e) => setShowClosed(e.target.checked)}
              className="mt-1 accent-[#426931]"
            />
            Include closed & expired roles
          </label>
          <div className="border-t border-[#e7ecdf] pt-5">
            <p className="text-xs leading-6 text-[#5f6e57]">
              Take a moment to read each role’s eligibility and deadline before
              applying.
            </p>
          </div>
        </aside>
        <section className="min-w-0">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            <label className="flex flex-1 items-center gap-3 rounded-xl border border-[#dfe5d6] bg-white px-4">
              <Search className="h-4 w-4 text-[#8b987d]" />
              <span className="sr-only">Search jobs</span>
              <input
                value={query}
                onChange={(e) =>
                  setParams(e.target.value ? { q: e.target.value } : {}, {
                    replace: true,
                  })
                }
                placeholder="Search titles, skills, or companies"
                className="min-h-12 min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
            </label>
            <label className="sr-only" htmlFor="sort">
              Sort jobs
            </label>
            <select
              id="sort"
              className="rounded-xl border border-[#dfe5d6] bg-white px-4 py-3 text-xs text-[#5f6e57]"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="deadline">Deadline first</option>
            </select>
          </div>
          <Feedback>{error}</Feedback>
          {loading ? (
            <Loader />
          ) : error ? (
            <button className="btn-secondary mt-4" onClick={load}>
              Try again
            </button>
          ) : (
            <>
              <p className="mb-5 text-xs text-[#5f6e57]">
                {filtered.length}{" "}
                {filtered.length === 1 ? "opportunity" : "opportunities"}{" "}
                {query ? `for “${query}”` : "to explore"}
              </p>
              {filtered.length ? (
                <>
                  <div className="grid gap-5 md:grid-cols-2">
                    {filtered.slice((page - 1) * 6, page * 6).map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                  {filtered.length > 6 && (
                    <nav
                      aria-label="Job result pages"
                      className="mt-7 flex items-center justify-center gap-4"
                    >
                      <button
                        className="btn-secondary"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                      >
                        Previous
                      </button>
                      <span className="text-xs">
                        Page {page} of {Math.ceil(filtered.length / 6)}
                      </span>
                      <button
                        className="btn-secondary"
                        disabled={page >= Math.ceil(filtered.length / 6)}
                        onClick={() => setPage(page + 1)}
                      >
                        Next
                      </button>
                    </nav>
                  )}
                </>
              ) : (
                <div className="panel">
                  <EmptyState
                    title="No opportunities match just yet"
                    text="Try a different search or reset your preferences. New roles will appear as recruiters post them."
                    action={
                      <button onClick={clear} className="btn-secondary">
                        Clear preferences
                      </button>
                    }
                  />
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
