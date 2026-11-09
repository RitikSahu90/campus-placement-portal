import { ArrowUpRight, CalendarDays, MapPin, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { Job } from "../utils/types";
import { formatDate, isJobOpen } from "../utils/format";
import { StatusBadge } from "./UI";
export default function JobCard({ job }: { job: Job }) {
  return (
    <article className="panel flex h-full flex-col p-6 transition-shadow hover:shadow-[0_8px_24px_#21462908]">
      <div className="flex items-start justify-between gap-3">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#dce5d2] bg-[#f2f5eb] text-sm font-bold text-[#5f6e57]"
          aria-hidden="true"
        >
          {job.company_name.slice(0, 2).toUpperCase()}
        </span>
        <StatusBadge status={isJobOpen(job) ? "open" : "closed"} />
      </div>
      <p className="mt-5 text-xs text-[#5f6e57]">{job.company_name}</p>
      <h3 className="mt-2 text-lg font-semibold leading-6">
        <Link to={`/jobs/${job.id}`} className="hover:underline">
          {job.title}
        </Link>
      </h3>
      <div className="mt-3 flex gap-2">
        <span className="chip capitalize">
          {job.job_type.replace(/-/g, " ")}
        </span>
      </div>
      <p className="muted mt-4 line-clamp-2">{job.description}</p>
      <div className="mt-5 space-y-2 text-xs text-[#5f6e57]">
        <p className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5" />
          {job.location}
        </p>
        <p className="flex items-center gap-2">
          <Wallet className="h-3.5 w-3.5" />
          {job.salary || "Salary not disclosed"}
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#e9eee2] pt-5 text-xs text-[#5f6e57] translate-y-1">
        <span className="mt-5 flex items-center gap-1.5">
          <CalendarDays className="h-3 w-3" />
          {formatDate(job.deadline)}
        </span>
        <Link
          to={`/jobs/${job.id}`}
          aria-label={`View ${job.title} at ${job.company_name}`}
          className="mt-5 flex h-9 w-9 items-center justify-center rounded-full border border-[#dbe4d1] text-[#597340] hover:bg-[#edf3e2]"
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
