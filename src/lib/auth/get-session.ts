import { createServerFn } from "@tanstack/react-start";
import { auth } from "./server";
import { getRequestHeaders } from "@tanstack/react-start/server";

export const getSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders();

    const result = await auth.api.getSession({
      headers,
    });

    if (result !== null && result.user !== null) {
      return {
        user: result.user,
      };
    }

    return null;
  },
);
