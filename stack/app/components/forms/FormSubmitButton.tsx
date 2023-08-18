/**
 * @see https://github.com/airjp73/remix-validated-form
 */
import { Button } from "~/components/interactive/Button";
import { useFormContext, useIsSubmitting } from "remix-validated-form";

import { useTranslation } from "react-i18next";

export type SubmitButtonProps = {
  className?: string;
  label?: string;
  loadingLabel?: string;
};

export const SubmitButton = ({
  className,
  label,
  loadingLabel,
}: SubmitButtonProps) => {
  const { t } = useTranslation();

  const isSubmitting = useIsSubmitting();
  const { isValid } = useFormContext();
  const disabled = isSubmitting || !isValid;

  return (
    <Button
      variant="primary"
      type="submit"
      disabled={disabled}
      className={className}
    >
      {isSubmitting ? t(loadingLabel || "Submitting...") : t(label || "Submit")}
    </Button>
  );
};
