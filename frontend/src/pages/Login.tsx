import { FormEvent, useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRedirectByRole } from "../hooks/useRedirectByRole";
import AuthLayout from "../components/AuthLayout";
import { Feedback } from "../components/UI";
import { errorMessage } from "../services/api";
export default function Login() {
  const { login } = useAuth();
  const redirect = useRedirectByRole();
  const [params] = useSearchParams();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [visible, setVisible] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const form = new FormData(event.currentTarget);
    try {
      const user = await login(
        String(form.get("email")),
        String(form.get("password")),
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
      <p className="eyebrow">Your next chapter awaits</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight">
        Welcome back.
      </h2>
      <p className="muted mb-6 mt-3">Sign in to pick up where you left off.</p>
      {params.has("expired") && (
        <div className="mb-4">
          <Feedback>Your session ended. Sign in to continue.</Feedback>
        </div>
      )}
      <Feedback>{error}</Feedback>
      <form className="mt-6 space-y-5" onSubmit={submit}>
        <label className="label">
          Email address
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@college.edu"
            className="field"
          />
        </label>
        <label className="label">
          Password
          <span className="relative block">
            <input
              name="password"
              type={visible ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="Your password"
              className="field pr-12"
            />
            <button
              type="button"
              aria-label={visible ? "Hide password" : "Show password"}
              className="absolute right-3 top-3 rounded p-1 text-[#859475]"
              onClick={() => setVisible(!visible)}
            >
              {visible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </span>
        </label>
        <button disabled={busy} className="btn-primary w-full">
          {busy ? "Signing in…" : "Sign in"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
      <p className="mt-6 text-sm text-[#5f6e57]">
        New to Campus?{" "}
        <Link to="/register" className="font-semibold text-[#375a27]">
          Create an account
        </Link>
      </p>
      <p className="hint mt-5 border-t border-[#e8eddf] pt-5">
        Your session stays in this browser tab and ends when you close it or
        sign out.
      </p>
    </AuthLayout>
  );
}
