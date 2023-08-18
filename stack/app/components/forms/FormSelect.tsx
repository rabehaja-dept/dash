import { Fragment, useEffect, useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { FormError } from "./FormError";
import { FormHelperText } from "./FormHelperText";

export type FormSelectProps = {
  name: string;
  label: string;
  helperText?: string;
  placeholder?: string;
  defaultValue?: { label: string; value: string } | null;
  options: { label: string; value: string }[];
  required: boolean;
  error?: string;
  className?: string;
  onChange?: (value: any) => void;
  validate?: () => void;
};

export function FormSelect({
  name,
  label,
  helperText,
  placeholder,
  defaultValue,
  options,
  required,
  error,
  className,
  onChange,
  validate,
}: FormSelectProps) {
  const [selected, setSelected] = useState<{
    label: string;
    value: string;
  } | null>(defaultValue || null);

  return (
    <div className={className}>
      <Listbox
        value={selected}
        onChange={(e) => {
          // if the onChange parameter is present, we call it before the setSelected. We also validate after selected to refresh the form
          if (onChange) {
            onChange(e);
          }
          setSelected(e);
          // we need to validate after the value has changed, otherwise if there was an error, it will persist the error after changing the value
          if (validate) {
            validate();
          }
        }}
        name={name}
      >
        {({ open }) => (
          <>
            <Listbox.Label
              className="mb-1 ml-1 block text-xs font-bold text-text"
              htmlFor={name}
            >
              {label} {required && <span className="text-alert-error">*</span>}
            </Listbox.Label>
            <div className="relative">
              <Listbox.Button
                className={clsx(
                  "focus:border-active relative w-full cursor-pointer rounded-input border border-border-weak py-2.5 pl-2 pr-10 text-left focus:outline-none focus:ring-1 focus:ring-border-targeted sm:text-sm",
                  error && "border-alert-error"
                )}
              >
                <span className="flex items-center">
                  {selected ? (
                    <span className="block truncate text-sm">
                      {selected.label}
                    </span>
                  ) : (
                    <span className="text-sm font-light text-text-weak">
                      {placeholder}
                    </span>
                  )}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex cursor-pointer items-center pr-2">
                  <ChevronDownIcon
                    className={clsx(
                      open && "rotate-180",
                      "h-5 w-5 text-text transition-all duration-300"
                    )}
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 max-h-56 w-full overflow-auto rounded-input bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {options.map((option) => (
                    <Listbox.Option
                      key={option.label}
                      className={({ active }) =>
                        clsx(
                          active ? "bg-primary text-text-light" : "text-text",
                          "relative cursor-pointer select-none py-2 pr-9"
                        )
                      }
                      value={option}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <span
                              className={clsx(
                                selected ? "font-semibold" : "font-normal",
                                "ml-3 block truncate"
                              )}
                            >
                              {option.label}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={clsx(
                                active ? "text-white" : "text-primary",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            ></span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {error ? (
          <FormError error={error} />
        ) : helperText ? (
          <FormHelperText helperText={helperText} />
        ) : null}
      </motion.div>
    </div>
  );
}
