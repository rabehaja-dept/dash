import { useFormContext } from "react-hook-form";
import { FormInput } from "./FormInput";
import React from "react";

export type ValidatedFormInputProps = {
  name: string;
  label: string;
  required?: boolean;
  className?: string;
  defaultValue?: string;
  placeholder?: string;
  // All other props
  [x: string]: any;
};

const ValidatedFormInput = React.forwardRef<
  HTMLInputElement,
  ValidatedFormInputProps
>(
  (
    { name, label, required = false, className, defaultValue, placeholder },
    ref
  ) => {
    const {
      register,
      formState: { errors },
    } = useFormContext();

    return (
      <FormInput
        name={name}
        className={className}
        label={label}
        required={required}
        inputProps={{
          ...register(name, {
            required: required ? "This field is required" : undefined,
          }),
          defaultValue: defaultValue,
          ref,
        }}
        placeholder={placeholder}
        error={(errors[name]?.message as string) ?? ""}
      />
    );
  }
);

export default ValidatedFormInput;
