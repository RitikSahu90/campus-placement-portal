import { useEffect, useRef, ReactNode } from "react";
import { AlertCircle, ArrowUpRight, Inbox, X } from "lucide-react";
import Sidebar from "./Sidebar";
import { UserRole } from "../utils/types";

export function Avatar({
  name,
  size = "md",
}: {
  name?: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials =
    name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((s) => s[0])
      .join("")
      .toUpperCase() || "?";
  return (
    <span
      aria-hidden="true"
      className={`avatar ${size === "lg" ? "h-20 w-20 text-2xl" : size === "sm" ? "h-9 w-9 text-xs" : "h-12 w-12 text-sm"}`}
    >
      {initials}
    </span>
  );
}
export function Feedback({
  children,
  success = false,
}: {
  children?: ReactNode;
  success?: boolean;
}) {
  return children ? (
    <div
      role={success ? "status" : "alert"}
      className={`flex items-start gap-2 rounded-xl border p-4 text-sm leading-6 ${success ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}
    >
      <AlertCircle className="mt-1 h-4 w-4 shrink-0" /> <span>{children}</span>
    </div>
  ) : null;
}
export function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-5 py-14 text-center">
      <span className="mb-4 rounded-2xl bg-[#f0f4e9] p-4">
        <Inbox className="h-6 w-6 text-[#627957]" />
      </span>
      <h3 className="font-semibold">{title}</h3>
      <p className="muted mt-2 max-w-sm">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
export function StatusBadge({ status }: { status: string }) {
  const positive = ["open", "selected", "shortlisted"].includes(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize ${positive ? "bg-[#edf5df] text-[#49632a]" : status === "rejected" ? "bg-red-50 text-red-700" : "bg-[#f0f2ee] text-[#5f6e57]"}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${positive ? "bg-[#6c9145]" : "bg-current"}`}
      />
      {status.replace(/-/g, " ")}
    </span>
  );
}
export function DashboardLayout({
  role,
  children,
}: {
  role: UserRole;
  children: ReactNode;
}) {
  return (
    <main id="main-content" className="dashboard">
      <Sidebar role={role} />
      <div className="min-w-0 space-y-7">{children}</div>
    </main>
  );
}
export function StatCard({
  label,
  value,
  caption,
}: {
  label: string;
  value: number | string;
  caption: string;
}) {
  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between">
        <p className="muted">{label}</p>
        <ArrowUpRight className="h-4 w-4 text-[#9ca990]" />
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="hint">{caption}</p>
    </div>
  );
}
export function ConfirmDialog({
  open,
  title,
  description,
  pending,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  pending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open && !ref.current?.open) ref.current?.showModal();
    else if (!open) ref.current?.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      aria-labelledby="confirm-title"
      aria-describedby="confirm-description"
      className="modal"
      onCancel={(event) => {
        event.preventDefault();
        if (!pending) onClose();
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <h2 id="confirm-title" className="text-xl font-semibold">
          {title}
        </h2>
        <button
          aria-label="Cancel deletion"
          disabled={pending}
          onClick={onClose}
          className="rounded-lg p-2 hover:bg-gray-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <p id="confirm-description" className="muted mt-3">
        {description}
      </p>
      <div className="mt-7 flex justify-end gap-3">
        <button
          className="btn-secondary"
          disabled={pending}
          onClick={onClose}
          autoFocus
        >
          Cancel
        </button>
        <button className="btn-danger" disabled={pending} onClick={onConfirm}>
          {pending ? "Deleting…" : "Delete"}
        </button>
      </div>
    </dialog>
  );
}
