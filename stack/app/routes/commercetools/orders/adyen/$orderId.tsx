import { GOOGLE_MAPS_API_KEY as key } from "~/config";
import { Cart, Order } from "@commercetools/platform-sdk";
import {
  Client as GoogleMaps,
  GeocodeResponse,
} from "@googlemaps/google-maps-services-js";
import { LoaderFunction, redirect } from "@remix-run/node";
import { OrderSummary } from "~/commercetools/components/OrderSummary";
import { useLoaderData } from "@remix-run/react";
import { getMyOrderById } from "~/commercetools/api/order.server";
import { i18n } from "~/i18n.server";
import { getCartById } from "~/commercetools/api/cart.server";
import { CartTotalPrice } from "~/commercetools/components/CartTotalPrice";
import CheckoutProducts from "~/commercetools/components/CheckoutProducts";

export type LoaderData = {
  locale: string;
  orderCart: Cart;
  order: Order;
  orderLocation: { lat: number; lng: number };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const locale = await i18n.getLocale(request);

  const googleMaps = new GoogleMaps({});
  const { orderId } = params;

  if (!orderId) {
    return redirect("/commercetools/");
  }

  const order = await getMyOrderById(orderId, request);

  if (!order) {
    return redirect("/commercetools/");
  }

  const cartId = order.cart?.id;

  if (!cartId) {
    return redirect("/commercetools/");
  }

  const orderCart: Cart = await getCartById(cartId);

  const { shippingAddress } = order;
  const location: GeocodeResponse = await googleMaps.geocode({
    params: {
      address: shippingAddress
        ? `${shippingAddress.streetName} ${shippingAddress.streetNumber}, ${shippingAddress.city}, ${shippingAddress.country}`
        : "atlanta, georgia, united states", // TODO: use a default address
      key,
    },
  });

  return {
    locale,
    orderCart,
    order,
    orderLocation: {
      lat: location.data.results[0].geometry.location.lat,
      lng: location.data.results[0].geometry.location.lng,
    },
  };
};

export default function Summary() {
  const { locale, order, orderLocation, orderCart } = useLoaderData();

  return (
    <div className="w-12/12 flex flex-col md:flex-row">
      <div className="border-r-1 w-12/12 order-last grow border border-y-0 border-l-0 border-border-base p-6 pb-16 md:order-first md:w-6/12 md:pl-0 md:pr-14 md:pt-14">
        <section className="ml-auto md:w-3/4">
          <OrderSummary order={order} orderLocation={orderLocation} />
        </section>
      </div>
      <div className="w-12/12 border-b-1 grow bg-background-accent-base p-6 md:w-6/12 md:border-0 md:pb-0 md:pl-10 md:pr-0 md:pt-14">
        <div className="lg:sticky lg:top-36">
          <div className=" md:w-3/4">
            <CheckoutProducts data={orderCart?.lineItems} locale={locale} />
            <CartTotalPrice cart={orderCart} locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}
