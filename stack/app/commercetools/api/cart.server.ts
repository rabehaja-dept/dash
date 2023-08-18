import { NotificationRequestItem } from "@adyen/api-library/lib/src/typings/notification/notificationRequestItem"; // @dash-remove adyen
import {
  MyCartDraft,
  MyCartUpdateAction,
  BaseAddress,
  Cart,
  Payment,
  CartState,
  PaymentReference,
} from "@commercetools/platform-sdk";
import { reversePaymentRequest } from "../adyen/refund"; // @dash-remove adyen

import { requestBuilder } from "./clients/admin.server";
import { getRequestBuilder } from "./clients/web.server";

import { defaultCurrencyCode } from "~/i18n-config";
import {
  addToCart as addToCartFromPackage,
  getActiveCart as getActiveCartFromPackage,
  getCartById as getCartByIdFromPackage,
  getCartByPaymentId as getCartByPaymentIdFromPackage,
  updateCartById as updateCartByIdFromPackage,
  addAddressesAndEmailToCart as addAddressesAndEmailToCartFromPackage,
  addPaymentToCart as addPaymentToCartFromPackage,
  setShippingMethod as setShippingMethodFromPackage,
  recalculateCart as recalculateCartFromPackage,
} from "@deptdash/commercetools";

export async function addToCart(
  cartId: string,
  version: number,
  sku: string,
  request: Request
) {
  const requestBuilder = await getRequestBuilder(request);
  const response = await addToCartFromPackage(
    cartId,
    version,
    sku,
    requestBuilder
  );
  return response;
}

export async function getActiveCart(
  request: Request,
  data?: MyCartDraft
): Promise<Cart | null> {
  /**
   * TODO: This hard-codes the currency to the default currency code.
   * We should dynamically set this based on the currencies available
   * in the store and the user's locale.
   */
  const requestData = data
    ? data
    : ({ currency: defaultCurrencyCode } as MyCartDraft);
  const requestBuilder = await getRequestBuilder(request);
  const response = await getActiveCartFromPackage(requestBuilder, requestData);
  return response;
}

export async function getCartById(cartId: string): Promise<Cart> {
  const response = await getCartByIdFromPackage(requestBuilder, cartId);
  return response;
}

export async function getCartByPaymentId(paymentId: string) {
  const response = await getCartByPaymentIdFromPackage(
    requestBuilder,
    paymentId
  );
  return response;
}

export async function updateCartById(
  cartId: string,
  version: number,
  actions: MyCartUpdateAction[],
  request: Request
) {
  const requestBuilder = await getRequestBuilder(request);
  const response = await updateCartByIdFromPackage(
    requestBuilder,
    cartId,
    version,
    actions
  );
  return response;
}

export async function addAddressesAndEmailToCart(
  cartId: string,
  version: number,
  email: string,
  shippingAddress: BaseAddress,
  billingAddress: BaseAddress,
  request: Request
) {
  const requestBuilder = await getRequestBuilder(request);
  const response = await addAddressesAndEmailToCartFromPackage(
    requestBuilder,
    cartId,
    version,
    email,
    shippingAddress,
    billingAddress
  );
  return response;
}

export async function addPaymentToCart(
  cart: Cart,
  payment: Payment
): Promise<Cart> {
  const response = await addPaymentToCartFromPackage(
    requestBuilder,
    cart,
    payment
  );
  return response;
}

export async function setShippingMethod(
  cartId: string,
  shippingMethodId: string
) {
  const response = await setShippingMethodFromPackage(
    requestBuilder,
    cartId,
    shippingMethodId
  );
  return response;
}

export async function recalculateCart(
  cartId: string,
  cartVersion: number
): Promise<Cart> {
  const response = await recalculateCartFromPackage(
    requestBuilder,
    cartId,
    cartVersion
  );
  return response;
}

// @dash-remove-start adyen
export async function isCartStateOrderedWithAdyen(
  cartState: CartState,
  orderPayments: PaymentReference[] | undefined,
  payment: Payment | undefined,
  notification: NotificationRequestItem | undefined
): Promise<boolean> {
  if (cartState !== "Ordered") return false;

  if (orderPayments && payment && notification && orderPayments.length > 1) {
    // Initiate auto refund as there was already a payment received for this cart.
    console.log(
      "Skipping and auto refunding current payment since the order was already created and paid."
    );

    const makeAdyenRefundRequestResponse = await reversePaymentRequest(
      payment,
      notification
    );
    console.log("Adyen Refund response :", makeAdyenRefundRequestResponse);
  } else {
    console.log("Skipping as Order is already created from this cart");
  }

  return true;
}
// @dash-remove-end
