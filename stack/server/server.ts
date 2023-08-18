import * as Sentry from "@sentry/node"; // @dash-remove sentry
import path from "path";
import express from "express";
import compression from "compression";
import morgan from "morgan";
import { createRequestHandler } from "@remix-run/express";
import basicAuth from "express-basic-auth";
// @dash-remove-start sentry
import {
  registerSentry,
  sentryLoadContext,
  tracesSampler,
} from "./sentry-remix-node";
// @dash-remove-end

const BUILD_DIR = path.join(process.cwd(), "build");
const buildPath = path.join(BUILD_DIR, "index.js");
const MODE = process.env.NODE_ENV;
const NODE_MAJOR_VERSION = +process.version.slice(1).split(".")[0];

function loadBuild() {
  if (NODE_MAJOR_VERSION !== 16) {
    // throw an error if you're not using node 16
    const errorMsg = `
      \n\n
      ⚠️ ⚠️ ⚠️ 
      You are running Node ${process.version} but this project requires Node 16.x
      Please use Node version 16.
      ⚠️ ⚠️ ⚠️
      \n\n
    `;
    console.log(errorMsg);
    throw new Error("Node version error");
  }
  let build = require(buildPath);
  build = registerSentry(build); // @dash-remove sentry
  return build;
}

// @dash-remove-start sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampler,
  integrations: [new Sentry.Integrations.Http({ tracing: true })],
});
// @dash-remove-end

const app = express();

// Determine if we should be using basic auth, and with what users if so
function getBasicAuthUsers(): { [key: string]: string } | false {
  const users: { [key: string]: string } = {};
  if (process.env.BASIC_AUTH_USERS) {
    const userPasswordPairs = process.env.BASIC_AUTH_USERS.split("|");
    for (const userPasswordPair of userPasswordPairs) {
      const [username, password] = userPasswordPair.split(",");
      if (username && password) {
        users[username] = password;
      }
    }
    if (Object.keys(users).length !== 0) {
      return users;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
const basicAuthUsers = getBasicAuthUsers();
if (process.env.BASIC_AUTH_ENTIRE_SITE === "true" && basicAuthUsers) {
  app.use(
    basicAuth({
      users: basicAuthUsers,
      challenge: true,
    })
  );
}
// @dash-remove-start storybook
if (
  process.env.BASIC_AUTH_ENTIRE_SITE !== "true" && // This is so we don't try to check basic auth twice
  process.env.BASIC_AUTH_STORYBOOK === "true" &&
  basicAuthUsers
) {
  app.use(
    "/_/storybook",
    basicAuth({
      users: basicAuthUsers,
      challenge: true,
    })
  );
}
// @dash-remove-end
app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// Remix fingerprints its assets so we can cache forever.
app.use(
  "/build",
  express.static("public/build", { immutable: true, maxAge: "1y" })
);

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("public", { maxAge: "1h" }));

// Serve storybook
app.use("/_/storybook", express.static("storybook-static"));

app.use(morgan("tiny"));

app.all(
  "*",
  MODE === "production"
    ? createRequestHandler({ build: loadBuild() })
    : (...args) => {
        purgeRequireCache();
        const requestHandler = createRequestHandler({
          build: loadBuild(),
          mode: MODE,
          getLoadContext: sentryLoadContext, // @dash-remove sentry
        });
        return requestHandler(...args);
      }
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  // require the built app so we're ready when the first request comes in
  loadBuild();
  console.log(`✅ app ready: http://localhost:${port}`);
});

function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, we prefer the DX of this though, so we've included it
  // for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete require.cache[key];
    }
  }
}
