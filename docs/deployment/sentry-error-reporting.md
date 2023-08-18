# Sentry Error Reporting

DEPT DASH™ uses [sentry.io](https://sentry.io/) to track errors in the running app. You can enable it by creating a sentry project and adding a `SENTRY_DSN` environment variable.

## Setup

1. Log into sentry.
2. Visit `https://sentry.io/organizations/dept-h6/projects/new/`. Choose the "Node.js" platform. You'll use the same project for both frontend and backend errors.
3. Copy the DSN value to your deployed environment. We recommend against adding it to your local .envrc, to avoid spamming your teammates with emails while you're developing.

> Note: Sentry relies on sourcemaps in order to show clear tracebacks. If you've disabled sourcemaps, like Remix recommends, your tracebacks may show compiled code.

## Traces Sample Rate

Sentry offers performance tracing to track the speed of your app. However, you likely don't want to trace _every_ request in production. On the server, we have some code trace

- 100% of the first 100 requests in a minute,
- 10% up to 1000 requests,
- 1% up to 10000 requests, and
- 0.1% of any remaining requests that minute.

We hope this is a good default for most applications.

Unfortunately, it's hard to track the total requests each minute from the browser. For client tracing, we use a fixed rate of 1%. Please consider adjusting this if 1% of all your traffic makes your Sentry bill too expensive.
