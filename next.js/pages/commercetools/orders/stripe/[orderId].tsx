import {
  Client as GoogleMaps,
  GeocodeResponse,
} from "@googlemaps/google-maps-services-js";
import { Cart, Order } from "@deptdash/commercetools";
import { getMyOrderById } from "~/commercetools/order.server";
import { getCartById } from "~/commercetools/cart.server";
import { OrderSummary } from "~/commercetools/components/order/OrderSummary";
import CheckoutProducts from "~/commercetools/components/checkout/CheckoutProducts";
import { CartTotalPrice } from "~/commercetools/components/cart/CartTotalPrice";
import styles from "./order.module.css";
import Checkout from "~/layouts/commercetools/checkout-layout";
import Layout from "~/layouts/commercetools/base-layout";
export async function getServerSideProps(context) {
  const gapikey = process.env.GOOGLE_MAPS_API_KEY;
  const orderId = context.params?.orderId;
  const locale = context.locale;

  const googleMaps = new GoogleMaps({});

  if (!orderId) {
    context.res.writeHead(302, { Location: "/commercetools/" });
    context.res.end();
    return { props: {} };
  }

  const order = await getMyOrderById(context.req, context.res, orderId);

  if (!order) {
    context.res.writeHead(302, { Location: "/commercetools/" });
    context.res.end();
    return { props: {} };
  }

  const cartId = order.cart?.id;

  if (!cartId) {
    context.res.writeHead(302, { Location: "/commercetools/" });
    context.res.end();
    return { props: {} };
  }

  const orderCart: Cart = await getCartById(cartId);

  const { shippingAddress } = order;

  const location: GeocodeResponse = await googleMaps.geocode({
    params: {
      address: `${shippingAddress?.city}, ${shippingAddress?.country}`,
      key: gapikey,
    },
  });

  const fallbackMapCoordinates = {
    // DEPT HQ
    lat: 52.3446453,
    lng: 4.6938729,
  };

  const orderLocation =
    location.status === 200
      ? {
          lat: location.data.results[0]?.geometry.location.lat || "",
          lng: location.data.results[0]?.geometry.location.lng || "",
        }
      : fallbackMapCoordinates;

  return {
    props: {
      locale,
      orderCart,
      order,
      orderLocation,
      gapikey: gapikey,
    },
  };
}
export default function Summary({
  locale,
  orderCart,
  order,
  orderLocation,
  gapikey,
}) {
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.borderContainer}>
          <section className={styles.section}>
            <OrderSummary
              order={order}
              orderLocation={orderLocation}
              gapikey={gapikey}
            />
          </section>
        </div>
        <div className={styles.backgroundContainer}>
          <div className={styles.stickyDiv}>
            <div className={styles.divContainer}>
              <CheckoutProducts data={orderCart?.lineItems} locale={locale} />
              <CartTotalPrice cart={orderCart} locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
