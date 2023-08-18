import { createDeliveryClient } from "@kontent-ai/delivery-sdk";
import { getEnv } from "~/config";

const projectId = getEnv("KONTENT_AI_PROJECT_ID");
const secureApiKey = getEnv("KONTENT_AI_DELIVERY_API_KEY");
const previewApiKey = getEnv("KONTENT_AI_PREVIEW_API_KEY");

// initialize delivery client
export const deliveryClient = createDeliveryClient({
  projectId,
  previewApiKey,
  secureApiKey,
  defaultQueryConfig: {
    // Enabled secure access for all queries
    useSecuredMode: true,
  },
  elementResolver: (element) => {
    // your custom element resolver
    // see https://kontent.ai/learn/tutorials/develop-apps/get-content/structured-rich-text/
  },
});
