import { ActionFunction, json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { ValidatedForm, validationError } from "remix-validated-form";
// Zod
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
// Custom components
import {
  ValidatedFormCheckbox,
  ValidatedFormInput,
  ValidatedSelect,
  ValidatedSwitch,
  SubmitButton,
} from "~/components/forms";
/**
 * Zod validator
 * @see https://zod.dev/
 */
export const validator = withZod(
  z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    age: z.string().min(1, { message: "Age is required" }),
    favoriteColor: z
      .object({ label: z.string(), value: z.string() })
      .required(),
    agreeToTerms: z.coerce
      .boolean()
      .refine((value) => value, { message: "You must agree to the terms" }),
    agreeToTermsAgain: z.coerce
      .boolean()
      .refine((value) => value, { message: "You must agree to the terms" }),
  })
);

export const action: ActionFunction = async ({ request }) => {
  // Validate form data
  const form = await validator.validate(await request.formData());
  // Check for errors
  if (form.error) return validationError(form.error);
  // Get form data
  const {
    firstName,
    lastName,
    age,
    favoriteColor,
    agreeToTerms,
    agreeToTermsAgain,
  } = form.data;

  /**
   * Do something with the data here
   */

  // Return JSON response and consume with `useActionData()`
  return json({
    title: `Hi ${firstName} ${lastName}!`,
    description: `Your age is ${age} and your favorite color is ${favoriteColor.value}.`,
    agreeToTerms,
    agreeToTermsAgain,
  });
};

const colorOptions = [
  { label: "Red", value: "red" },
  { label: "Green", value: "green" },
  { label: "Blue", value: "blue" },
];

export default function ExampleValidatedForm() {
  const data = useActionData();

  return (
    <section className="mx-4 mb-36 mt-16 flex justify-center">
      <div className="w-[500px] max-w-[500px]">
        <h2 className="mb-4 text-title-md">Example Form</h2>
        <ValidatedForm
          validator={validator}
          method="post"
          className="flex flex-col gap-2"
        >
          <ValidatedFormInput name="firstName" label="First Name" />
          <ValidatedFormInput name="lastName" label="Last Name" />
          <ValidatedFormInput name="age" label="Age" type="number" />
          <ValidatedSelect
            name="favoriteColor"
            label="Favorite Color"
            placeholder="What is your favorite color?"
            options={colorOptions}
          />
          <ValidatedFormCheckbox name="agreeToTerms" label="Agree to terms?" />
          <ValidatedSwitch name="agreeToTermsAgain" label="Are you sure?" />
          {data && <div>{JSON.stringify(data)}</div>}
          <SubmitButton className="mt-4" />
        </ValidatedForm>
      </div>
    </section>
  );
}
