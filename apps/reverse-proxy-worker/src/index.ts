export default {
  async fetch(
    request: Request,
    env: Cloudflare.Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);

    // Route /sync requests to sync worker
    if (url.pathname.startsWith("/sync")) {
      return env.SYNC_WORKER.fetch(request);
    }

    // Route everything else to tanstack worker
    return env.TANSTACK_WORKER.fetch(request);
  },
};
