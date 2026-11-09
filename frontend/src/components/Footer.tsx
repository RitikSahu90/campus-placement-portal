import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#dfe5dc] bg-[#f2f5eb]">
      <div className="container-page flex flex-col justify-between gap-6 py-9 sm:flex-row sm:items-center">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-lg font-bold"
          >
            <BriefcaseBusiness className="h-5 w-5" />
            campus.
          </Link>
          <p className="mt-2 text-xs text-[#5f6e57]">
            A thoughtful start to your working life.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-7 text-xs text-[#66745d]">
          <Link to="/jobs" className="hover:underline">
            Opportunities
          </Link>
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-1 hover:underline"
          >
            How it works <ArrowUpRight className="h-3 w-3" />
          </Link>
          <span>© {new Date().getFullYear()} Campus Placement Portal</span>
        </div>
      </div>
    </footer>
  );
}
