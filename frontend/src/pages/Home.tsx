import { ArrowRight, Building2, GraduationCap, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main>
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-normal text-gray-950 sm:text-5xl">
              Campus Placement Portal
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              A clean placement workflow for students, recruiters, and administrators with JWT authentication,
              role-based dashboards, MySQL data, and complete CRUD flows.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Browse Jobs
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/register"
                className="rounded-md border border-gray-300 px-5 py-3 font-semibold text-gray-800 hover:bg-gray-50"
              >
                Create Account
              </Link>
            </div>
          </div>
          <div className="grid gap-4">
            {[
              { icon: GraduationCap, title: "Students", text: "Build profiles and apply to eligible jobs." },
              { icon: Building2, title: "Recruiters", text: "Create company details and manage job posts." },
              { icon: ShieldCheck, title: "Admins", text: "Review users and jobs from one dashboard." }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-md border border-gray-200 bg-gray-50 p-5">
                  <Icon className="h-7 w-7 text-blue-600" />
                  <h2 className="mt-3 text-lg font-semibold text-gray-950">{item.title}</h2>
                  <p className="mt-1 text-sm text-gray-600">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
