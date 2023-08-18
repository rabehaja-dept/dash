import styles from "./orderSummary.module.css";
import { MdCheckCircle } from "react-icons/md";
import { Order } from "@deptdash/commercetools";
import { GoogleMap } from "~/components/plugins/GoogleMap";
import MapLocation from "./MapLocation";
import OrderAddress from "./OrderAddress";

export type OrderSummaryProps = {
  order: Order;
  orderLocation: { lat: number; lng: number };
  gapikey: string;
};

export const OrderSummary = ({
  order,
  orderLocation,
  gapikey,
}: OrderSummaryProps) => {
  const {
    id,
    customerEmail,
    shippingAddress,
    billingAddress,
    shippingInfo,
    paymentInfo, // TODO: Wire up payment method
  } = { ...order };

  return (
    <>
      <div className={styles.orderSummary}>
        <MdCheckCircle className={styles.checkIcon} />
        <div>
          <span className={styles.text}>"Order #" {id}</span>
          <h2 className={styles.title}>"Thank you!"</h2>
        </div>
      </div>
      <div className={styles.orderInfo}>
        <GoogleMap
          height="450px"
          width="100%"
          defaultCenter={{
            lat: orderLocation.lat || 0,
            lng: orderLocation.lng || 0,
          }}
          gapikey={gapikey}
        >
          <MapLocation lat={orderLocation.lat} lng={orderLocation.lng} />
        </GoogleMap>
        <div className={styles.mapContainer}>
          <h3 className={styles.title}>"Your order has been placed."</h3>
          <p className={styles.paragraph}>
            "We're getting your order ready and will keep you updated when it
            ships!"
          </p>
        </div>
      </div>
      <div className={styles.orderContact}>
        <h3 className={`${styles.header} ${styles.text}`}>
          "Customer information"
        </h3>
        <div className={styles.gridContainer}>
          <div>
            <div className={styles.mbOverflow}>
              <h4 className={`${styles.subHeader} ${styles.text}`}>
                "Contact information"
              </h4>
              <p className={styles.text}>
                {customerEmail || "No email on file."}
              </p>
            </div>
            <div className={styles.mbOverflow}>
              <h4 className={`${styles.subHeader} ${styles.text}`}>
                "Shipping address"
              </h4>
              <OrderAddress address={shippingAddress} />
            </div>
            <div className={styles.mbOverflow}>
              <h4 className={`${styles.subHeader} ${styles.text}`}>
                "Shipping method"
              </h4>
              <p className={styles.text}>
                {shippingInfo?.shippingMethodName ||
                  "No shipping method on file."}
              </p>
            </div>
          </div>
          <div>
            <div className={styles.mbOverflow}>
              <h4 className={`${styles.subHeader} ${styles.text}`}>
                "Payment method"
              </h4>
              <p className={styles.text}>
                "Coming soon."
                {/*  TODO: Wire up payment method */}
              </p>
            </div>
            <div className={styles.mbOverflow}>
              <h4 className={`${styles.subHeader} ${styles.text}`}>
                "Billing address"
              </h4>
              <OrderAddress address={billingAddress} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
