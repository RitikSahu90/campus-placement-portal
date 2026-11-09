import {
  ArrowRight,
  Building2,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
export default function HowItWorks() {
  return (
    <main id="main-content" className="container-page max-w-5xl py-12 sm:py-16">
      <p className="eyebrow">A clear path forward</p>
      <h1 className="display mt-5 text-5xl sm:text-6xl">
        A little clarity.
        <br />
        <span className="italic text-[#73944b]">A lot of possibility.</span>
      </h1>
      <p className="muted mt-6 max-w-xl">
        Campus brings students, recruiters, and placement teams into one shared
        workflow. Here’s what happens at every step.
      </p>
      <div className="mt-12 space-y-6">
        {[
          {
            icon: GraduationCap,
            title: "For students",
            intro: "From your first profile to your next opportunity.",
            steps: [
              "Create a student account with your name, email, and password.",
              "Add your department, graduation year, CGPA, skills, introduction, and an accessible resume link.",
              "Search and filter campus roles. Read the description, eligibility requirements, and deadline.",
              "Apply with an optional cover letter. Each student can apply to a role once.",
              "Follow applied, shortlisted, selected, or rejected statuses in your workspace. Recruiters update these as they review applications.",
            ],
          },
          {
            icon: Building2,
            title: "For recruiters",
            intro: "A thoughtful space to build your next team.",
            steps: [
              "Create a recruiter account and post your first opportunity with company details.",
              "Describe the work, location, compensation, job type, requirements, and deadline.",
              "Manage only your own jobs. Close applications or edit details as your hiring needs change.",
              "Review student introductions, academic information, and skills. Update application statuses as your process moves forward.",
            ],
          },
          {
            icon: ShieldCheck,
            title: "For placement administrators",
            intro: "Keep your campus hiring community in view.",
            steps: [
              "Sign in with a privately provisioned administrator account. Public admin signup is disabled.",
              "Review registered members and posted opportunities from the portal overview.",
              "Remove records when necessary. A confirmation explains which related data will be deleted.",
            ],
          },
        ].map(({ icon: Icon, title, intro, steps }) => (
          <section
            key={title}
            className="panel grid gap-6 p-6 sm:grid-cols-[220px_minmax(0,1fr)] sm:p-8"
          >
            <div>
              <span className="inline-flex rounded-2xl bg-[#edf3e1] p-3 text-[#71904b]">
                <Icon className="h-6 w-6" />
              </span>
              <h2 className="mt-4 text-xl font-semibold">{title}</h2>
              <p className="muted mt-3">{intro}</p>
            </div>
            <ol className="space-y-5">
              {steps.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f0f4e7] text-[10px] font-semibold text-[#7d9263]">
                    {i + 1}
                  </span>
                  <p className="muted">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
      <section className="mt-8 rounded-2xl border border-[#dce6ce] bg-[#eef4e5] p-7">
        <h2 className="font-semibold">A few things to know</h2>
        <ul className="muted mt-4 list-disc space-y-2 pl-5">
          <li>
            Closed roles and roles past their deadline don’t accept
            applications. Deadlines are evaluated in UTC.
          </li>
          <li>
            Eligibility is reviewed by recruiters; submitting an application
            doesn’t guarantee an interview or offer.
          </li>
          <li>
            Your session lives in this browser tab. Sign out on shared computers
            and keep your password private.
          </li>
          <li>
            Homepage profiles and reviews labeled “demo” or “sample” are
            presentation placeholders, not real members or endorsements.
          </li>
          <li>
            Your resume is shared as a link. Make sure its permissions allow the
            intended reader to open it.
          </li>
        </ul>
      </section>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link className="btn-primary" to="/register">
          Start your next chapter <ArrowRight className="h-4 w-4" />
        </Link>
        <Link className="btn-secondary" to="/jobs">
          Explore opportunities
        </Link>
      </div>
    </main>
  );
}
