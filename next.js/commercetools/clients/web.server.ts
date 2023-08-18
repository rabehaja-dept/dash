import { getWebRequestBuilder } from "@deptdash/commercetools";
import { authOptions } from "../../pages/api/commercetools/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
const {
  COMMERCETOOLS_PROJECT_KEY,
  COMMERCETOOLS_API_URL,
  COMMERCETOOLS_AUTH_URL,
  COMMERCETOOLS_WEB_CLIENT_ID,
  COMMERCETOOLS_WEB_SECRET,
  COMMERCETOOLS_WEB_SCOPES,
} = process.env;

export const getRequestBuilder = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const tokenData = await getServerSession(req, res, authOptions);
  const requestBuilder = await getWebRequestBuilder({
    projectKey: COMMERCETOOLS_PROJECT_KEY,
    apiUrl: COMMERCETOOLS_API_URL,
    authUrl: COMMERCETOOLS_AUTH_URL,
    clientId: COMMERCETOOLS_WEB_CLIENT_ID,
    clientSecret: COMMERCETOOLS_WEB_SECRET,
    scopes: COMMERCETOOLS_WEB_SCOPES,
    tokenData,
  });
  return requestBuilder;
};
