import { createCommercetoolsClient } from "@deptdash/commercetools";

export const requestBuilder = createCommercetoolsClient(
  process.env.COMMERCETOOLS_PROJECT_KEY,
  process.env.COMMERCETOOLS_CLIENT_ID,
  process.env.COMMERCETOOLS_SECRET,
  process.env.COMMERCETOOLS_SCOPES,
  process.env.COMMERCETOOLS_API_URL,
  process.env.COMMERCETOOLS_AUTH_URL
);
