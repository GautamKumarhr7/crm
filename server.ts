import dotenv from "dotenv";
dotenv.config();

import Express from "express";
import { SERVER_MESSAGES } from "./constant/server.constant";
import { db } from "./db/connection";
import indexRouter from "./routes/index.routes";

const app = Express();
app.use(Express.json());

const dbcheck = async () => {
  try {
    const result = await db.$client.connect();
    console.log(SERVER_MESSAGES.DB_CONNECTION_SUCCESS);
    result.release();
  } catch (err) {
    console.error(SERVER_MESSAGES.DB_CONNECTION_FAILED, err);
  }
};

const port = process.env.PORT;
app.get("/", (req, res) => {
  res.send(SERVER_MESSAGES.ROOT_HEALTH_RESPONSE);
});

app.use(indexRouter);

app.listen(port, () => {
  console.log(SERVER_MESSAGES.LOCALHOST_PREFIX + port);
});
dbcheck();
