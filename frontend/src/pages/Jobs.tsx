import { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import Loader from "../components/Loader";
import { fetchJobs } from "../services/jobs";
import { Job } from "../utils/types";

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs()
      .then(setJobs)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-950">Jobs</h1>
          <p className="mt-1 text-gray-600">Browse campus openings posted by recruiters.</p>
        </div>
        <span className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
          {jobs.length} openings
        </span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {jobs.map((job) => <JobCard key={job.id} job={job} />)}
      </div>
    </main>
  );
}
