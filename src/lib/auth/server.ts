import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema";
import { reactStartCookies } from "better-auth/react-start";

const adapter = drizzleAdapter(db, {
  provider: "sqlite",
  usePlural: true,
  schema,
});

export const auth = betterAuth({
  database: adapter,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [username(), reactStartCookies()],
});
