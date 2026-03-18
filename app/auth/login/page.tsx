"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/submit";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    setLoading(false);

    if (!res || res.error) {
      setError("Wrong email or password.");
      return;
    }

    router.push(res.url ?? callbackUrl);
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-md mx-auto border border-red-900/40 rounded-2xl p-6 bg-black/40 space-y-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Log in</h1>
          <p className="text-sm text-gray-400">
            Use the account you created to submit portfolios.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded px-4 py-2 text-white focus:outline-none focus:border-red-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded px-4 py-2 text-white focus:outline-none focus:border-red-700"
            />
          </div>

          {error && (
            <div className="text-sm text-red-400 border border-red-900/40 bg-red-950/30 rounded p-3">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full mt-2 bg-red-600 hover:bg-red-500 transition rounded-xl py-3 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-sm text-gray-400">
          No account?{" "}
          <Link className="text-red-400 hover:text-red-300" href="/auth/register">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}

