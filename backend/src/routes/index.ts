import { Hono } from "hono";
import authRoutes from "./auth.routes.js";
// import transactionRoutes from "./transaction.routes.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import type { AppVariables } from "../types/index.js";

const routes = new Hono<{ Variables: AppVariables }>();

routes.route("/auth", authRoutes);
routes.use("/transactions/*", authMiddleware);
// routes.route("/transactions", transactionRoutes);

export default routes;
