"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getTransactions,
  createTransaction,
  Transaction as Tx,
} from "@/services/transaction.services";
import { getToken, logout } from "@/services/auth.services";

const samples = [
  "Date: 11 Dec 2025\nDescription: STARBUCKS COFFEE MUMBAI\nAmount: -420.00\nBalance after transaction: 18,420.50",
  "Uber Ride * Airport Drop\n12/11/2025 → ₹1,250.00 debited\nAvailable Balance → ₹17,170.50",
  "txn123 2025-12-10 Amazon.in Order #403-1234567-8901234 ₹2,999.00 Dr Bal 14171.50 Shopping",
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
  const [message, setMessage] = useState("");

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
        const data = await getTransactions(20);
        if (isMounted) {
          if (data && data.length > 0) {
            setTxs(data);
          } else {
            setTxs(DUMMY_TRANSACTIONS);
          }
        }
      } catch {
        if (isMounted) {
          setTxs(DUMMY_TRANSACTIONS);
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

  async function save() {
    if (!text.trim()) return;
    setSaving(true);
    setMessage("");
    try {
      const newTx = await createTransaction(text);
      setTxs((prev) => [newTx, ...prev]);
      setText("");
      setMessage("Saved to your private ledger");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  const handleSignOut = () => {
    logout();
    router.replace("/login");
  };

  if (isAuthenticated === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="text-slate-500">Authenticating...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <div className="flex items-center gap-2 text-xl font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#3155d9] text-white">
              L
            </span>{" "}
            ledgerly
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm font-semibold text-slate-500 hover:text-slate-900"
          >
            Sign out ↗
          </button>
        </div>
      </nav>
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.16em] text-[#3155d9]">
              Private workspace
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              Good morning.
            </h1>
            <p className="mt-2 text-slate-500">
              Turn your latest statement into a clean record.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-right">
            <p className="text-xs uppercase tracking-wider text-slate-400">
              Transactions parsed
            </p>
            <p className="mt-1 text-2xl font-bold">{txs.length}</p>
          </div>
        </div>
        <section className="rounded-3xl bg-[#10233f] p-6 text-white shadow-xl shadow-slate-900/10 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Parse a transaction</h2>
            <span className="text-xs font-semibold text-slate-400">
              Paste, review, save
            </span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste a bank alert, statement line, or email here…"
            className="mt-5 min-h-36 w-full resize-none rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-6 text-white outline-none placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-400/20"
          />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {samples.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setText(s)}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10"
                >
                  Try sample {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={save}
              disabled={saving || !text.trim()}
              className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#10233f] transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Parsing…" : "Parse & Save →"}
            </button>
          </div>
          {message && <p className="mt-4 text-sm text-emerald-300">{message}</p>}
        </section>
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Your transactions</h2>
              <p className="mt-1 text-sm text-slate-500">
                Only visible to you and your workspace.
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              ● Live
            </span>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-4">Description</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4 text-right">Amount</th>
                  <th className="hidden px-5 py-4 text-right sm:table-cell">
                    Confidence
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-12 text-center text-slate-400"
                    >
                      Loading your ledger…
                    </td>
                  </tr>
                ) : txs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-12 text-center text-slate-400"
                    >
                      No transactions yet — try a sample above.
                    </td>
                  </tr>
                ) : (
                  txs.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-semibold text-slate-700">
                        {t.description}
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {new Date(t.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td
                        className={`px-5 py-4 text-right font-bold ${
                          t.amount < 0 ? "text-rose-600" : "text-emerald-600"
                        }`}
                      >
                        {t.amount < 0 ? "−" : "+"}₹
                        {Math.abs(t.amount).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="hidden px-5 py-4 text-right text-slate-500 sm:table-cell">
                        {Math.round((t.confidence ?? 1) * 100)}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
