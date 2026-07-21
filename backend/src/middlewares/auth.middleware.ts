import type { Context, Next } from "hono";
import { verifyToken } from "../utils/jwt";
import type { AppVariables } from "../types";

export async function authMiddleware(
  c: Context<{ Variables: AppVariables }>,
  next: Next,
) {
  const authHeader = c.req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Missing or malformed Authorization header" }, 401);
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyToken(token);
    c.set("user", payload);
    await next();
  } catch {
    return c.json({ error: "Invalid or expired token" }, 401);
  }
}
