"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth.services";
import { ThemeToggle } from "@/components/theme-toggle";
import "../auth.css";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Pick up where you left off.">
      <form onSubmit={submit} className="space-y-5">
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" />
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
        {error && <p className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-sm font-medium text-rose-600 dark:text-rose-400">{error}</p>}
        <button disabled={loading} className="w-full rounded-xl bg-indigo-600 py-3.5 font-semibold text-white transition hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 disabled:opacity-60">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        New to Ledgerly? <Link className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline" href="/register">Create an account</Link>
      </p>
    </AuthShell>
  );
}

function Field(p: { label: string; type: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
      {p.label}
      <input required type={p.type} value={p.value} onChange={e => p.onChange(e.target.value)} placeholder={p.placeholder} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-400 dark:focus:border-indigo-400" />
    </label>
  );
}

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <main className="auth-bg flex min-h-screen items-center justify-center px-6 py-10 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <Link href="/" className="mx-auto mb-8 flex w-fit items-center gap-3 text-xl font-extrabold text-slate-900 dark:text-white">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-lg shadow-lg shadow-indigo-500/25">L</span> ledgerly
        </Link>
        <div className="rounded-3xl border border-slate-300 bg-white/95 p-8 shadow-2xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/95 dark:shadow-black/60">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
          <p className="mt-2 mb-8 text-sm text-slate-700 dark:text-slate-300 font-medium">{subtitle}</p>
          {children}
        </div>
      </div>
    </main>
  );
}
