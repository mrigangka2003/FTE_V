"use client";

import { useState } from "react"; 
import Link from "next/link"; 
import { useRouter } from "next/navigation"; 
import { login } from "@/services/auth.services";
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
        {error && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
        <button disabled={loading} className="w-full rounded-xl bg-[#3155d9] py-3.5 font-semibold text-white transition hover:bg-[#2646c5] disabled:opacity-60">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        New to Ledgerly? <Link className="font-semibold text-[#3155d9]" href="/register">Create an account</Link>
      </p>
    </AuthShell>
  );
}

function Field(p: { label: string; type: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {p.label}
      <input required type={p.type} value={p.value} onChange={e => p.onChange(e.target.value)} placeholder={p.placeholder} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none transition placeholder:text-slate-300 focus:border-[#3155d9] focus:ring-4 focus:ring-indigo-100" />
    </label>
  );
}

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <main className="auth-bg flex min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mx-auto mb-8 flex w-fit items-center gap-2 text-xl font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#3155d9] text-white">L</span> ledgerly
        </Link>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 mb-8 text-sm text-slate-500">{subtitle}</p>
          {children}
        </div>
      </div>
    </main>
  );
}
