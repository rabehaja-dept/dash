import {
  MyPayment,
  Order,
  OrderState,
  OrderUpdateAction,
  PaymentState,
} from "@commercetools/platform-sdk";
import { errorLogger, infoLogger } from "./log-utils/LogUtils";
import { LogDictionary } from "./log-utils/log-dictionary";

export const getOrderById = async (requestBuilder: any, orderId: string) => {
  return requestBuilder
    .orders()
    .withId({ ID: orderId })
    .get()
    .execute()
    .then((response) => response.body);
};

export const getMyOrdersHistory = async (requestBuilder: any) => {
  return requestBuilder
    .me()
    .orders()
    .get({ queryArgs: { sort: "createdAt desc" } })
    .execute()
    .then((response) =>
      infoLogger({
        body: response?.body?.results,
        code: "CTMO002",
        message: LogDictionary.CTMO002,
      })
    )
    .catch((error) =>
      errorLogger({
        reason: error,
        code: "CTMO001",
        message: LogDictionary.CTMO001,
      })
    );
};

export async function getMyOrderById(
  requestBuilder: any,
  orderId: string,
): Promise<Order | null> {
  try {
    const response = await requestBuilder
      .me()
      .orders()
      .withId({ ID: orderId })
      .get()
      .execute();

    return response.body;
  } catch (error: any) {
    errorLogger({
      reason: error,
      code: "CTMO003",
      message: LogDictionary.CTMO003,
    });
    return null;
  }
}

export async function getOrderByPaymentId(
  requestBuilder: any,
  paymentId: string
) {
  const response = await requestBuilder
    .orders()
    .get({
      queryArgs: {
        where: `paymentInfo(payments(id="${paymentId}"))`,
        expand: ["lineItems[*].state[*].state.id", "paymentInfo.payments[*]"],
      },
    })
    .execute()
    .then(({ body }) => body)
    .catch((error) => console.log(error));

  return response;
}

export async function createOrderFromMyCart(
  webRequestBuilder: any,
  requestBuilder: any,
  cartId: any
) {
  try {
    const currentCart = await webRequestBuilder
      .me()
      .carts()
      .withId({ ID: cartId })
      .get()
      .execute()
      .then(({ body }) => body);

    const response = await requestBuilder
      .orders()
      .post({
        body: {
          id: currentCart.id,
          version: currentCart.version,
        },
      })
      .execute()
      .then(({ body }) => body);

    return response;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function createOrderFromCart({
  requestBuilder,
  cartId,
  cartVersion,
}: {
  requestBuilder: any;
  cartId: string;
  cartVersion: number;
}) {
  return requestBuilder
    .orders()
    .post({
      body: {
        id: cartId,
        version: cartVersion,
      },
    })
    .execute();
}

export function updateOrder({
  requestBuilder,
  ID,
  version,
  actions,
}: {
  requestBuilder: any;
  ID: string;
  version: number;
  actions: OrderUpdateAction[];
}) {
  return requestBuilder
    .orders()
    .withId({ ID })
    .post({
      body: { version, actions },
      queryArgs: {
        expand: ["lineItems[*].state[*].state.id", "paymentInfo.payments[*]"],
      },
    })
    .execute();
}

export async function addPaymentToOrder(
  webRequestBuilder: any,
  requestBuilder: any,
  orderId: string,
  payment: MyPayment,
) {
  try {
    const order = await getMyOrderById(webRequestBuilder, orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    const response = await requestBuilder
      .orders()
      .withId({ ID: orderId })
      .post({
        body: {
          version: order.version,
          actions: [
            {
              action: "addPayment",
              payment: {
                typeId: "payment",
                id: payment.id,
              },
            },
          ],
        },
      })
      .execute();

    return response.body;
  } catch (error: any) {
    errorLogger({
      reason: error,
      code: "CTPY004",
      message: LogDictionary.CTPY004,
    });
    return null;
  }
}

export const changeOrderPaymentState = async (
  requestBuilder: any,
  orderId: string,
  paymentState: PaymentState
) => {
  const order = await getOrderById(requestBuilder, orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  const response = await requestBuilder
    .orders()
    .withId({ ID: orderId })
    .post({
      body: {
        version: order.version,
        actions: [
          {
            action: "changePaymentState",
            paymentState,
          },
        ],
      },
    })
    .execute()
    .then(({ body }) => body);

  return response;
};

export const changeOrderState = async (
  requestBuilder: any,
  orderId: string,
  orderState: OrderState
) => {
  const order = await getOrderById(requestBuilder, orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  const response = await requestBuilder
    .orders()
    .withId({ ID: orderId })
    .post({
      body: {
        version: order.version,
        actions: [
          {
            action: "changeOrderState",
            orderState,
          },
        ],
      },
    })
    .execute()
    .then(({ body }) => body);

  return response;
};
