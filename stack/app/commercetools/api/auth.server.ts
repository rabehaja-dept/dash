import { authClient } from "./clients/auth.server";
import { getSessionToken } from "./session.server";
import { requestBuilder } from "./clients/admin.server";
import { redirect } from "@remix-run/node";
import { Token, getAnonymousToken, signIn } from "@deptdash/commercetools";
import { CustomerDraft } from "@commercetools/platform-sdk";

export const handleGetAnonymouseToken = async (): Promise<Token> => {
  const anonymousToken = await getAnonymousToken(authClient);
  return anonymousToken;
};

export const handleSignIn = async (
  request: Request,
  userRequest: CustomerDraft
): Promise<Token | string> => {
  try {
    const oldToken = await getSessionToken(request);
    const userToken = await signIn(
      authClient,
      requestBuilder,
      userRequest,
      oldToken?.anonymous_id
    );
    return userToken;
  } catch (error: any) {
    return error.message;
  }
};

export const authorize = async (
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) => {
  const ctSessionToken = await getSessionToken(request);

  if (!ctSessionToken || ctSessionToken.anonymous_id) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/commercetools/login?${searchParams}`);
  }

  // if the token is expired, redirect to login or refresh the token
  return ctSessionToken;
};
