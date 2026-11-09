import { FormEvent, useState } from "react";
import { ArrowRight, Building2, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRedirectByRole } from "../hooks/useRedirectByRole";
import AuthLayout from "../components/AuthLayout";
import { Feedback } from "../components/UI";
import { errorMessage } from "../services/api";
export default function Register() {
  const { register } = useAuth();
  const redirect = useRedirectByRole();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [role, setRole] = useState<"student" | "recruiter">("student");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    if (new TextEncoder().encode(password).length > 72) {
      setError("Use a password of no more than 72 UTF-8 bytes.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const user = await register(
        String(form.get("name")).trim(),
        String(form.get("email")).trim(),
        password,
        role,
      );
      redirect(user.role);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <AuthLayout>
      <p className="eyebrow">Start with possibility</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight">
        Your story starts here.
      </h2>
      <p className="muted mb-6 mt-3">Choose your side of the opportunity.</p>
      <fieldset disabled={busy} className="mb-6 grid grid-cols-2 gap-3">
        <legend className="sr-only">Account type</legend>
        {(
          [
            { value: "student", label: "I’m a student", icon: GraduationCap },
            { value: "recruiter", label: "I’m hiring", icon: Building2 },
          ] as const
        ).map(({ value, label, icon: Icon }) => (
          <label
            key={value}
            className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-xs font-medium ${role === value ? "border-[#8fa66c] bg-[#f1f6e8]" : "border-[#e0e6d8]"}`}
          >
            <input
              name="role"
              type="radio"
              value={value}
              checked={role === value}
              onChange={() => setRole(value)}
              className="accent-[#456b2e]"
            />
            <Icon className="h-4 w-4" />
            {label}
          </label>
        ))}
      </fieldset>
      <Feedback>{error}</Feedback>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <label className="label">
          Full name
          <input
            name="name"
            required
            maxLength={100}
            autoComplete="name"
            placeholder="Your full name"
            className="field"
          />
        </label>
        <label className="label">
          Email address
          <input
            name="email"
            type="email"
            required
            maxLength={150}
            autoComplete="email"
            placeholder="you@college.edu"
            className="field"
          />
        </label>
        <label className="label">
          Password
          <input
            name="password"
            type="password"
            required
            minLength={8}
            maxLength={72}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            className="field"
          />
          <span className="hint block">
            Use a unique password with a mix of words, numbers, or symbols.
          </span>
        </label>
        <button disabled={busy} className="btn-primary w-full">
          {busy ? "Creating your account…" : "Create my account"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
      <p className="mt-6 text-sm text-[#5f6e57]">
        Already part of Campus?{" "}
        <Link to="/login" className="font-semibold text-[#375a27]">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
