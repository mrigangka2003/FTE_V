"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  TrendingDown,
  TrendingUp,
  Search,
  LogOut,
  Clock,
  Zap,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  BarChart3,
  CreditCard,
} from "lucide-react";
import {
  getTransactions,
  createTransaction,
  Transaction as Tx,
} from "@/services/transaction.services";
import { getToken, logout } from "@/services/auth.services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

const SAMPLES = [
  "Date: 11 Dec 2025\nDescription: STARBUCKS COFFEE MUMBAI\nAmount: -420.00\nBalance after transaction: 18,420.50",
  "Uber Ride * Airport Drop\n12/11/2025 → ₹1,250.00 debited\nAvailable Balance → ₹17,170.50",
  "txn123 2025-12-10 Amazon.in Order #403-1234567-8901234 ₹2,999.00 Dr Bal 14171.50 Shopping",
  "Salary Credit - TechCorp Pvt Ltd\nAmount: +125,000.00\nDate: 01 Dec 2025\nBalance: 1,39,171.50",
];

const DUMMY_TRANSACTIONS: Tx[] = [
  {
    id: "dummy-1",
    description: "STARBUCKS COFFEE MUMBAI",
    amount: -420,
    balance: 18420.5,
    date: new Date().toISOString(),
    confidence: 0.98,
  },
  {
    id: "dummy-2",
    description: "Uber Ride * Airport Drop",
    amount: -1250,
    balance: 17170.5,
    date: new Date(Date.now() - 86400000).toISOString(),
    confidence: 0.95,
  },
  {
    id: "dummy-3",
    description: "Amazon.in Order #403-1234567-8901234",
    amount: -2999,
    balance: 14171.5,
    date: new Date(Date.now() - 172800000).toISOString(),
    confidence: 0.99,
  },
  {
    id: "dummy-4",
    description: "Salary Credit - TechCorp Pvt Ltd",
    amount: 125000,
    balance: 139171.5,
    date: new Date(Date.now() - 432000000).toISOString(),
    confidence: 1.0,
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [text, setText] = useState("");
  const [txs, setTxs] = useState<Tx[]>(DUMMY_TRANSACTIONS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [filter, setFilter] = useState<"all" | "debit" | "credit">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    setTimeout(() => setIsAuthenticated(true), 0);

    let isMounted = true;
    async function loadData() {
      try {
        const data = await getTransactions(50);
        if (isMounted) {
          if (data && data.length > 0) {
            setTxs(data);
          } else {
            setTxs([]);
          }
        }
      } catch {
        if (isMounted) {
          setTxs([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleSave() {
    if (!text.trim()) return;
    setSaving(true);
    setMessage(null);
    try {
      const newTx = await createTransaction(text);
      setTxs((prev) => [newTx, ...prev]);
      setText("");
      setMessage({ text: "Transaction successfully parsed and saved!", type: "success" });
    } catch (e) {
      setMessage({
        text: e instanceof Error ? e.message : "Failed to extract transaction details",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  const handleSignOut = () => {
    logout();
    router.replace("/login");
  };

  // Filtered transactions computation
  const filteredTxs = txs.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === "debit") return matchesSearch && t.amount < 0;
    if (filter === "credit") return matchesSearch && t.amount >= 0;
    return matchesSearch;
  });

  // Calculate totals
  const totalIncome = txs.filter((t) => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = txs.filter((t) => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
  const netBalance = totalIncome - totalExpenses;
  const avgConfidence = txs.length
    ? Math.round((txs.reduce((acc, t) => acc + (t.confidence ?? 1), 0) / txs.length) * 100)
    : 100;

  if (isAuthenticated === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <span>Authenticating private workspace...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-indigo-600 selection:text-white">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 rounded-full bg-indigo-600/10 blur-[130px]" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-violet-600/10 blur-[130px]" />

      {/* Header Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#09090b]/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold shadow-lg shadow-indigo-500/20">
              L
            </div>
            <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-lg">Ledgerly</span>
          </Link>

          <div className="flex items-center gap-3">
            <Badge variant="glass" className="gap-1.5 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              Private Workspace
            </Badge>

            <ThemeToggle />

            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 space-y-10">
        {/* Workspace Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Badge variant="default" className="mb-2 uppercase tracking-widest text-[10px]">
              FINANCIAL COMMAND CENTER
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Workspace Ledger
            </h1>
            <p className="mt-2 text-slate-800 dark:text-slate-200 font-medium">
              Real-time transaction extraction, balance tracking, and ledger records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="glass-panel rounded-2xl px-5 py-3 border border-slate-300 bg-white dark:border-zinc-800 dark:bg-zinc-900 text-right shadow-sm">
              <p className="text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold">Parser Confidence Index</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{avgConfidence}%</p>
            </div>
          </div>
        </div>

        {/* Financial Summary Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Income"
            amount={`+₹${totalIncome.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
            icon={<TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
          />
          <StatCard
            title="Total Expenses"
            amount={`-₹${totalExpenses.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
            icon={<TrendingDown className="h-5 w-5 text-rose-600 dark:text-rose-400" />}
          />
          <StatCard
            title="Net Cash Flow"
            amount={`${netBalance >= 0 ? "+" : "−"}₹${Math.abs(netBalance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
            icon={<BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}
          />
          <StatCard
            title="Total Transactions"
            amount={txs.length.toString()}
            icon={<CreditCard className="h-5 w-5 text-violet-600 dark:text-violet-400" />}
          />
        </div>

        {/* Interactive Transaction Parser Section */}
        <section className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-200/80 dark:border-white/10 relative overflow-hidden glow-blue">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 dark:bg-indigo-600/20 dark:border-indigo-500/30 dark:text-indigo-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Extract New Transaction</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Paste bank statement text, SMS, or email receipt below</p>
              </div>
            </div>
            <Badge variant="glass" className="hidden sm:inline-flex">REGEX AI ENGINE v2.4</Badge>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. STARBUCKS COFFEE MUMBAI Date: 11 Dec 2025 Amount: -420.00 Balance after transaction: 18,420.50"
            className="w-full min-h-[130px] rounded-2xl border border-slate-200 bg-white p-4 text-sm font-mono leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-indigo-200 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400 outline-none transition-all resize-none shadow-inner"
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            {/* Quick sample chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">Quick samples:</span>
              {SAMPLES.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setText(s)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-100/80 hover:bg-slate-200/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Sample {idx + 1}
                </button>
              ))}
            </div>

            <Button
              variant="gradient"
              onClick={handleSave}
              disabled={saving || !text.trim()}
              className="gap-2 px-6 py-3"
            >
              {saving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Parsing...
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" /> Parse & Save to Ledger
                </>
              )}
            </Button>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 rounded-xl p-3 text-xs font-semibold flex items-center gap-2 ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                  : "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {message.text}
            </motion.div>
          )}
        </section>

        {/* Transactions Table Section */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Parsed Transactions</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">All recorded transactions sorted by recency</p>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Search description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/90 pl-10 pr-4 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex rounded-xl border border-slate-200 bg-slate-100/80 dark:border-zinc-800 dark:bg-zinc-900/90 p-1">
                {(["all", "debit", "credit"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      filter === f
                        ? "bg-indigo-600 text-white shadow"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="glass-panel rounded-3xl border border-slate-300 bg-white dark:border-zinc-800 dark:bg-zinc-900/90 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-300 bg-slate-100 dark:border-zinc-800 dark:bg-zinc-950 text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  <tr>
                    <th className= "px-6 py-4 text-white">Transaction Description</th>
                    <th className="px-6 py-4 text-white">Parsed Date</th>
                    <th className="px-6 py-4 text-right text-white">Amount</th>
                    <th className="px-6 py-4 text-right text-white">Ending Balance</th>
                    <th className="hidden px-6 py-4 text-center sm:table-cell">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-zinc-800/60">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center text-slate-700 dark:text-slate-300">
                        <div className="flex justify-center items-center gap-3">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                          <span>Loading private ledger transactions...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredTxs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center text-slate-700 dark:text-slate-300">
                        No transactions found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    <AnimatePresence>
                      {filteredTxs.map((t, idx) => (
                        <motion.tr
                          key={t.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: idx * 0.03 }}
                          className="hover:bg-slate-100/80 dark:hover:bg-zinc-800/50 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`grid h-8 w-8 place-items-center rounded-xl font-bold text-xs ${
                                  t.amount < 0
                                    ? "bg-rose-100 text-rose-800 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
                                    : "bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                                }`}
                              >
                                {t.amount < 0 ? "Dr" : "Cr"}
                              </div>
                              <span className="font-bold text-slate-900 dark:text-white transition-colors">
                                {t.description}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-xs text-slate-700 dark:text-slate-300 font-medium">
                            <div className="flex items-center gap-1.5 font-mono">
                              <Clock className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                              {new Date(t.date).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                          </td>

                          <td
                            className={`px-6 py-4 text-right font-extrabold font-mono ${
                              t.amount < 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            {t.amount < 0 ? "−" : "+"}₹
                            {Math.abs(t.amount).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                            })}
                          </td>

                          <td className="px-6 py-4 text-right font-semibold font-mono text-slate-900 dark:text-white">
                            {t.balance !== null && t.balance !== undefined
                              ? `₹${t.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
                              : "—"}
                          </td>

                          <td className="hidden px-6 py-4 text-center sm:table-cell">
                            <Badge
                              variant={
                                (t.confidence ?? 1) >= 0.95 ? "success" : "default"
                              }
                              className="gap-1 text-[10px]"
                            >
                              <Zap className="h-3 w-3" />
                              {Math.round((t.confidence ?? 1) * 100)}%
                            </Badge>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  title,
  amount,
  icon,
}: {
  title: string;
  amount: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-6 border border-slate-300 bg-white dark:border-zinc-800 dark:bg-zinc-900 relative overflow-hidden shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold">{title}</span>
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 border border-slate-200 dark:bg-white/5 dark:border-white/10">
          {icon}
        </div>
      </div>
      <p className="mt-4 text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">{amount}</p>
    </div>
  );
}
