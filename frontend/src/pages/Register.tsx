import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRedirectByRole } from "../hooks/useRedirectByRole";
import { UserRole } from "../utils/types";

export default function Register() {
  const { register } = useAuth();
  const redirectByRole = useRedirectByRole();
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);

    try {
      const user = await register(
        String(form.get("name")),
        String(form.get("email")),
        String(form.get("password")),
        String(form.get("role")) as UserRole
      );
      redirectByRole(user.role);
    } catch {
      setError("Registration failed. Try another email.");
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-950">Register</h1>
        {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Name
            <input name="name" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Email
            <input name="email" type="email" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Password
            <input name="password" type="password" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Role
            <select name="role" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2">
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <button className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
            Create Account
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Already registered? <Link className="font-semibold text-blue-700" to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
}
