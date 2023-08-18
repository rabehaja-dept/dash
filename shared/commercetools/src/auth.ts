import { CustomerDraft } from "@commercetools/platform-sdk";
import { Token } from "./types";

export const getAnonymousToken = async (authClient: any): Promise<Token> => {
  const token = await authClient.anonymousFlow();
  const anonymous_id = token.scope.split("anonymous_id:")[1].split(" ")[0];
  return {
    ...token,
    anonymous_id,
  };
};

export const signIn = async (
  authClient: any,
  requestBuilder: any,
  userRequest: CustomerDraft,
  anonymous_id?: any
): Promise<Token | string> => {
  const { email, password } = userRequest;

  if (!email || !password) {
    return "Email and password are required";
  }

  try {
    if(anonymous_id) {
      await requestBuilder
        .login()
        .post({
          body: {
            email,
            password,
            anonymousId: anonymous_id,
          },
        })
        .execute();
    }

    const token = await authClient.customerPasswordFlow({
      username: email,
      password,
    });

    return token;
  } catch (error: any) {
    return error.message;
  }
};