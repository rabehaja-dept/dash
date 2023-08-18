import { Button } from "~/components/interactive/Button";
import { QuantitySelector } from "./QuantitySelector";
import { CartItem } from "./CartItem";
import { Price } from "./Price";
import { Cart as CartType, LineItem } from "@commercetools/platform-sdk";
import { useTranslation } from "react-i18next";
import { getLanguageFromLocaleString } from "../utils";

interface CartPropsType {
  data: CartType;
  locale: string;
}

export default function Cart({ data, locale }: CartPropsType) {
  const { id, version, lineItems, totalPrice } = data;
  const language = getLanguageFromLocaleString(locale);
  const { t } = useTranslation("commercetools");

  return (
    <section>
      <div className="my-10">
        <h2>{t("My Cart")}</h2>
      </div>
      {lineItems?.length > 0 ? (
        <div className="grid grid-cols-12 gap-x-6">
          {/* Table of items in the cart & quantities */}
          <table className="col-span-12 table-auto outline outline-1 outline-border-weak lg:col-span-9">
            <thead>
              <tr>
                <th className="p-4 text-left">{t("Product")}</th>
                {/**
                 * Hide Quantity and total columns on smaller screens &
                 * stack other options inside the product column
                 */}
                <th className="hidden p-4 text-left md:table-cell">
                  {t("Quantity")}
                </th>
                <th className="hidden p-4 text-right md:table-cell">
                  {t("Total")}
                </th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((line: LineItem, i: number) => {
                return (
                  <tr key={i} className="border-t border-border-weak">
                    <td className="p-4">
                      <CartItem
                        data={line}
                        cartVersion={version}
                        cartId={id}
                        locale={locale}
                        language={language}
                      />
                    </td>

                    <td className="flex items-center justify-center p-4 text-center md:table-cell">
                      <QuantitySelector
                        className="hidden md:table-cell"
                        cartVersion={version}
                        cartId={id}
                        lineId={line.id}
                        quantity={line.quantity}
                        showRemoveButton={true}
                      />
                    </td>

                    <td className="hidden p-4 text-right md:table-cell">
                      <Price
                        price={line.totalPrice}
                        locale={locale}
                        className="text-md font-bold"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Total & Checkout Button */}
          <aside className="relative col-span-12 mt-6 lg:col-span-3 lg:mt-0">
            <div className="sticky top-4">
              <h3 className="flex justify-between text-lg font-bold">
                <span>{t("Subtotal")}:</span>
                <Price
                  price={totalPrice}
                  locale={locale}
                  className="text-md font-bold"
                />
              </h3>
              <p>{t("Taxes and shipping calculated at checkout")}</p>
              <Button
                variant="primary"
                block
                className="mt-4"
                to="/commercetools/checkout"
              >
                {t("Checkout")}
              </Button>
            </div>
          </aside>
        </div>
      ) : (
        <div>{t("Your cart is empty")}</div>
      )}
    </section>
  );
}
