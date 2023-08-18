/**
 * @see https://github.com/airjp73/remix-validated-form
 */
import { FormSelect } from "./FormSelect";
import { useField } from "remix-validated-form";

export type ValidatedSelectProps = {
  name: string;
  label: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  defaultValue?: { label: string; value: string } | null;
  required?: boolean;
  className?: string;
  onChange?: (value: any) => void;
};

export const ValidatedSelect = ({
  name,
  label,
  options,
  placeholder,
  defaultValue,
  required = false,
  className,
  onChange,
}: ValidatedSelectProps) => {
  const { error, validate } = useField(name);
  return (
    <FormSelect
      name={name}
      className={className}
      label={label}
      options={options}
      placeholder={placeholder}
      defaultValue={defaultValue}
      error={error}
      required={required}
      onChange={onChange}
      validate={validate}
    />
  );
};
