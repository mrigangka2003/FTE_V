import type { Context } from "hono";
import { Prisma } from "@prisma/client";

export function errorHandler(err: Error, c: Context) {
  console.error(err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return c.json({ error: "A record with this value already exists" }, 409);
    }
    if (err.code === "P2025") {
      return c.json({ error: "Record not found" }, 404);
    }
  }

  return c.json({ error: "Internal server error" }, 500);
}
