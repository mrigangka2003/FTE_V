import { getApiUrl, getToken } from "./auth.services";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  balance?: number;
  date: string;
  confidence?: number;
}

export interface GetTransactionsResponse {
  transactions?: Transaction[];
  data?: Transaction[];
}

export interface CreateTransactionPayload {
  rawText: string;
}

export interface CreateTransactionResponse {
  transaction?: Transaction;
  id?: string;
  description?: string;
  amount?: number;
  date?: string;
  confidence?: number;
  [key: string]: unknown;
}

export async function getTransactions(limit: number = 20): Promise<Transaction[]> {
  const apiUrl = getApiUrl();
  const token = getToken();

  const response = await fetch(`${apiUrl}/api/transactions?limit=${limit}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  const data: GetTransactionsResponse = await response.json();
  return data.transactions || data.data || [];
}

export async function createTransaction(rawText: string): Promise<Transaction> {
  const apiUrl = getApiUrl();
  const token = getToken();

  const response = await fetch(`${apiUrl}/api/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({ rawText }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Could not parse this transaction");
  }

  const data: CreateTransactionResponse = await response.json();
  const transaction = data.transaction || (data as Transaction);
  return transaction;
}
