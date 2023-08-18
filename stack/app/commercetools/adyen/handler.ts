import { NotificationRequestItem } from "@adyen/api-library/lib/src/typings/notification/notificationRequestItem";
import { Notification } from "@adyen/api-library/lib/src/typings/notification/notification";
import { Cart, Order, Payment } from "@commercetools/platform-sdk";
import {
  getCartByPaymentId,
  isCartStateOrderedWithAdyen,
} from "../api/cart.server";
import { getPaymentByKey, updatePayment } from "../api/payment.server";
import { validateResponseLength } from "./utils";
import {
  collectOrderUpdateActions,
  collectPaymentUpdateActions,
} from "./notification";
import {
  createOrderFromCart,
  getOrderByPaymentId,
  updateOrder,
} from "../api/order.server";
import { reversePaymentRequest } from "./refund";
import { infoLogger } from "~/utils/LogUtils";
import { LogDictionary } from "~/utils/log-dictionary";

export async function handler(payload: Notification) {
  for (const item of payload.notificationItems) {
    const notification = item.NotificationRequestItem;
    const payment = await getPaymentByKey(notification.merchantReference);

    if (!payment || !payment.key) {
      throw new Error(
        `CT payment with key '${notification.merchantReference}' was not found.`
      );
    }

    if (
      notification.eventCode.toString() === "AUTHORISATION" ||
      notification.eventCode.toString() === "CAPTURE"
    ) {
      console.log(
        ">>> ADYEN event captured ",
        notification.eventCode.toString()
      );
      infoLogger({
        body: notification,
        code: "CTAY003",
        message: LogDictionary.CTAY003,
      });
      try {
        const cartResponse = await getCartByPaymentId(payment.id);

        if (!validateResponseLength(cartResponse)) {
          throw new Error(
            `There was an error related to CT payment with ID ${payment.id}. Please verify if its linked with one cart, and one cart only`
          );
        }

        const cart: Cart = cartResponse.results[0];

        const cartStateOrdered = await isCartStateOrderedWithAdyen(
          cart.cartState,
          cart.paymentInfo?.payments,
          payment,
          notification
        );

        if (cartStateOrdered) return;

        if (
          (cart.taxedPrice?.totalGross.centAmount ||
            cart.totalPrice.centAmount) !== notification.amount.value
        ) {
          throw new Error(
            `Cart price mismatch: Actual total price is ${
              cart.taxedPrice?.totalGross.centAmount ||
              cart.totalPrice.centAmount
            } and Adyen's price is ${notification.amount.value}.`
          );
        }

        await internalUpdatePayment(payment, notification);
        await internalCreateOrderFromCart(notification, cart, payment);
      } catch (error) {
        console.log("CT Auto Refunding initiated due to error");
        const makeAdyenRefundRequestResponse = await reversePaymentRequest(
          payment,
          notification
        );

        console.log("Adyen Refund response :", makeAdyenRefundRequestResponse);

        return;
      }
    } else if (CHARGEBACK_EVENTS.includes(notification.eventCode.toString())) {
      console.log(">>> ADYEN Chargeback event captured ");
      infoLogger({
        body: notification,
        code: "CTAY003",
        message: LogDictionary.CTAY003,
      });
      await internalUpdatePayment(payment, notification);
    } else {
      console.log(
        ">>> ADYEN event captured",
        notification.eventCode.toString()
      );
      infoLogger({
        body: notification,
        code: "CTAY003",
        message: LogDictionary.CTAY003,
      });
      await internalUpdateOrder(notification, payment);
      await internalUpdatePayment(payment, notification);
    }
  }

  return {
    body: "Notification Processed",
  };
}

async function internalUpdatePayment(
  payment: Payment,
  notification: NotificationRequestItem
) {
  const paymentUpdateActions = collectPaymentUpdateActions(
    payment,
    notification
  );

  await updatePayment(payment.id, payment.version, paymentUpdateActions);
}

async function internalCreateOrderFromCart(
  notification: NotificationRequestItem,
  cart: Cart,
  payment: Payment
) {
  if (
    notification.eventCode.toString().toUpperCase() === "AUTHORISATION" &&
    notification.success.toString().toLowerCase() === "true"
  ) {
    let order: Order | undefined;

    try {
      const orderResponse = await createOrderFromCart({
        cartId: cart.id,
        cartVersion: cart.version,
      });

      order = orderResponse.body;
    } catch (error) {
      console.log("Something failed to create order:", error);
      console.log("CT Auto Refunding Initiated due to an error");
      const makeAdyenRefundRequestResponse = await reversePaymentRequest(
        payment,
        notification
      );
      console.log(
        "Adyen Refund response (makeAdyenRefundRequestResponse) :",
        makeAdyenRefundRequestResponse
      );
      return;
    }

    if (!order) {
      console.log("Order Creation Failed - CT Auto Refunding Initiated");
      const makeAdyenRefundRequestResponse = await reversePaymentRequest(
        payment,
        notification
      );
      console.log("Adyen Refund Response:", makeAdyenRefundRequestResponse);
      return;
    }

    let latestOrderVersion = order.version;
    const orderUpdateActions = collectOrderUpdateActions(notification);

    if (orderUpdateActions) {
      const updatedOrder = await updateOrder({
        ID: order.id,
        version: order.version,
        actions: orderUpdateActions,
      });

      latestOrderVersion = updatedOrder.body.version;
    }

    const paymentsToBeRemoved = order.paymentInfo?.payments.filter(
      (paymentToBeRemoved) => paymentToBeRemoved.id !== payment.id
    );

    if (paymentsToBeRemoved?.length) {
      for (const paymentToBeRemoved of paymentsToBeRemoved) {
        const updatedOrder = await updateOrder({
          ID: order.id,
          version: latestOrderVersion,
          actions: [
            {
              action: "removePayment",
              payment: {
                typeId: "payment",
                id: paymentToBeRemoved.id,
              },
            },
          ],
        });
        latestOrderVersion = updatedOrder.body.version;
      }
    }
  }
}

async function internalUpdateOrder(
  notification: NotificationRequestItem,
  payment: Payment
) {
  const orderResponse = await getOrderByPaymentId(payment.id);

  if (!validateResponseLength(orderResponse)) {
    throw new Error(
      `There was an error related to CT payment with ID ${payment.id}. Please verify if its linked with one order, and one order only`
    );
  }

  const order = orderResponse?.results[0] as Order;

  const storeKey = order.store?.key;
  if (!storeKey) {
    throw new Error(`Order with ID ${order.id} is missing store key.`);
  }

  const orderUpdateActions = collectOrderUpdateActions(notification);

  if (orderUpdateActions) {
    await updateOrder({
      ID: order.id,
      version: order.version,
      actions: orderUpdateActions,
    });
  }
}

export const CHARGEBACK_EVENTS: Array<String> = [
  "CHARGEBACK",
  "SECOND_CHARGEBACK",
  "CHARGEBACK_REVERSED",
  "NOTIFICATION_OF_CHARGEBACK",
];
