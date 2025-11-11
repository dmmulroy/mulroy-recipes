import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";

const adapter = drizzleAdapter(db, {
  provider: "sqlite",
  usePlural: true,
  debugLogs: true,
});

export const auth = betterAuth({
  database: adapter,
  plugins: [username()],
});
