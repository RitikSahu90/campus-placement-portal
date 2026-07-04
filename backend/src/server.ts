import app from "./app";
import { env } from "./config/env";
import { testConnection } from "./database/connection";

async function startServer() {
  try {
    await testConnection();
    app.listen(env.port, () => {
      console.log(`API server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();
