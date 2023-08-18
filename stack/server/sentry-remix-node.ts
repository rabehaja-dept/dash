import * as Sentry from "@sentry/node";
import { v4 as uuid } from "uuid";
import type { Transaction, SamplingContext } from "@sentry/types";
import type {
  ActionFunction,
  DataFunctionArgs,
  LoaderFunction,
  ServerBuild,
} from "@remix-run/server-runtime";
import type { Request, Response } from "express";

function wrapDataFunc(
  func: LoaderFunction | ActionFunction,
  routeId: string,
  method: string
) {
  const ogFunc = func;

  return async (arg: DataFunctionArgs) => {
    const parentTransaction: Transaction | undefined =
      arg.context && (arg.context.__sentry_transaction as Transaction);
    const transaction =
      parentTransaction &&
      parentTransaction.startChild({
        op: `${method}:${routeId}`,
        description: `${method}: ${routeId}`,
      });
    transaction && transaction.setStatus("ok");
    transaction && (transaction.transaction = parentTransaction);

    try {
      return await ogFunc(arg);
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          global_id: parentTransaction && parentTransaction.tags["global_id"],
        },
      });
      transaction && transaction.setStatus("internal_error");
      throw error;
    } finally {
      transaction && transaction.finish();
    }
  };
}

export function registerSentry(build: ServerBuild) {
  let routes: Record<string, ServerBuild["routes"][string]> = {};

  for (let [id, route] of Object.entries(build.routes)) {
    /** @type {build["routes"][string]} */
    let newRoute = { ...route, module: { ...route.module } };

    if (route.module.action) {
      newRoute.module.action = wrapDataFunc(route.module.action, id, "action");
    }

    if (route.module.loader) {
      newRoute.module.loader = wrapDataFunc(route.module.loader, id, "loader");
    }

    routes[id] = newRoute;
  }

  return {
    ...build,
    routes,
  };
}

export function sentryLoadContext(req: Request, res: Response) {
  const transaction = Sentry.getCurrentHub().startTransaction({
    op: "request",
    name: `${req.method}: ${req.url}`,
    description: `${req.method}: ${req.url}`,
    metadata: {
      requestPath: req.url,
    },
    tags: {
      global_id: uuid(),
    },
  });
  transaction && transaction.setStatus("internal_error");

  res.once("finish", () => {
    if (transaction) {
      transaction.setHttpStatus(res.statusCode);
      transaction.setTag("http.status_code", res.statusCode);
      transaction.setTag("http.method", req.method);
      transaction.finish();
    }
  });

  return {
    __sentry_transaction: transaction,
  };
}

let requestCount = {
  minute: "",
  requests: 0,
};
export function tracesSampler(
  _samplingContext: SamplingContext
): number | boolean {
  const now = new Date().toISOString().slice(0, 16);
  if (requestCount.minute !== now) {
    requestCount = { minute: now, requests: 0 };
  }
  requestCount.requests++;
  const reqs = requestCount.requests;
  // prettier-ignore
  return (
    reqs < 100 ? 1 : // capture the first 100 requests in each minute
    reqs < 1000 ? 0.1 : // 10% up to 1000
    reqs < 10000 ? 0.01 : // 1% to 10k
    0.001
  );
}
