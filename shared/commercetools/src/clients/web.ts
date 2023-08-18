// @ts-ignore
import { ClientBuilder } from "@commercetools/sdk-client-v2";
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";

export async function getWebRequestBuilder({
  projectKey,
  apiUrl,
  authUrl,
  clientId,
  clientSecret,
  scopes,
  tokenData,
}) {
  const client = new ClientBuilder().withProjectKey(projectKey);

  /** TODO: Automatically set new token if expired token has automatically been refreshed by CT
   * using the tokenCache options in the withX methods.
   */

  if (tokenData) {
    client
      .withRefreshTokenFlow({
        host: authUrl,
        projectKey: projectKey,
        refreshToken: tokenData.refresh_token as string,
        credentials: {
          clientId: clientId,
          clientSecret: clientSecret,
        },
        fetch,
      })
      .withExistingTokenFlow(`Bearer ${tokenData.access_token}`, {
        force: true,
      });
  } else {
    client.withAnonymousSessionFlow({
      host: authUrl,
      projectKey: projectKey,
      credentials: {
        clientId: clientId,
        clientSecret: clientSecret,
      },
      scopes: scopes ? scopes.split(" ") : [],
      fetch,
    });
  }

  client.withHttpMiddleware({
    fetch,
    host: apiUrl,
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

  const requestBuilder = createApiBuilderFromCtpClient(
    client.build()
  ).withProjectKey({
    projectKey: projectKey,
  });

  return requestBuilder;
}
