import { Order } from "@commercetools/platform-sdk";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "react-router";
import { getMyOrdersHistory } from "~/commercetools/api/order.server";
import Menu from "~/commercetools/components/account/menu";
import NoOrders from "~/commercetools/components/account/NoOrders";
import { Price } from "~/commercetools/components/Price";
import { i18n } from "~/i18n.server";

type LoaderData = {
  orders: Order[];
  locale: string;
};
export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const orders = await getMyOrdersHistory(request);
  const locale = await i18n.getLocale(request);
  return { orders, locale: locale };
};

const getFormattedDate = (date: string, locale: string) => {
  return new Date(date).toLocaleDateString(locale, {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
};
export default function OrderHistory() {
  const { orders, locale } = useLoaderData() as LoaderData;
  return (
    <div className="flex justify-start py-6">
      <div className="w-full py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          <div className="flex flex-col md:flex-row">
            <div className="mb-4 px-4 sm:w-full md:w-1/4">
              <div className="flex flex-col">
                <Menu />
              </div>
            </div>
            <div className="w-full px-4 md:flex-1">
              <h2 className="mb-4 text-title-md font-bold text-text-base">
                Order History
              </h2>
              {orders?.length ? (
                <>
                  <table className="table-auto">
                    <thead>
                      <tr className="bg-background-canvas-light">
                        <th className="border-r p-4 text-left">Order #</th>
                        <th className="border-r p-4 text-left md:table-cell">
                          Date
                        </th>
                        <th className="border-r p-4 text-left md:table-cell">
                          Payment
                        </th>
                        <th className="border-r p-4 text-left md:table-cell">
                          Shipping
                        </th>
                        <th className="border-r p-4 text-left md:table-cell">
                          Total
                        </th>
                      </tr>
                    </thead>
                    {orders.map((order: Order, i: number) => (
                      <tbody key={i}>
                        <tr key={i} className="border-t border-border-weak">
                          <td className="border-r p-4 ">
                            {order.orderNumber ? order.orderNumber : "--"}
                          </td>
                          <td className="border-r p-4 ">
                            {order.lastModifiedAt
                              ? getFormattedDate(order.lastModifiedAt, locale)
                              : "--"}
                          </td>
                          <td className="border-r p-4 ">
                            {order.paymentState ? order.paymentState : "--"}
                          </td>
                          <td className="border-r p-4 ">
                            {order.shipmentState ? order.shipmentState : "--"}
                          </td>
                          <td className="p-4">
                            <Price price={order.totalPrice} locale={locale} />
                          </td>
                        </tr>
                      </tbody>
                    ))}
                  </table>
                </>
              ) : (
                <NoOrders />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
