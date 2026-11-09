export default function Loader() {
  return (
    <div
      role="status"
      className="flex min-h-[280px] items-center justify-center gap-3 text-sm text-[#5f6e57]"
    >
      <span
        aria-hidden="true"
        className="h-5 w-5 animate-spin rounded-full border-2 border-[#d5dfc7] border-t-[#406431]"
      />
      Loading your workspace…
    </div>
  );
}
