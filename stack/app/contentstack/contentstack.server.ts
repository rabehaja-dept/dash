import * as Contentstack from "contentstack";
import { getEnv } from "~/config";

export const contentstack = Contentstack.Stack({
  api_key: getEnv("CONTENTSTACK_API_KEY", { default: "" }),
  delivery_token: getEnv("CONTENTSTACK_DELIVERY_TOKEN", { default: "" }),
  environment: getEnv("CONTENTSTACK_ENVIRONMENT", { default: "" }),
  region: getEnv("CONTENTSTACK_REGION", {
    default: Contentstack.Region.US,
  }) as Contentstack.Region,
});
