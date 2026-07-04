import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRedirectByRole } from "../hooks/useRedirectByRole";

export default function Login() {
  const { login } = useAuth();
  const redirectByRole = useRedirectByRole();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);

    try {
      const user = await login(String(form.get("email")), String(form.get("password")));
      redirectByRole(user.role);
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-950">Login</h1>
        <p className="mt-2 text-sm text-gray-600">Use seeded accounts with password Password@123.</p>
        {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
            <input name="email" type="email" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Password
            <input name="password" type="password" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
          </label>
          <button disabled={loading} className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          New here? <Link className="font-semibold text-blue-700" to="/register">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
