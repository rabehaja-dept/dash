import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { getEnv } from "~/config";
import { Token } from "../types";

const SESSION_SECRET = getEnv("SESSION_SECRET");
export const SESSION_TOKEN_KEY = "__ctsession";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: SESSION_TOKEN_KEY,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: [SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function createCTSession({
  request,
  key,
  value,
  expiresAt,
  redirectTo,
}: {
  request: Request;
  key: string;
  value: string;
  expiresAt: number;
  redirectTo?: string;
}) {
  const session = await getSession(request);

  session.set(key, value);

  const cookie = await sessionStorage.commitSession(session, {
    expires: expiresAt ? new Date(expiresAt) : undefined,
  });

  if (redirectTo) {
    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": cookie,
      },
    });
  } else {
    return cookie;
  }
}

export async function getSession(request: Request) {
  const cookie = request.headers.get("cookie");
  return sessionStorage.getSession(cookie);
}

export const getSessionToken = async (
  request: Request
): Promise<Token | undefined> => {
  const session = await getSession(request);
  const ctToken = session.get(SESSION_TOKEN_KEY) as string | undefined;
  return ctToken ? JSON.parse(ctToken) : undefined;
};
