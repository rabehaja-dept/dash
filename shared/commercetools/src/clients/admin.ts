import { ClientBuilder } from "@commercetools/sdk-client-v2";
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";

export const createCommercetoolsClient = (
  COMMERCETOOLS_PROJECT_KEY: string,
  COMMERCETOOLS_CLIENT_ID: string,
  COMMERCETOOLS_SECRET: string,
  COMMERCETOOLS_SCOPES: string | undefined,
  COMMERCETOOLS_API_URL: string,
  COMMERCETOOLS_AUTH_URL: string
) => {
  const client = new ClientBuilder()
    .withProjectKey(COMMERCETOOLS_PROJECT_KEY)
    .withClientCredentialsFlow({
      fetch,
      host: COMMERCETOOLS_AUTH_URL,
      projectKey: COMMERCETOOLS_PROJECT_KEY,
      credentials: {
        clientId: COMMERCETOOLS_CLIENT_ID,
        clientSecret: COMMERCETOOLS_SECRET,
      },
      ...(COMMERCETOOLS_SCOPES && { scopes: COMMERCETOOLS_SCOPES.split(" ") }),
    })
    .withHttpMiddleware({
      fetch,
      host: COMMERCETOOLS_API_URL,
      enableRetry: true,
      retryConfig: {
        maxRetries: 50,
        retryDelay: 200,
        backoff: true,
        maxDelay: 5000,
        retryOnAbort: true,
        retryCodes: [500, 501, 502, 503, 504, "ETIMEDOUT", "ECONNREFUSED"],
      },
    })
    .withUserAgentMiddleware()
    .build();

  const apiRoot = createApiBuilderFromCtpClient(client);

  return apiRoot.withProjectKey({
    projectKey: COMMERCETOOLS_PROJECT_KEY,
  });
};
