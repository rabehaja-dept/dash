import { ActionFunction, json, MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { handleCreateCustomer } from "~/commercetools/api/customer.server";
import { ValidatedForm } from "remix-validated-form";
import { SubmitButton, ValidatedFormInput } from "~/components/forms";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { useActionData } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { useTranslation } from "react-i18next";
export const meta: MetaFunction = () => {
  return {
    title: "Create Account",
  };
};

export const validator = withZod(
  z.object({
    email: z.string().email({ message: "Email is required" }),
    password: z.string().min(3, { message: "Password is required" }),
    firstName: z.string().min(1, { message: "First Name is required" }),
    lastName: z.string().min(1, { message: "Last Name is required" }),
  })
);

interface ActionData {
  error?: string;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  const customer = await handleCreateCustomer(
    { email, password, firstName, lastName },
    request
  );
  if (typeof customer === "string") {
    return json<ActionData>({ error: customer }, { status: 400 });
  }
  return redirect("/commercetools/login");
};
export default function Register() {
  const data = useActionData();
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);
  const { t } = useTranslation("commercetools");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full p-10 sm:w-2/3 md:w-1/2 lg:w-1/3">
        <h1 className="mb-4 text-title-lg font-bold text-text-base">
          {t("Create Account")}
        </h1>
        <a
          href="/commercetools/login"
          className="mb-4 block font-sourceCodePro text-body-sm text-text-base underline"
        >
          {t("BACK TO SIGN IN")}
        </a>
        <ValidatedForm
          validator={validator}
          method="post"
          className="mt-4 flex flex-col gap-2"
        >
          <ValidatedFormInput
            name="firstName"
            label={t("First Name")}
            placeholder={t("Enter your first name")}
          />
          <ValidatedFormInput
            name="lastName"
            label={t("Last Name")}
            placeholder={t("Enter your last name")}
          />
          <ValidatedFormInput
            name="email"
            label={t("Email")}
            placeholder={t("Enter your email")}
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
          <SubmitButton className="mt-4" />
        </ValidatedForm>
      </div>
    </div>
  );
}
