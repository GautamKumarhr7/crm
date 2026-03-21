import dotenv from "dotenv";
dotenv.config();

import Express from "express";
import { HTTP_STATUS } from "./constant/http.constant";
import { SERVER_MESSAGES } from "./constant/server.constant";
import { pool } from "./db/connection";
import indexRouter from "./routes/index.routes";

const app = Express();
app.use(Express.json());

async function checkDatabaseHealth() {
  const startedAt = Date.now();

  try {
    await pool.query("select 1");

    return {
      status: "up" as const,
      latencyMs: Date.now() - startedAt,
    };
  } catch (error) {
    return {
      status: "down" as const,
      latencyMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : "Unknown database error",
    };
  }
}

const dbcheck = async () => {
  const dbStatus = await checkDatabaseHealth();

  if (dbStatus.status === "up") {
    console.log(SERVER_MESSAGES.DB_CONNECTION_SUCCESS);
    return;
  }

  console.error(SERVER_MESSAGES.DB_CONNECTION_FAILED, dbStatus.error);
};

const port = process.env.PORT;
app.get("/", (req, res) => {
  res.send(SERVER_MESSAGES.ROOT_HEALTH_RESPONSE);
});

app.get("/health", async (req, res) => {
  const database = await checkDatabaseHealth();
  const isHealthy = database.status === "up";

  return res
    .status(isHealthy ? HTTP_STATUS.OK : HTTP_STATUS.SERVICE_UNAVAILABLE)
    .json({
      status: isHealthy ? "ok" : "degraded",
      service: "crm-express",
      environment: process.env.NODE_ENV ?? "development",
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      database,
    });
});

app.use(indexRouter);

app.listen(port, () => {
  console.log(SERVER_MESSAGES.LOCALHOST_PREFIX + port);
});
dbcheck();
