import { prisma } from "../lib/prisma.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signToken as signToken } from "../utils/jwt.js";

export async function registerUser({ email, password, organizationName }: any) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("EMAIL_TAKEN");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.$transaction(async (tx: any) => {
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

export async function loginUser({ email, password }: any) {
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
