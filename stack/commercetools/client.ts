import { ClientBuilder } from "@commercetools/sdk-client-v2";
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";
import { getEnv } from "../app/config";
import fetch from "node-fetch";
const COMMERCETOOLS_PROJECT_KEY = getEnv("COMMERCETOOLS_PROJECT_KEY");
const COMMERCETOOLS_CLIENT_ID = getEnv("COMMERCETOOLS_CLIENT_ID");
const COMMERCETOOLS_SECRET = getEnv("COMMERCETOOLS_SECRET");
const COMMERCETOOLS_SCOPES = getEnv("COMMERCETOOLS_SCOPES");
const COMMERCETOOLS_API_URL = getEnv("COMMERCETOOLS_API_URL");
const COMMERCETOOLS_AUTH_URL = getEnv("COMMERCETOOLS_AUTH_URL");

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
    ...(COMMERCETOOLS_SCOPES && { scopes: COMMERCETOOLS_SCOPES.split(",") }),
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

export const requestBuilder = apiRoot.withProjectKey({
  projectKey: COMMERCETOOLS_PROJECT_KEY,
});
