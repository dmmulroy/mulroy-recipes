import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./.drizzle",
  schema: "./schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: "../../../.wrangler/state/v3/d1/miniflare-D1DatabaseObject/836352da0eb61a8d9cc1bec9986ab2c39febbd7245cd82b799745aa7488ed14d.sqlite",
  },
});
