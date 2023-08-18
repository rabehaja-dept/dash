import { SelectHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import styles from "./validatedSelect.module.css";

interface ValidatedSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  required?: boolean;
}

const ValidatedSelect: React.FC<ValidatedSelectProps> = ({
  name,
  required,
  onChange,
  children,
  defaultValue,
  ...props
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const {
    ref,
    onChange: registerOnChange,
    ...registerProps
  } = register(name, { required });

  const handleChange = (event) => {
    if (onChange) {
      onChange(event);
    }
    registerOnChange(event);
  };

  return (
    <div>
      <select
        className={styles.select}
        {...props}
        {...registerProps}
        ref={ref}
        onChange={handleChange}
        defaultValue={defaultValue}
      >
        {children}
      </select>
      {errors[name] && <p>This field is required</p>}
    </div>
  );
};

export default ValidatedSelect;
