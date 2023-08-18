import { v4 as uuid } from "uuid";
import { createCookie } from "@remix-run/node";

const OPTIMIZELY_USER_ID = "optimizelyUserId";

export const getOptimizelyUserId = async (request: Request) => {
  const c = createCookie(OPTIMIZELY_USER_ID);
  let id = await c.parse(request.headers.get("Cookie"));

  if (!id) {
    id = uuid();
  }

  const cookie = await c.serialize(OPTIMIZELY_USER_ID, id);

  return { id, cookie };
};
