import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";

let server;

async function start() {
  await connectDatabase();
  server = app.listen(env.PORT, () => {
    console.log(`CartIQ API listening on port ${env.PORT}`);
  });
}

async function shutdown(signal) {
  console.log(`${signal} received; shutting down CartIQ API`);
  if (server) {
    server.close(async () => {
      const mongoose = await import("mongoose");
      await mongoose.default.connection.close();
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

start().catch((error) => {
  console.error("Failed to start CartIQ API:", error);
  process.exit(1);
});
