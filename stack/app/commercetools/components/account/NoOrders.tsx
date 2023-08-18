import { useTranslation } from "react-i18next";
import { Button, Notification } from "~/components/interactive";

export default function NoOrders() {
  const { t } = useTranslation("commercetools");
  return (
    <div className="w-full pt-6 md:w-1/2">
      <div className="flex flex-col">
        <Notification
          className="w-full overflow-hidden text-ellipsis whitespace-nowrap"
          message={t("You have placed no orders.")}
          closable={false}
          type="warning"
        />
        <Button
          className="mt-6 w-full border font-bold"
          variant="custom"
          block
          to="/commercetools"
        >
          {t("CONTINUE TO SHOP")}
        </Button>
      </div>
    </div>
  );
}
