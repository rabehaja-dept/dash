import { Fragment } from "react";
import clsx from "clsx";
import { Switch } from "@headlessui/react";
import { FormError } from "./FormError";
import { motion } from "framer-motion";

export type FormSwitchProps = {
  name: string;
  label: string;
  disabled?: boolean;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
};

export const FormSwitch = ({
  name,
  label,
  disabled,
  onBlur,
  error,
  className,
}: FormSwitchProps) => {
  return (
    <>
      <div className="flex flex-row items-center gap-4">
        <Switch.Group>
          <Switch.Label htmlFor={name} className={clsx("text-sm text-text")}>
            {label}
          </Switch.Label>
          <Switch name={name} as={Fragment}>
            {({ checked }) => (
              <button
                className={clsx(
                  "relative inline-flex h-6 w-11 items-center rounded-full",
                  checked ? "bg-primary" : "bg-primary-weak",
                  disabled && "cursor-not-allowed",
                  className
                )}
                disabled={disabled}
              >
                <span
                  className={`${
                    checked ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </button>
            )}
          </Switch>
        </Switch.Group>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {error && <FormError error={error} />}
      </motion.div>
    </>
  );
};
