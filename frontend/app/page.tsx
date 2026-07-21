"use client";
import { useState } from "react";
import Link from "next/link";
import { getToken } from "@/services/auth.services";

function Landing() {
  const [token] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return getToken();
    }
    return null;
  });

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fafc]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#3155d9] text-white">L</span> ledgerly
        </Link>
        <div className="flex items-center gap-3">
          {token ? (
            <Link href="/dashboard" className="rounded-full bg-[#3155d9] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-[#2646c5]">
              Go to Dashboard <span className="ml-1">→</span>
            </Link>
          ) : (
            <>
              <Link href="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-white">Log in</Link>
              <Link href="/register" className="rounded-full bg-[#10233f] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:bg-[#1b355a]">
                Create account <span className="ml-1">↗</span>
              </Link>
            </>
          )}
        </div>
      </nav>
      <section className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-10 lg:pt-24">
        <div className="pointer-events-none absolute -right-24 top-6 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="relative max-w-3xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-[#3155d9]">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> your money, made legible
          </div>
          <h1 className="max-w-3xl text-5xl font-bold leading-[1.04] tracking-[-.05em] text-[#10233f] sm:text-7xl">
            From messy text to <span className="text-[#3155d9]">money clarity.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-500">
            Ledgerly turns bank statement snippets into a clean, private transaction timeline — in seconds, not spreadsheets.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href={token ? "/dashboard" : "/register"} className="rounded-xl bg-[#3155d9] px-6 py-3.5 font-semibold text-white shadow-xl shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:bg-[#2646c5]">
              {token ? "Open Dashboard" : "Start organizing free"} <span className="ml-2">→</span>
            </Link>
            <a href="#how" className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-600 hover:border-slate-300">
              See how it works
            </a>
          </div>
        </div>
        <div className="relative mt-20 grid gap-5 sm:grid-cols-3">
          <Feature icon="⌁" title="Paste anything" text="Email alerts, SMS, or bank exports. No rigid format required." />
          <Feature icon="✦" title="Parse with confidence" text="Structured fields and a confidence score, at a glance." />
          <Feature icon="◌" title="Private by default" text="Your workspace is isolated and accessible only to you." />
        </div>
      </section>
      <section id="how" className="border-t border-slate-200 bg-white px-6 py-16 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[.8fr_1.2fr] md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.16em] text-[#3155d9]">A calmer way to track</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Your financial inbox, finally organized.</h2>
            <p className="mt-4 max-w-md leading-7 text-slate-500">No categories to configure. No CSV clean-up. Just paste what you have and Ledgerly does the quiet work.</p>
          </div>
          <div className="rounded-3xl bg-[#10233f] p-6 text-white shadow-2xl shadow-slate-900/10">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm text-slate-300">Sample extraction</span>
              <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">98% confidence</span>
            </div>
            <p className="font-mono text-sm leading-7 text-slate-300">
              Amazon.in Order #403-1234567<br />
              <span className="text-white">₹2,999.00</span> <span className="text-rose-300">debit</span><br />
              Balance <span className="text-white">₹14,171.50</span>
            </p>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[98%] rounded-full bg-emerald-400" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-5 grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-xl text-[#3155d9]">{icon}</div>
      <h3 className="font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}

export default function Home() {
  return <Landing />;
}
