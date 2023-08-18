import { Customer } from "@commercetools/platform-sdk";
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
    const payload = ((await request.json()) as any).resource.obj as Customer;

    await sendEmail({
      to: payload.email,
      subject: "Welcome to our store",
      title: "Welcome to our store",
      text: "We are happy to have you as a customer.",
      cta: {
        text: "Start shopping",
        url: BASE_URL,
      },
    });
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
