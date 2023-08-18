import {
  MyCartDraft,
  MyCartUpdateAction,
  BaseAddress,
  Cart,
  Payment,
} from "@commercetools/platform-sdk";

import { errorLogger, infoLogger } from "./log-utils/LogUtils";
import { LogDictionary } from "./log-utils/log-dictionary";

async function createCart(
  requestBuilder: any,
  requestData?: MyCartDraft
): Promise<Cart | null> {
  try {
    const response = await requestBuilder
      .me()
      .carts()
      .post({
        body: requestData,
      })
      .execute();

    infoLogger({
      body: response.body,
      code: "CTCR013",
      message: LogDictionary.CTCR013,
    });
    return response.body;
  } catch (error: any) {
    errorLogger({
      reason: error,
      code: "CTCR014",
      message: LogDictionary.CTCR014,
    });
    return null;
  }
}

export async function addToCart(
  cartId: string,
  version: number,
  sku: string,
  requestBuilder: any
) {
  const response = await requestBuilder
    .me()
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version: version,
        actions: [{ action: "addLineItem", sku }],
      },
    })
    .execute()
    .then((rsp) =>
      infoLogger({
        body: rsp.body,
        code: "CTCR003",
        message: LogDictionary.CTCR003,
    })
    )
    .catch((error) =>
      errorLogger({
        reason: error,
        code: "CTCR004",
        message: LogDictionary.CTCR004,
      })
    );

  return response;
}

export async function getActiveCart(
  requestBuilder: any,
  requestData?: MyCartDraft
): Promise<Cart | null> {
  try {
    const response = await requestBuilder.me().activeCart().get().execute();

    infoLogger({
      body: response.body,
      code: "CTCR011",
      message: LogDictionary.CTCR011,
    });

    return response.body;
  } catch (error: any) {
    if (error.statusCode !== 404) {
      errorLogger({
        reason: error,
        code: "CTCR012",
        message: LogDictionary.CTCR012,
      });
      return null;
    } else {
      infoLogger({
        body: error,
        code: "CTCR012",
        message: LogDictionary.CTCR012,
      });

      return await createCart(requestBuilder, requestData);
    }
  }
}

export async function getCartById(
  requestBuilder: any,
  cartId: string
): Promise<Cart> {
  const response = await requestBuilder
    //.me()
    .carts()
    .withId({ ID: cartId })
    .get()
    .execute()
    .then(({ body }) =>
      infoLogger({ body, code: "CTCR005", message: LogDictionary.CTCR005 })
    )
    .catch((error) =>
      errorLogger({
        reason: error,
        code: "CTCR006",
        message: LogDictionary.CTCR006,
      })
    );

  return response;
}

export async function getCartByPaymentId(
  requestBuilder: any,
  paymentId: string
) {
  const response = await requestBuilder
    .carts()
    .get({
      queryArgs: {
        where: `paymentInfo(payments(id="${paymentId}"))`,
        limit: 1,
      },
    })
    .execute()
    .then(({ body }) =>
      infoLogger({ body, code: "CTCR009", message: LogDictionary.CTCR009 })
    )
    .catch((error) =>
      errorLogger({
        reason: error,
        code: "CTCR010",
        message: LogDictionary.CTCR010,
      })
    );

  return response;
}

export async function updateCartById(
  requestBuilder: any,
  cartId: string,
  version: number,
  actions: MyCartUpdateAction[]
) {
  const response = await requestBuilder
    .me()
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version: version,
        actions: actions,
      },
    })
    .execute()
    .then(({ body }) => body);
  return response;
}

export async function addAddressesAndEmailToCart(
  requestBuilder: any,
  cartId: string,
  version: number,
  email: string,
  shippingAddress: BaseAddress,
  billingAddress: BaseAddress
) {
  const response = await requestBuilder
    .me()
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version,
        actions: [
          {
            action: "setShippingAddress",
            address: shippingAddress,
          },
          {
            action: "setBillingAddress",
            address: billingAddress,
          },
          {
            action: "setCustomerEmail",
            email,
          },
        ],
      },
    })
    .execute()
    .then(({ body }) => body);
  return response;
}

export async function addPaymentToCart(
  requestBuilder: any,
  cart: Cart,
  payment: Payment
): Promise<Cart> {
  const response = await requestBuilder
    .carts()
    .withId({ ID: cart.id })
    .post({
      body: {
        version: cart.version,
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
    .execute()
    .then(({ body }) =>
      infoLogger({ body, code: "CTCR001", message: LogDictionary.CTCR001 })
    )
    .catch((error) =>
      errorLogger({
        reason: error,
        code: "CTCR002",
        message: LogDictionary.CTCR002,
      })
    );

  return response;
}

export async function setShippingMethod(
  requestBuilder: any,
  cartId: string,
  shippingMethodId: string
) {
  const cart = await requestBuilder
    .carts()
    .withId({ ID: cartId })
    .get()
    .execute()
    .then(({ body }) => body);

  const response = await requestBuilder
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version: cart.version,
        actions: [
          {
            action: "setShippingMethod",
            shippingMethod: {
              typeId: "shipping-method",
              id: shippingMethodId,
            },
          },
        ],
      },
    })
    .execute()
    .then(({ body }) => body);
  return response;
}

export async function recalculateCart(
  requestBuilder: any,
  cartId: string,
  cartVersion: number
): Promise<Cart> {
  const updateAction: MyCartUpdateAction = {
    action: "recalculate",
    updateProductData: true,
  };

  const response = await requestBuilder
    .carts()
    .withId({ ID: cartId })
    .post({ body: { version: cartVersion, actions: [updateAction] } })
    .execute()
    .then(({ body }) =>
      infoLogger({ body, code: "CTCR007", message: LogDictionary.CTCR007 })
    )
    .catch((error) =>
      errorLogger({
        reason: error,
        code: "CTCR008",
        message: LogDictionary.CTCR008,
      })
    );

  return response;
}
