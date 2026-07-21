import { Hono } from "hono";
import authRoutes from "./auth.routes";
// import transactionRoutes from "./transaction.routes";
import { authMiddleware } from "../middlewares/auth.middleware";
import type { AppVariables } from "../types";

const routes = new Hono<{ Variables: AppVariables }>();

routes.route("/auth", authRoutes);
routes.use("/transactions/*", authMiddleware);
// routes.route("/transactions", transactionRoutes);

export default routes;
