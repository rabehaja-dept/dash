import { json } from "@remix-run/node";
import { getEnv } from "~/config";

const COMMERCETOOLS_HTTP_EXTENSION_SECRET = getEnv(
  "COMMERCETOOLS_HTTP_EXTENSION_SECRET",
  // Feel free to change this default value to something more appropriate
  { default: "boogie-woogie" }
);

export function verifyWebhookRequest(request: Request) {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }
  if (
    request.headers.get("Authorization") !== COMMERCETOOLS_HTTP_EXTENSION_SECRET
  ) {
    return json({ message: "Unauthorized" }, 401);
  }

  return;
}
