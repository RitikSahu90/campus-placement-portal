import { FormEvent, useEffect, useState } from "react";
import { ExternalLink, Save } from "lucide-react";
import Loader from "../components/Loader";
import { Avatar, DashboardLayout, Feedback } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import { fetchProfile, saveProfile } from "../services/profile";
import { errorMessage } from "../services/api";
import { Profile as ProfileType } from "../utils/types";
import { safeResumeUrl } from "../utils/format";
export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState(false);
  async function load() {
    setLoading(true);
    setLoadError(false);
    setError("");
    try {
      setProfile(await fetchProfile());
    } catch (err) {
      setError(errorMessage(err));
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const number = (name: string) =>
      form.get(name) ? Number(form.get(name)) : undefined;
    try {
      const result = await saveProfile({
        phone: String(form.get("phone") || ""),
        department: String(form.get("department") || ""),
        graduationYear: number("graduationYear"),
        cgpa: number("cgpa"),
        skills: String(form.get("skills") || ""),
        resumeUrl: String(form.get("resumeUrl") || ""),
        bio: String(form.get("bio") || ""),
      });
      setProfile(result);
      setMessage("Your profile is up to date.");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }
  const fields = [
    {
      name: "phone",
      label: "Phone number",
      placeholder: "e.g. +91 98765 43210",
      value: profile?.phone,
      type: "tel",
      max: 20,
    },
    {
      name: "department",
      label: "Department",
      placeholder: "e.g. Computer Science",
      value: profile?.department,
      max: 100,
    },
    {
      name: "graduationYear",
      label: "Graduation year",
      placeholder: "e.g. 2027",
      value: profile?.graduation_year,
      type: "number",
      min: 1900,
      max: 2200,
    },
    {
      name: "cgpa",
      label: "CGPA (out of 10)",
      placeholder: "e.g. 8.50",
      value: profile?.cgpa,
      type: "number",
      min: 0,
      max: 10,
      step: "0.01",
    },
  ];
  const completeness = [
    profile?.department,
    profile?.graduation_year,
    profile?.cgpa != null,
    profile?.skills,
    profile?.resume_url,
    profile?.bio,
  ].filter(Boolean).length;
  return (
    <DashboardLayout role="student">
      <div>
        <p className="eyebrow">Tell your story</p>
        <h1 className="page-heading mt-3">A profile that feels like you.</h1>
        <p className="muted mt-3">
          Bring your skills, interests, and ambitions into focus.
        </p>
      </div>
      <Feedback>{error}</Feedback>
      <Feedback success>{message}</Feedback>
      {loading ? (
        <Loader />
      ) : loadError ? (
        <button className="btn-secondary" onClick={load}>
          Try again
        </button>
      ) : (
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_250px]">
          <section className="panel p-6 sm:p-8">
            <div className="mb-7 border-b border-[#e7ecdf] pb-6">
              <h2 className="text-lg font-semibold">The essentials</h2>
              <p className="hint">
                Examples in fields are placeholders. Only information you save
                goes into your profile.
              </p>
            </div>
            <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
              {fields.map((field) => (
                <label className="label" key={field.name}>
                  {field.label}
                  <input
                    className="field"
                    name={field.name}
                    type={field.type || "text"}
                    defaultValue={field.value ?? ""}
                    placeholder={field.placeholder}
                    min={field.min}
                    max={field.type === "number" ? field.max : undefined}
                    maxLength={field.type !== "number" ? field.max : undefined}
                    step={field.step}
                  />
                </label>
              ))}
              <div className="sm:col-span-2">
                <label className="label" htmlFor="profile-skills">
                  Skills
                </label>
                <input
                  id="profile-skills"
                  aria-describedby="skills-hint"
                  name="skills"
                  className="field"
                  maxLength={5000}
                  defaultValue={profile?.skills || ""}
                  placeholder="e.g. Java, Spring Boot, React, SQL"
                />
                <span id="skills-hint" className="hint block">
                  Separate your skills with commas.
                </span>
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="profile-resume">
                  Resume link
                </label>
                <input
                  id="profile-resume"
                  aria-describedby="resume-hint"
                  name="resumeUrl"
                  type="url"
                  pattern="https?://.+"
                  maxLength={255}
                  className="field"
                  defaultValue={profile?.resume_url || ""}
                  placeholder="https://your-resume-link.com/resume.pdf"
                />
                <span id="resume-hint" className="hint block">
                  Use an accessible HTTP or HTTPS link to your resume. File
                  uploads aren’t available yet.
                </span>
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="profile-bio">
                  About you
                </label>
                <textarea
                  id="profile-bio"
                  name="bio"
                  rows={5}
                  maxLength={5000}
                  className="field"
                  defaultValue={profile?.bio || ""}
                  placeholder="What do you enjoy building? What would you like to learn next?"
                />
              </div>
              <div className="border-t border-[#e7ecdf] pt-5 sm:col-span-2">
                <button disabled={saving} className="btn-primary">
                  <Save className="h-4 w-4" />
                  {saving ? "Saving…" : "Save my profile"}
                </button>
              </div>
            </form>
          </section>
          <aside className="panel p-6">
            <span className="eyebrow text-[10px]">Your profile preview</span>
            <div className="mt-6">
              <Avatar name={user?.name} size="lg" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">{user?.name}</h2>
            <p className="muted mt-1">
              {profile?.department || "Your department"}
            </p>
            <p className="hint">
              {profile?.graduation_year
                ? `Class of ${profile.graduation_year}`
                : "Your graduation year"}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {profile?.skills ? (
                profile.skills
                  .split(",")
                  .filter(Boolean)
                  .slice(0, 6)
                  .map((skill, i) => (
                    <span className="chip" key={i}>
                      {skill.trim()}
                    </span>
                  ))
              ) : (
                <span className="chip">Your skills will appear here</span>
              )}
            </div>
            <p className="muted mt-5">
              {profile?.bio ||
                "A short introduction helps recruiters understand your interests."}
            </p>
            {safeResumeUrl(profile?.resume_url) && (
              <a
                className="text-action mt-4"
                href={safeResumeUrl(profile?.resume_url)}
                target="_blank"
                rel="noopener noreferrer"
              >
                View resume <ExternalLink className="h-3 w-3" />
              </a>
            )}
            <div className="mt-6 border-t border-[#e7ecdf] pt-5">
              <div className="flex justify-between text-xs text-[#5f6e57]">
                <span>Profile completeness</span>
                <span>{Math.round((completeness / 6) * 100)}%</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#edf1e5]">
                <div
                  className="h-full bg-[#8aa064]"
                  style={{ width: `${(completeness / 6) * 100}%` }}
                />
              </div>
              <p className="hint">
                Based on the six core academic and career fields.
              </p>
            </div>
          </aside>
        </div>
      )}
    </DashboardLayout>
  );
}
