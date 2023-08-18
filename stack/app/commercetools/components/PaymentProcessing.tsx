import { useTranslation } from "react-i18next";
import { Link } from "~/components/interactive";

export const PaymentProcessing = () => {
  const { t } = useTranslation("commercetools");
  return (
    <div className="my-16 flex h-full min-h-[500px] w-full flex-col items-center justify-center">
      <div
        className="mb-6 inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          {t("Loading...")}
        </span>
      </div>
      <h2 className="text-base font-bold text-text-base">
        {t("Your order is being processed.")}
      </h2>
      <p className="text-base font-[400] text-text-weak">
        {t("If you're not automatically redirected")},&nbsp;
        <Link className="text-base" onClick={() => window.location.reload()}>
          {t("refresh this page.")}
        </Link>
      </p>
    </div>
  );
};
