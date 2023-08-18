import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import fetch from "node-fetch";

import { prisma } from "~/db.server"; // @dash-remove db

export const loader: LoaderFunction = async ({ request }) => {
  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");

  try {
    const url = new URL("/", `http://${host}`);
    // if we can connect to the database and make a simple query
    // and make a HEAD request to ourselves, then we're good.
    await Promise.all([
      prisma.user.count(), // @dash-remove db
      fetch(url.toString(), { method: "HEAD" }).then((r: any) => {
        if (!r.ok) return Promise.reject(r);
      }),
    ]);
    return json(
      {
        status: "ok",
        time: new Date().toISOString(),
        git_sha: process.env.GIT_SHA,
      },
      200
    );
  } catch (error: unknown) {
    console.log("healthcheck ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
};
