"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Layers,
  ChevronRight,
  TrendingUp,
  FileText,
  Lock,
} from "lucide-react";
import { getToken } from "@/services/auth.services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

const emptySubscribe = () => () => {};
const getClientToken = () => getToken();
const getServerToken = () => null;

export default function Home() {
  const token = useSyncExternalStore(emptySubscribe, getClientToken, getServerToken);

  const [activeTab, setActiveTab] = useState<"sms" | "email" | "receipt">("sms");

  const sampleTexts = {
    sms: "Uber Ride * Airport Drop\n12/11/2025 → ₹1,250.00 debited\nAvailable Balance → ₹17,170.50",
    email: "Amazon.in Order #403-1234567\n₹2,999.00 debit\nBalance ₹14,171.50",
    receipt: "STARBUCKS COFFEE MUMBAI\nAmount: -420.00\nBalance after transaction: 18,420.50",
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-200 selection:bg-indigo-600 selection:text-white">
      {/* Background ambient glowing spheres */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-[140px] dark:bg-indigo-600/15" />
      <div className="pointer-events-none absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[150px] dark:bg-violet-600/10" />
      <div className="pointer-events-none absolute left-1/3 bottom-10 h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[160px] dark:bg-emerald-600/10" />

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#09090b]/80">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-lg shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
              L
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Ledgerly
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {token ? (
              <Link href="/dashboard">
                <Button variant="gradient" className="gap-2">
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button variant="gradient" className="gap-2">
                    Get Started Free <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-20 lg:px-8 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <Badge variant="default" className="mb-6 gap-2 px-4 py-1.5 text-xs uppercase tracking-widest font-bold">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400 animate-pulse" />
            AI-POWERED TRANSACTION ENGINE
          </Badge>

          {/* Headline */}
          <h1 className="max-w-5xl text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.02] text-slate-900 dark:text-white">
            Raw text into{" "}
            <span className="text-indigo-800 dark:text-indigo-600">
              financial clarity.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg sm:text-xl leading-relaxed text-slate-800 dark:text-slate-200 font-normal">
            Paste messy SMS alerts, email receipts, or bank statements. Ledgerly instantly parses dates, amounts, and balances into a clean private ledger.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href={token ? "/dashboard" : "/register"}>
              <Button variant="gradient" size="lg" className="h-14 px-8 text-base shadow-2xl shadow-indigo-600/30">
                {token ? "Open Dashboard" : "Start Organizing Free"}
                <ArrowRight className="h-5 w-5 ml-1" />
              </Button>
            </Link>
            <a href="#demo">
              <Button variant="glass" size="lg" className="h-14 px-8 text-base">
                See Live Extraction Demo
              </Button>
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="mt-10 flex flex-wrap justify-center items-center gap-8 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              100% Private Workspace
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Instant 98% Confidence Extraction
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              Zero Rigid CSV Formatting
            </div>
          </div>
        </motion.div>

        {/* Hero Visual Mockup Image */}
        <motion.div
          initial={{ opacity: 0.5, y: 40, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 0.95 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mt-16 rounded-3xl border border-slate-200/80 bg-white/60 p-3 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/60 glow-blue overflow-hidden"
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
            <Image
              src="/hero.png"
              alt="Ledgerly Dashboard Preview"
              fill
              priority
              className="object-cover"
            />
          </div>
        </motion.div>
      </section>

      {/* Interactive Extraction Demo Section */}
      <section id="demo" className="relative border-t border-slate-200/80 bg-slate-100/70 dark:border-white/10 dark:bg-[#09090b]/90 py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <Badge variant="glass" className="mb-4">HOW IT WORKS</Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Try the parser live right now
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Select an unformatted transaction snippet below to see how Ledgerly instantly extracts structured data.
            </p>
          </div>

          <div className="mt-12 grid lg:grid-cols-2 gap-8 items-center">
            {/* Input snippet selector */}
            <div className="glass-panel rounded-3xl p-8 border border-slate-200 dark:border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold">Input Raw Text Snippet</span>
                <div className="flex gap-2">
                  {(["sms", "email", "receipt"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setActiveTab(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        activeTab === type
                          ? "bg-indigo-600 text-white shadow"
                          : "bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                      }`}
                    >
                      {type.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative rounded-2xl border border-slate-300 bg-white p-5 font-mono text-sm leading-relaxed text-slate-900 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-white">
                <p className="whitespace-pre-wrap">{sampleTexts[activeTab]}</p>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                Auto-detected standard date, debit amount, and account balance.
              </div>
            </div>

            {/* Extracted Output Result Card */}
            <div className="glass-panel rounded-3xl p-8 border border-slate-200 bg-white dark:bg-zinc-900 dark:border-zinc-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <TrendingUp className="h-40 w-40 text-indigo-500 dark:text-indigo-400" />
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Extracted Parsed Record</span>
                </div>
                <Badge variant="success" className="gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> 98% Confidence
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-white/10">
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Merchant / Description</span>
                  <span className="font-bold text-slate-900 dark:text-white text-base">
                    {activeTab === "sms"
                      ? "Uber Ride * Airport Drop"
                      : activeTab === "email"
                      ? "Amazon.in Order #403-1234567"
                      : "STARBUCKS COFFEE MUMBAI"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-white/10">
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Extracted Amount</span>
                  <span className="font-extrabold font-mono text-rose-600 dark:text-rose-400 text-lg">
                    {activeTab === "sms" ? "- ₹1,250.00" : activeTab === "email" ? "- ₹2,999.00" : "- ₹420.00"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-white/10">
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Ending Balance</span>
                  <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 text-base">
                    {activeTab === "sms" ? "₹17,170.50" : activeTab === "email" ? "₹14,171.50" : "₹18,420.50"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Detected Date</span>
                  <span className="font-semibold text-slate-900 dark:text-white">12 Dec 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Features Grid */}
      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
            title="Paste Any Text Format"
            description="Copy transaction logs directly from SMS apps, emails, or bank PDF extracts without standardizing headers."
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
            title="Smart Debit/Credit Math"
            description="Automatic sign resolution identifies expenditures as negative flows and income deposits as positive credits."
          />
          <FeatureCard
            icon={<Layers className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
            title="Isolated Private Vault"
            description="Each user workspace operates in complete privacy with individual security boundaries and pagination."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-slate-50 dark:border-white/10 dark:bg-[#09090b] py-12 px-6 lg:px-8 text-center text-sm text-slate-500 dark:text-slate-400">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-indigo-600 text-white font-bold text-xs grid place-items-center">L</div>
            <span className="font-bold text-slate-800 dark:text-slate-200">Ledgerly Engine</span>
          </div>
          <p>© {new Date().getFullYear()} Ledgerly. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-8 border border-slate-200/80 dark:border-white/10 relative overflow-hidden group">
      <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 border border-indigo-200 dark:bg-indigo-500/10 dark:border-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{description}</p>
    </div>
  );
}
