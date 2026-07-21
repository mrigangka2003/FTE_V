import type { Context } from "hono";
import { prisma } from "../lib/prisma";
import type { AppVariables } from "../types";

const amountOf = (text: string) => { const m = text.match(/(?:₹|INR\s*)?([\d,]+(?:\.\d{1,2})?)/); return m ? Number(m[1].replace(/,/g, "")) : null; };
const dateOf = (text: string) => { const v = text.match(/(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})/)?.[1]; const d = v ? new Date(v) : new Date(); return Number.isNaN(d.getTime()) ? new Date() : d; };

export async function extractTransaction(c: Context<{ Variables: AppVariables }>) { 
  const { text } = await c.req.json<{ text?: string }>(); 
  
  if (!text?.trim()) return c.json({ error: "text is required" }, 400); 

  const amount = amountOf(text);

  if (amount === null) return c.json({ error: "Could not find a transaction amount" }, 422); 
  
  const user = c.get("user"); 
  const debit = /debit|\bdr\b|amount:\s*-/i.test(text); 
  const balance = text.match(/(?:balance|bal)[^\d₹]*₹?\s*([\d,]+(?:\.\d{1,2})?)/i); 
  const description = text.match(/description:\s*(.+)/i)?.[1]?.trim() ?? text.split(/\r?\n/).find((x) => x.trim() && !/date:|amount:|balance|available/i.test(x))?.trim() ?? "Transaction"; 
  
  const transaction = await prisma.transaction.create({ data: { rawText: text, description, amount: debit ? -amount : amount, balance: balance ? Number(balance[1].replace(/,/g, "")) : null, date: dateOf(text), confidence: balance ? 0.98 : 0.86, userId: user.userId, organizationId: user.organizationId } }); 
  
  return c.json({ transaction }, 201); 
}

export async function listTransactions(c: Context<{ Variables: AppVariables }>) { const user = c.get("user"); 
  const limit = Math.min(Math.max(Number(c.req.query("limit") ?? 20)  , 1), 100); 
  const cursor = c.req.query("cursor"); 
  
  const rows = await prisma.transaction.findMany({ where: { userId: user.userId, organizationId: user.organizationId }, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: limit + 1, ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}) }); 
  
  const hasMore = rows.length > limit; 
  const transactions = hasMore ? rows.slice(0, limit) : rows; 
  
  return c.json({ transactions, nextCursor: hasMore ? transactions[transactions.length - 1]?.id : null, hasMore }); 
}
