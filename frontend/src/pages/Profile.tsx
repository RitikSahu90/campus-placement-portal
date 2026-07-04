import { FormEvent, useEffect, useState } from "react";
import Loader from "../components/Loader";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { fetchProfile, saveProfile } from "../services/profile";
import { Profile as ProfileType } from "../utils/types";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile()
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await saveProfile({
      phone: String(form.get("phone") || ""),
      department: String(form.get("department") || ""),
      graduationYear: Number(form.get("graduationYear") || 0),
      cgpa: Number(form.get("cgpa") || 0),
      skills: String(form.get("skills") || ""),
      resumeUrl: String(form.get("resumeUrl") || ""),
      bio: String(form.get("bio") || "")
    });
    setMessage("Profile saved.");
  }

  if (loading || !user) return <Loader />;

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[240px_1fr]">
      <Sidebar role="student" />
      <section className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-950">Student Profile</h1>
        {message && <p className="mt-4 rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700">{message}</p>}
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <input name="phone" defaultValue={profile?.phone || ""} placeholder="Phone" className="rounded-md border border-gray-300 px-3 py-2" />
          <input name="department" defaultValue={profile?.department || ""} placeholder="Department" className="rounded-md border border-gray-300 px-3 py-2" />
          <input name="graduationYear" type="number" defaultValue={profile?.graduation_year || ""} placeholder="Graduation year" className="rounded-md border border-gray-300 px-3 py-2" />
          <input name="cgpa" type="number" step="0.01" defaultValue={profile?.cgpa || ""} placeholder="CGPA" className="rounded-md border border-gray-300 px-3 py-2" />
          <input name="skills" defaultValue={profile?.skills || ""} placeholder="Skills" className="rounded-md border border-gray-300 px-3 py-2 sm:col-span-2" />
          <input name="resumeUrl" defaultValue={profile?.resume_url || ""} placeholder="Resume URL" className="rounded-md border border-gray-300 px-3 py-2 sm:col-span-2" />
          <textarea name="bio" defaultValue={profile?.bio || ""} placeholder="Bio" rows={4} className="rounded-md border border-gray-300 px-3 py-2 sm:col-span-2" />
          <button className="rounded-md bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 sm:w-fit">
            Save Profile
          </button>
        </form>
      </section>
    </main>
  );
}
