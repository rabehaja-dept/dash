import { rest } from "msw";
import { setupServer } from "msw/node";

const handlers = [
  rest.get("https://preview.contentful.com/*", (req) => req.passthrough()),
  rest.get("https://cdn.contentful.com/*", (req) => req.passthrough()),
  rest.get("https://cdn.optimizely.com/datafiles/*", (req) =>
    req.passthrough()
  ),
];
const server = setupServer(...handlers);

server.listen({ onUnhandledRequest: "warn" });
console.info("🔶 Mock server running");

process.once("SIGINT", () => server.close());
process.once("SIGTERM", () => server.close());
