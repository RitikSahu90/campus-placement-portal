import { Job } from "./types";
export function isJobOpen(job: Job) {
  return (
    job.status === "open" &&
    job.deadline.slice(0, 10) >= new Date().toISOString().slice(0, 10)
  );
}
export function formatDate(date?: string) {
  return date
    ? new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(date))
    : "Not specified";
}
export function safeResumeUrl(url?: string) {
  try {
    const parsed = new URL(url || "");
    return parsed.protocol === "https:" || parsed.protocol === "http:"
      ? parsed.href
      : undefined;
  } catch {
    return undefined;
  }
}
