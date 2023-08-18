import NextAuth, { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getAnonymousToken, signIn } from "@deptdash/commercetools";
import { requestBuilder } from "~/commercetools/clients/admin.server";
import { authClient } from "~/commercetools/clients/auth.server";
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // @ts-ignore
        const { email, password, anonymous_id } = credentials;

        let userToken;
        if (email && password) {
          userToken = await signIn(
            authClient,
            requestBuilder,
            {
              email: email,
              password,
            },
            anonymous_id
          );
          if (typeof userToken === "string") {
            throw new Error(userToken);
          }
        } else {
          userToken = await getAnonymousToken(authClient);
        }

        const user = {
          id: email || "anonymous",
          name: email || "anonymous",
          email: email,
          image: null,
          token: userToken,
        };
        return user;
      },
    }),
  ],
  session: {
    maxAge: 24 * 60 * 60, // 1 day
    updateAge: 24 * 60 * 60, // 1 day
  },
  callbacks: {
    async session({ session, user, token }) {
      if (token && token.user && token.user.token) {
        session = token.user.token;
      }
      if (token.anonymousToken) {
        session.anonymousToken = token.anonymousToken;
      }
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.user = user;
      } else {
        user = token.user;
      }
      return token;
    },
  },
};
export default NextAuth(authOptions);
