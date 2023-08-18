import { createDeliveryClient } from "@kontent-ai/delivery-sdk";

const environmentId = process.env.KONTENT_AI_ENVIRONMENT_ID;
const secureApiKey = process.env.KONTENT_AI_DELIVERY_API_KEY;
const previewApiKey = process.env.KONTENT_AI_PREVIEW_API_KEY;

// initialize delivery client
export const deliveryClient = createDeliveryClient({
  environmentId,
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
