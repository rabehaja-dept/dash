import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";
import { handler } from "~/commercetools/adyen/handler";

export const action = async ({ request }: ActionArgs) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }
  const payload = await request.json();

  await handler(payload);

  return {
    statusCode: 200,
    body: "[accepted]",
  };
};
