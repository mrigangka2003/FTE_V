import type { Context } from "hono";
import { prisma } from "../lib/prisma";
import { hashPassword, comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";

export interface RegisterPayload {
  email: string;
  password: string;
  organizationName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function registerUser({ email, password, organizationName }: RegisterPayload) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("EMAIL_TAKEN");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.$transaction(async (tx) => {
    const org = await tx.organization.create({
      data: { name: organizationName },
    });
    return tx.user.create({
      data: {
        email,
        password: hashedPassword,
        organizationId: org.id,
      },
    });
  });

  const token = signToken({ userId: user.id, email: user.email, organizationId: user.organizationId });
  return { token, user: { id: user.id, email: user.email, organizationId: user.organizationId } };
}

export async function loginUser({ email, password }: LoginPayload) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = signToken({ userId: user.id, email: user.email, organizationId: user.organizationId });
  return { token, user: { id: user.id, email: user.email, organizationId: user.organizationId } };
}

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
