import type { Context } from "hono";
import { registerUser, loginUser } from "./auth.service.js";

export async function register(c: Context) {
  const body = await c.req.json();
  const { email, password, organizationName } = body;

  if (!email || !password || !organizationName) {
    return c.json(
      { error: "email, password, and organizationName are required" },
      400,
    );
  }
  if (password.length < 8) {
    return c.json({ error: "Password must be at least 8 characters" }, 400);
  }

  try {
    const result = await registerUser({ email, password, organizationName });
    return c.json(result, 201);
  } catch (err) {
    if (err instanceof Error && err.message === "EMAIL_TAKEN") {
      return c.json({ error: "Email already registered" }, 409);
    }
    throw err;
  }
}

export async function login(c: Context) {
  const body = await c.req.json();
  const { email, password } = body;

  if (!email || !password) {
    return c.json({ error: "email and password are required" }, 400);
  }

  try {
    const result = await loginUser({ email, password });
    return c.json(result, 200);
  } catch (err) {
    if (err instanceof Error && err.message === "INVALID_CREDENTIALS") {
      return c.json({ error: "Invalid email or password" }, 401);
    }
    throw err;
  }
}
