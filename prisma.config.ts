import path from "path";
import { config as dotenvConfig } from "dotenv";
import { defineConfig } from "@prisma/config";

// Load .env so DATABASE_URL is available when Prisma CLI runs
dotenvConfig({ path: path.resolve(__dirname, ".env") });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
  migrations: {
    path: "./prisma/migrations",
    seed: "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts",
  },
});
