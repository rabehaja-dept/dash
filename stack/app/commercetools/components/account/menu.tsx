import { Form } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

interface MenuLink {
  label: string;
  url: string;
}

export default function Menu() {
  const location = useLocation();
  const currentUrl = location?.pathname.split("/").pop();
  const commercetoolsUrl = location?.pathname.split("/account").shift();
  const { t } = useTranslation("commercetools");
  const menuLinks = [
    { label: t("MY ACCOUNT"), url: commercetoolsUrl + "/account" },
    {
      label: t("ORDER HISTORY"),
      url: commercetoolsUrl + "/account/order-history",
    },
    {
      label: t("BILLING INFORMATION"),
      url: commercetoolsUrl + "/account/billing-information",
    },
  ];
  const fields = menuLinks as MenuLink[];
  return (
    <div className="flex flex-col">
      {fields.map((field) => (
        <Link
          key={field.label}
          to={field.url}
          className={`${
            currentUrl === field.url.split("/").pop()
              ? "bg-primary-base text-white"
              : "bg-background-canvas-light"
          } mb-1 px-4 py-2 font-sourceCodePro hover:bg-primary hover:text-white focus:bg-primary focus:text-white
                        `}
        >
          {field.label}
        </Link>
      ))}
      <Form action="/commercetools/account/logout" method="post">
        <button
          className="h-10 w-full bg-background-canvas-light px-4 py-2 text-left font-sourceCodePro uppercase hover:bg-primary hover:text-white focus:bg-primary focus:text-white"
          type="submit"
        >
          {t("Log out")}
        </button>
      </Form>
    </div>
  );
}
