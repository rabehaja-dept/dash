import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { MetaFunction, redirect } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ValidatedForm, validationError } from "remix-validated-form";
import { z } from "zod";
import NewAccount from "~/commercetools/components/NewAccount";
import { handleSignIn } from "~/commercetools/api/auth.server";
import {
  createCTSession,
  getSessionToken,
  SESSION_TOKEN_KEY,
} from "~/commercetools/api/session.server";
import { SubmitButton } from "~/components/forms/FormSubmitButton";
import { ValidatedFormInput } from "~/components/forms/ValidatedInput";

const REDIRECT_TO_AFTER_LOGIN = "/";

export const meta: MetaFunction = () => {
  return {
    title: "Login",
    description: "Login to your account",
  };
};

export const validator = withZod(
  z.object({
    email: z.string().email({ message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
  })
);

interface ActionData {
  error?: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const ctToken = await getSessionToken(request);

  if (ctToken && !ctToken.anonymous_id) {
    return redirect(REDIRECT_TO_AFTER_LOGIN);
  }

  return json({});
};

export const action: ActionFunction = async ({ request }) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const redirectTo = searchParams.get("redirectTo") || REDIRECT_TO_AFTER_LOGIN;

  // Validate form data
  const data = await request.formData();
  const form = await validator.validate(data);

  // Check for errors
  if (form.error) {
    return validationError(form.error);
  }

  // Get form data
  const { email, password } = form.data;

  // Sign in
  const token = await handleSignIn(request, { email, password });

  if (typeof token === "string") {
    // error message
    return json<ActionData>({ error: token }, { status: 400 });
  }

  return createCTSession({
    request: request,
    key: SESSION_TOKEN_KEY,
    value: JSON.stringify(token),
    expiresAt: token?.expires_at,
    redirectTo: redirectTo,
  });
};

export default function LoginPage() {
  const data = useActionData();
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);
  const { t } = useTranslation("commercetools");
  return (
    <div className="flex items-center justify-center">
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:justify-center md:flex-row md:justify-between">
          <div className="px-4 sm:w-full md:w-1/2">
            <div className="m-4 px-4 py-8 sm:px-0">
              <h2 className="mb-4 text-title-sm font-bold text-text-base">
                {t("Existing Account")}
              </h2>
              <div className="border-weak border-b" />
              <ValidatedForm
                validator={validator}
                method="post"
                className="mt-4 flex flex-col gap-2"
              >
                <ValidatedFormInput
                  name="email"
                  label={t("Email")}
                  placeholder="email@address.com"
                />
                <ValidatedFormInput
                  name="password"
                  label={t("Password")}
                  placeholder="******"
                  type={showPassword ? "text" : "password"}
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="show-password"
                    checked={showPassword}
                    onChange={handleShowPassword}
                    className="start-0 mr-2"
                  />
                  <label htmlFor="show-password" className="text-gray-700">
                    {t("Show Password")}
                  </label>
                </div>
                {data?.error && (
                  <div className="pt-1 text-red-700" id="generic-error">
                    {data.error}
                  </div>
                )}
                <SubmitButton
                  className="mt-4"
                  label="Log in"
                  loadingLabel="Logging in..."
                />
              </ValidatedForm>
            </div>
          </div>
          <NewAccount />
        </div>
      </div>
    </div>
  );
}
