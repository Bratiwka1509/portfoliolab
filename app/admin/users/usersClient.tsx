"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  bannedAt: string | null;
  createdAt: string;
  _count: { submissions: number; likes: number; comments: number };
};

export default function UsersClient() {
  const { data: session } = useSession();
  const myRole = (session?.user as unknown as { role?: string } | undefined)?.role;

  const [q, setQ] = useState("");
  const [items, setItems] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/users");
    if (!res.ok) throw new Error("forbidden");
    return (await res.json()) as UserRow[];
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await load();
        if (!cancelled) {
          setItems(data);
          setError(null);
        }
      } catch {
        if (!cancelled) setError("Forbidden.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((u) => u.email.toLowerCase().includes(s) || (u.name ?? "").toLowerCase().includes(s));
  }, [items, q]);

  async function setBan(id: string, banned: boolean) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ banned }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { id: string; bannedAt: string | null };
    setItems((prev) => prev.map((u) => (u.id === id ? { ...u, bannedAt: data.bannedAt } : u)));
    return true;
  }

  async function setRole(id: string, role: "USER" | "ADMIN") {
    const res = await fetch(`/api/superadmin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { id: string; role: UserRow["role"] };
    setItems((prev) => prev.map((u) => (u.id === id ? { ...u, role: data.role } : u)));
    return true;
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin — Users</h1>
            <p className="text-sm text-gray-400 mt-1">Ban/unban and manage roles.</p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 rounded-md border border-zinc-700 hover:border-red-600 transition text-sm"
          >
            Back to submissions
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search email or name…"
            className="w-full sm:max-w-md bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-md text-sm"
          />
          <div className="text-xs text-gray-500">Total: {filtered.length}</div>
        </div>

        {error && (
          <div className="border border-red-900/40 bg-red-950/30 text-red-300 rounded-xl p-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-gray-400">Loading…</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((u) => (
              <div key={u.id} className="border border-zinc-800 rounded-2xl bg-zinc-950 p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <div className="font-semibold">
                      {u.name ? `${u.name} · ` : ""}
                      <span className="text-gray-300">{u.email}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Role: <span className="text-gray-300">{u.role}</span> ·{" "}
                      Created: {new Date(u.createdAt).toLocaleDateString()} ·{" "}
                      Subs: {u._count.submissions} · Likes: {u._count.likes} · Comments: {u._count.comments}
                    </div>
                    {u.bannedAt && (
                      <div className="text-xs text-red-300 mt-1">
                        BANNED: {new Date(u.bannedAt).toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {u.bannedAt ? (
                      <button
                        onClick={() => setBan(u.id, false)}
                        className="px-3 py-2 rounded-md border border-zinc-700 hover:border-red-600 transition text-sm"
                      >
                        Unban
                      </button>
                    ) : (
                      <button
                        onClick={() => setBan(u.id, true)}
                        className="px-3 py-2 rounded-md bg-red-700/30 border border-red-700 hover:bg-red-700/40 transition text-sm"
                      >
                        Ban
                      </button>
                    )}

                    {myRole === "SUPERADMIN" && u.role !== "SUPERADMIN" && (
                      <select
                        value={u.role === "ADMIN" ? "ADMIN" : "USER"}
                        onChange={(e) => setRole(u.id, e.target.value as "USER" | "ADMIN")}
                        className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-md text-sm"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

