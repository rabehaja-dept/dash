// @ts-ignore
import { getEnv } from "~/config";
import { getSessionToken } from "../session.server";
import { getWebRequestBuilder } from "@deptdash/commercetools";

export async function getRequestBuilder(request: Request) {
  const COMMERCETOOLS_PROJECT_KEY = getEnv("COMMERCETOOLS_PROJECT_KEY");
  const COMMERCETOOLS_API_URL = getEnv("COMMERCETOOLS_API_URL");
  const COMMERCETOOLS_AUTH_URL = getEnv("COMMERCETOOLS_AUTH_URL");

  const COMMERCETOOLS_CLIENT_ID = getEnv("COMMERCETOOLS_WEB_CLIENT_ID");
  const COMMERCETOOLS_SECRET = getEnv("COMMERCETOOLS_WEB_SECRET");
  const COMMERCETOOLS_SCOPES = getEnv("COMMERCETOOLS_WEB_SCOPES");

  const tokenData = await getSessionToken(request);

  const requestBuilder = await getWebRequestBuilder({
    projectKey: COMMERCETOOLS_PROJECT_KEY,
    apiUrl: COMMERCETOOLS_API_URL,
    authUrl: COMMERCETOOLS_AUTH_URL,
    clientId: COMMERCETOOLS_CLIENT_ID,
    clientSecret: COMMERCETOOLS_SECRET,
    scopes: COMMERCETOOLS_SCOPES,
    tokenData,
  });

  return requestBuilder;
}
