import { createAuthClient } from "@deptdash/commercetools";

export const authClient = createAuthClient(
  process.env.COMMERCETOOLS_PROJECT_KEY,
  process.env.COMMERCETOOLS_AUTH_URL,
  process.env.COMMERCETOOLS_CLIENT_ID,
  process.env.COMMERCETOOLS_SECRET,
  process.env.COMMERCETOOLS_SCOPES
);
