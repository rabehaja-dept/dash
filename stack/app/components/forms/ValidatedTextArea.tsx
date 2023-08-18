/**
 * @see https://github.com/airjp73/remix-validated-form
 */
import { FormTextArea } from "./FormTextArea";
import { useField } from "remix-validated-form";

export type ValidatedTextAreaProps = {
  name: string;
  label: string;
  required?: boolean;
  // All other props
  [x: string]: any;
};

export const ValidatedTextArea = ({
  name,
  label,
  required = false,
  ...rest
}: ValidatedTextAreaProps) => {
  const { error, getInputProps } = useField(name);

  return (
    <FormTextArea
      name={name}
      label={label}
      error={error}
      required={required}
      inputProps={getInputProps({ id: name, ...rest })}
    />
  );
};
