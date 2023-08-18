/**
 * @see https://github.com/airjp73/remix-validated-form
 */
import { FormSwitch } from "./FormSwitch";
import { useField } from "remix-validated-form";

export type ValidatedSwitchProps = {
  name: string;
  label: string;
  required?: boolean;
};

export const ValidatedSwitch = ({
  name,
  label,
  required = false,
}: ValidatedSwitchProps) => {
  const { error } = useField(name);

  return <FormSwitch name={name} label={label} error={error} />;
};
