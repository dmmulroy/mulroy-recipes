// import { betterAuth, type BetterAuthOptions } from "better-auth";
// import {
//   withCloudflare,
//   type WithCloudflareOptions,
// } from "better-auth-cloudflare";
// import { drizzleAdapter } from "better-auth/adapters/drizzle";
// import { drizzle } from "drizzle-orm/d1";
// import Database from "better-sqlite3";

// function createAuth(env: Cloudflare.Env, cf: IncomingRequestCfProperties) {
//   return betterAuth(
//     withCloudflare(
//       {
//         cf,
//         d1: {
//           db: drizzle(env.DB, { logger: true }),
//           options: {
//             usePlural: true,
//             debugLogs: true,
//           },
//         },
//       },
//       {},
//     ),
//   );
// }

// function createCliAuth() {
//   debugger;
//   return betterAuth({
//     database: new Database(":memory:"),
//   });
// }
// drizzleAdapter(new Database(":memory:"), {
//       provider: "sqlite",
//       usePlural: true,
//       debugLogs: true,
//     }),

import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
export const auth = betterAuth({
  database: new Database("./sqlite.db"),
});
