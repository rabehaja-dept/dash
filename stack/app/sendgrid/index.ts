import * as sgMail from "@sendgrid/mail";
import { getEnv } from "~/config";
import { Email } from "./types";
import baseTemplate from "./templates/base-template";

const SENDGRID_API_KEY = getEnv("SENDGRID_API_KEY");
const SENDGRID_FROM_EMAIL = getEnv("SENDGRID_FROM_EMAIL");

sgMail.setApiKey(SENDGRID_API_KEY);

export async function sendEmail(email: Email) {
  let html = email.html;

  if (!html) {
    html = baseTemplate
      .replace("{{title}}", email.title || "")
      .replace("{{text}}", email.text || "")
      .replace("{{cta.text}}", email.cta?.text || "")
      .replace("{{cta.url}}", email.cta?.url || "");
  }

  return sgMail
    .send({
      to: email.to,
      from: SENDGRID_FROM_EMAIL,
      subject: email.subject,
      html: html as string,
    })
    .then(() => {})
    .catch((error: any) => {
      if (error?.response?.body?.errors) {
        console.error(error.response.body.errors);
      } else {
        console.error(error);
      }
    });
}
