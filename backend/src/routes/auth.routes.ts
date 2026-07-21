import { Hono } from "hono";
import { register, login } from "../services/auth.services.js";

const authRoutes = new Hono();

authRoutes.post("/register", register);
authRoutes.post("/login", login);

export default authRoutes;
