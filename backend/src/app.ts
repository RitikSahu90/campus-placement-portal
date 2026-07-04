import cors from "cors";
import express from "express";
import { env } from "./config/env";
import adminRoutes from "./routes/admin.routes";
import applicationRoutes from "./routes/application.routes";
import authRoutes from "./routes/auth.routes";
import jobRoutes from "./routes/job.routes";
import profileRoutes from "./routes/profile.routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Campus Placement Portal API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api", adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
