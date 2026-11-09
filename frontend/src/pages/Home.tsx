import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  Layers3,
  Quote,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { demoProfiles, demoReviews } from "../data/placeholders";
import { Avatar } from "../components/UI";
import JobCard from "../components/JobCard";
import { fetchJobs } from "../services/jobs";
import { Job } from "../utils/types";
import { isJobOpen } from "../utils/format";
export default function Home() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    let active = true;
    fetchJobs()
      .then((data) => {
        if (active) setJobs(data.filter(isJobOpen).slice(0, 3));
      })
      .catch(() => {
        if (active) setUnavailable(true);
      });
    return () => {
      active = false;
    };
  }, []);
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("query");
    navigate(`/jobs?q=${encodeURIComponent(String(query || ""))}`);
  }
  return (
    <main id="main-content">
      <section className="container-page grid gap-12 pb-14 pt-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16 lg:pb-20 lg:pt-20">
        <div>
          <p className="eyebrow flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#71974b]" />
            For the next generation of doers
          </p>
          <h1 className="display mt-6 max-w-xl text-[3.5rem] sm:text-7xl lg:text-[5.5rem]">
            Big ambitions.
            <br />A place to{" "}
            <span className="italic text-[#688c45]">begin.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-[#5f6e57]">
            Your first role is the start of something bigger. Discover campus
            opportunities, meet your next team, and take the next step with
            confidence.
          </p>
          <form
            onSubmit={search}
            className="mt-8 flex max-w-lg flex-col gap-2 rounded-2xl border border-[#dbe3d2] bg-white p-2 shadow-[0_4px_20px_#193e3105] sm:flex-row"
          >
            <label className="flex min-w-0 flex-1 items-center gap-3 px-3">
              <span className="sr-only">Search opportunities</span>
              <Sparkles className="h-4 w-4 shrink-0 text-[#8da16d]" />
              <input
                name="query"
                className="min-h-11 w-full bg-transparent text-sm outline-none placeholder:text-[#909988]"
                placeholder="Job title, skill, or company"
              />
            </label>
            <button className="btn-primary">
              Find my next step <ArrowUpRight className="h-4 w-4" />
            </button>
          </form>
          <div className="mt-5 flex flex-wrap gap-4 text-xs text-[#5f6e57]">
            <span className="flex items-center gap-1.5">
              <Check className="h-3 w-3" />
              Internships & graduate roles
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3 w-3" />
              One profile, more possibilities
            </span>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-lg">
          <div className="preview-grid relative overflow-hidden rounded-[2rem] bg-[#e7edda] px-5 pb-8 pt-6 sm:px-9 sm:pb-12 sm:pt-9">
            <div className="mb-8 flex items-center justify-between">
              <span className="rounded-full border border-[#bccbad] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.15em] text-[#617747]">
                A glimpse of your journey
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d7e2c6]">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
            <div className="panel relative -rotate-2 p-5 shadow-[0_14px_40px_#24462a12] sm:p-7">
              <div className="flex items-center gap-4">
                <Avatar name="Aarav Sharma" />
                <div>
                  <span className="mb-1 inline-block text-[9px] font-semibold uppercase tracking-widest text-[#5f6e57]">
                    Demo profile
                  </span>
                  <h2 className="font-semibold">Aarav Sharma</h2>
                  <p className="mt-1 text-xs text-[#5f6e57]">
                    Computer Science · Class of 2027
                  </p>
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <span className="chip">Java</span>
                <span className="chip">React</span>
                <span className="chip">SQL</span>
              </div>
              <div className="mt-6 border-t border-[#e7ebdf] pt-4">
                <div className="flex justify-between text-xs">
                  <span className="text-[#5f6e57]">
                    Profile progress · sample
                  </span>
                  <span className="font-semibold">80%</span>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-[#eef1e8]">
                  <div className="h-full w-4/5 rounded-full bg-[#8fa768]" />
                </div>
              </div>
            </div>
            <div className="panel relative ml-6 mt-5 rotate-2 p-5 shadow-[0_12px_25px_#24462a0d]">
              <div className="flex items-start justify-between">
                <span className="rounded-xl bg-[#eff3e7] p-2.5">
                  <FileCheck2 className="h-5 w-5 text-[#6b854b]" />
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-widest text-[#5f6e57]">
                  Demo activity
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold">
                Your next chapter is taking shape.
              </h3>
              <p className="mt-2 text-xs leading-5 text-[#5f6e57]">
                Build a profile. Find your fit. Follow your applications.
              </p>
              <div className="mt-4 flex items-center gap-2 border-t border-[#edf0e7] pt-3 text-xs text-[#5f6e57]">
                <CheckCircle2 className="h-4 w-4" />A clear view of every step
              </div>
            </div>
            <span
              className="absolute -bottom-9 -right-5 text-[140px] leading-none text-[#d4dfc1]"
              aria-hidden="true"
            >
              ✳
            </span>
          </div>
          <p className="mt-3 text-center text-[10px] text-[#5f6e57]">
            Illustrative preview. Profiles and activity shown here are
            placeholders.
          </p>
        </div>
      </section>
      <div className="border-y border-[#e0e6d8] bg-[#f0f3e9]">
        <div className="container-page flex flex-wrap items-center justify-between gap-5 py-6">
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#5f6e57]">
            Built around your next step
          </p>
          {[
            "Students with ambition",
            "Recruiters with opportunity",
            "Teams that bring them together",
          ].map((text) => (
            <span
              key={text}
              className="flex items-center gap-2 text-sm text-[#5f6e57]"
            >
              <span className="h-1 w-1 rounded-full bg-[#91a675]" />
              {text}
            </span>
          ))}
        </div>
      </div>
      <section className="container-page py-16 sm:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Make your move</p>
            <h2 className="section-heading mt-3">
              Good work starts with a good fit.
            </h2>
            <p className="muted mt-3">
              Explore the latest openings from your campus hiring community.
            </p>
          </div>
          <Link to="/jobs" className="text-action">
            All opportunities <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {jobs.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <JobCard job={job} key={job.id} />
            ))}
          </div>
        ) : (
          <div className="panel flex flex-col justify-between gap-5 p-7 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-semibold">
                {unavailable
                  ? "Opportunities will be back shortly."
                  : "Your next opportunity is on its way."}
              </h3>
              <p className="muted mt-2">
                {unavailable
                  ? "We couldn’t connect to the job board. You can try again from the opportunities page."
                  : "Recruiters’ active openings will appear here as soon as they’re posted."}
              </p>
            </div>
            <Link to="/jobs" className="btn-secondary shrink-0">
              Visit the job board <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>
      <section id="journey" className="container-page pb-20">
        <div className="rounded-[2rem] bg-[#1c3e31] p-7 text-white sm:p-12">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#b4ca92]">
                Less guesswork. More possibility.
              </p>
              <h2 className="display mt-4 max-w-lg text-4xl sm:text-5xl">
                A simpler path from
                <br />
                campus to career.
              </h2>
            </div>
            <Link to="/how-it-works" className="btn-lime">
              See how it works <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                n: "01",
                icon: GraduationCap,
                title: "Make it yours",
                text: "Create your account and tell your story with a profile that brings your skills into focus.",
              },
              {
                n: "02",
                icon: Layers3,
                title: "Find your kind of work",
                text: "Explore internships and graduate roles. Read the details and choose the opportunities that fit.",
              },
              {
                n: "03",
                icon: FileCheck2,
                title: "Take the next step",
                text: "Apply with a short introduction and follow your application from your personal workspace.",
              },
            ].map(({ n, icon: Icon, title, text }) => (
              <div key={n} className="border-t border-[#41604c] pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#a0b786]">{n} /</span>
                  <Icon className="h-5 w-5 text-[#c7dfa3]" />
                </div>
                <h3 className="mt-6 text-lg font-medium">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#b3c3ab]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="container-page pb-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Potential, in every direction</p>
            <h2 className="section-heading mt-3">Every profile has a story.</h2>
          </div>
          <span className="chip">Illustrative demo profiles</span>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {demoProfiles.map((profile) => (
            <article className="panel p-6" key={profile.name}>
              <div className="flex items-center justify-between">
                <Avatar name={profile.name} />
                <span className="text-[10px] uppercase tracking-widest text-[#5f6e57]">
                  Demo profile
                </span>
              </div>
              <h3 className="mt-5 font-semibold">{profile.name}</h3>
              <p className="muted mt-1">{profile.field}</p>
              <p className="mt-1 text-xs text-[#5f6e57]">{profile.year}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span className="chip" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
        <p className="hint mt-4">
          These fictional profiles show how your campus community could look.
          They are not searchable user accounts.
        </p>
      </section>
      <section className="border-y border-[#e0e6d8] bg-[#f0f3e9] py-16 sm:py-20">
        <div className="container-page">
          <div className="mb-9 text-center">
            <p className="eyebrow">Room for your community’s voice</p>
            <h2 className="section-heading mt-3">
              Stories that will belong here.
            </h2>
            <p className="muted mt-3">
              A preview of the review section. Real feedback will replace these
              placeholders.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {demoReviews.map((review) => (
              <article className="panel p-6" key={review.name}>
                <div className="flex items-center justify-between">
                  <Quote className="h-6 w-6 text-[#8da769]" />
                  <span className="chip text-[10px]">Sample review</span>
                </div>
                <p className="mt-5 text-sm leading-7 text-[#6b7960]">
                  {review.quote}
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-[#edf0e6] pt-5">
                  <Avatar name={review.name} size="sm" />
                  <div>
                    <h3 className="text-sm font-semibold">{review.name}</h3>
                    <p className="mt-1 text-[10px] text-[#5f6e57]">
                      {review.role}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="container-page flex flex-col items-center py-20 text-center">
        <span className="mb-5 rounded-full bg-[#e9efdc] p-3">
          <ArrowDown className="h-5 w-5 text-[#6d874c]" />
        </span>
        <h2 className="display text-4xl sm:text-5xl">
          Your future doesn’t start someday.
          <br />
          <span className="italic text-[#73934e]">It starts with a step.</span>
        </h2>
        <p className="muted mt-5">
          Build your profile. Find an opportunity. Begin your next chapter.
        </p>
        <Link to="/register" className="btn-primary mt-7">
          Let’s get started <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}
