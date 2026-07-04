import { CalendarDays, MapPin, WalletCards } from "lucide-react";
import { Link } from "react-router-dom";
import { Job } from "../utils/types";

export default function JobCard({ job }: { job: Job }) {
  return (
    <article className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-700">{job.company_name}</p>
          <h3 className="mt-1 text-xl font-semibold text-gray-950">{job.title}</h3>
        </div>
        <span className="w-fit rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold uppercase text-blue-700">
          {job.status}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-gray-600">{job.description}</p>

      <div className="mt-4 grid gap-2 text-sm text-gray-600 sm:grid-cols-3">
        <span className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          {job.location}
        </span>
        <span className="flex items-center gap-2">
          <WalletCards className="h-4 w-4 text-gray-400" />
          {job.salary || "Not disclosed"}
        </span>
        <span className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-gray-400" />
          {new Date(job.deadline).toLocaleDateString()}
        </span>
      </div>

      <Link
        to={`/jobs/${job.id}`}
        className="mt-5 inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
      >
        View Details
      </Link>
    </article>
  );
}
