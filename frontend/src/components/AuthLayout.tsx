import { ReactNode } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main id="main-content" className="container-page py-8 sm:py-12">
      <div className="auth-layout overflow-hidden rounded-[1.5rem] border border-[#dfe5dc] bg-white">
        <aside className="auth-story">
          <div>
            <span className="text-xs uppercase tracking-[.18em] text-[#b2cb91]">
              A little ambition goes a long way
            </span>
            <h1 className="display mt-7 text-4xl sm:text-5xl">
              Make room for
              <br />
              what’s <span className="italic text-[#cee8a1]">next.</span>
            </h1>
            <p className="mt-6 max-w-xs text-sm leading-7 text-[#b0c1a7]">
              A profile that tells your story. Opportunities that match your
              interests. A workspace that keeps you moving.
            </p>
          </div>
          <div className="mt-10 space-y-3 border-t border-[#456047] pt-6">
            {[
              "Your skills, in focus",
              "Applications, in one place",
              "A clear path forward",
            ].map((text) => (
              <p
                className="flex items-center gap-3 text-xs text-[#c5d4bc]"
                key={text}
              >
                <Check className="h-3.5 w-3.5 text-[#cce7a0]" />
                {text}
              </p>
            ))}
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 pt-3 text-xs text-[#cee8a1]"
            >
              Explore the journey <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>
        <section className="auth-form">{children}</section>
      </div>
    </main>
  );
}
