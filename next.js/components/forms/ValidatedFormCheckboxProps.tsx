import { FormCheckbox } from "./FormCheckbox";

export type ValidatedFormCheckboxProps = {
  name: string;
  label: string;
  required?: boolean;
  className?: string;
  // All other props
  [x: string]: any;
};

export const ValidatedFormCheckbox = ({
  name,
  label,
  required = false,
  className,
  onChange,
  ...rest
}: ValidatedFormCheckboxProps) => {
  return (
    <FormCheckbox
      name={name}
      label={label}
      className={className}
      inputProps={{
        id: name,
        onChange,
        ...rest,
      }}
    />
  );
};
