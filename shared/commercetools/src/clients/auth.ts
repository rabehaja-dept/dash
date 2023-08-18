import SdkAuth from "@commercetools/sdk-auth";

export const createAuthClient = (
  COMMERCETOOLS_PROJECT_KEY: string,
  COMMERCETOOLS_AUTH_URL: string,
  COMMERCETOOLS_CLIENT_ID: string,
  COMMERCETOOLS_SECRET: string,
  COMMERCETOOLS_SCOPES: string
) => {
  return new SdkAuth({
    host: COMMERCETOOLS_AUTH_URL,
    projectKey: COMMERCETOOLS_PROJECT_KEY,
    credentials: {
      clientId: COMMERCETOOLS_CLIENT_ID,
      clientSecret: COMMERCETOOLS_SECRET,
    },
    scopes: COMMERCETOOLS_SCOPES ? COMMERCETOOLS_SCOPES.split(" ") : [],
    fetch,
    enableRetry: true,
    retryConfig: {
      maxRetries: 50,
      retryDelay: 200,
      backoff: true,
      maxDelay: 5000,
      retryOnAbort: true,
      retryCodes: [500, 501, 502, 503, 504, "ETIMEDOUT", "ECONNREFUSED"],
    },
  });
};
