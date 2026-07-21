import { Hono } from "hono";
import authRoutes from "./auth.routes";
import transactionRoutes from "./transaction.routes";
import type { AppVariables } from "../types";

const routes = new Hono<{ Variables: AppVariables }>();

routes.route("/auth", authRoutes);
routes.route("/transactions", transactionRoutes);

export default routes;
