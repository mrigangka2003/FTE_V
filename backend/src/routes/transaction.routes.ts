import { Hono } from "hono";
import { extractTransaction, listTransactions } from "../services/transaction.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import type { AppVariables } from "../types";
const transactionRoutes = new Hono<{ Variables: AppVariables }>();

transactionRoutes.use("*", authMiddleware);

transactionRoutes.post("/extract", extractTransaction);

transactionRoutes.get("/", listTransactions);

export default transactionRoutes;
