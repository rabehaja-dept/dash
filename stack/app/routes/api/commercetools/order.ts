import { Order } from "@commercetools/platform-sdk";
import { ActionArgs, json } from "@remix-run/node";
import { verifyWebhookRequest } from "~/commercetools/webhook.server";
import { getEnv } from "~/config";
import { sendEmail } from "~/sendgrid"; // @dash-remove sendgrid

export const action = async ({ request }: ActionArgs) => {
  const verification = verifyWebhookRequest(request);

  if (verification) {
    return verification;
  }

  try {
    const BASE_URL = getEnv("PUBLICLY_AVAILABLE_ORIGIN");
    // @dash-remove-start sendgrid
    const payload = ((await request.json()) as any).resource.obj as Order;

    if (payload.customerEmail || payload.billingAddress?.email) {
      await sendEmail({
        to: payload.customerEmail || payload.billingAddress?.email || "",
        subject: "Your order has been placed",
        title: "Your order has been placed",
        text: "Thank you for your order.",
        cta: {
          text: "View order",
          url: `${BASE_URL}/commercetools/order-history`,
        },
      });
    }
    // @dash-remove-end
  } catch (error) {
    console.error(error);
  } finally {
    return json(
      {
        actions: [],
      },
      {
        status: 200,
      }
    );
  }
};
