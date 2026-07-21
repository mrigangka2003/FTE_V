export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  organizationName: string;
}

export interface User {
  id: string;
  email: string;
  organizationId?: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
  accessToken?: string;
  error?: string;
}

export const TOKEN_KEY = "ledgerly_token";

export function getApiUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.VITE_NEXT_BACKEND_URL ||
    "http://localhost:8000"
  );
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function logout(): void {
  removeToken();
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Unable to sign in");
  }

  const token = data.token || data.accessToken;
  if (token) {
    setToken(token);
  }

  return data;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Unable to create account");
  }

  const token = data.token || data.accessToken;
  if (token) {
    setToken(token);
  }

  return data;
}
