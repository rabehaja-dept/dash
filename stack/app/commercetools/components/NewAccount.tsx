import { useTranslation } from "react-i18next";
import { Button } from "~/components/interactive";

export default function NewAccount() {
  const { t } = useTranslation("commercetools");
  const message = t(
    "Creating an account has many benefits: check out faster, keep more than one address, track orders and more."
  );
  return (
    <div className="bg-background-canvas-light px-4 sm:w-full md:w-1/2">
      <div className="m-4 px-4 py-8 sm:px-0">
        <h2 className="mb-4 text-2xl font-bold">{t("New Account")}</h2>
        <div className="border-weak border-b" />
        <p className="mb-8 mt-4 text-gray-600">{message}</p>
        <Button
          className="mt-6 border font-bold"
          variant="custom"
          block
          to="/commercetools/register"
        >
          {t("CREATE AN ACCOUNT")}
        </Button>
      </div>
    </div>
  );
}
