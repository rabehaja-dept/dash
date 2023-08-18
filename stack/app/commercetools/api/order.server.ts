import {
  getOrderById as getOrderByIdFromPackage,
  getMyOrdersHistory as getMyOrdersHistoryFromPackage,
  getMyOrderById as getMyOrderByIdFromPackage,
  getOrderByPaymentId as getOrderByPaymentIdFromPackage,
  createOrderFromMyCart as createOrderFromMyCartFromPackage,
  createOrderFromCart as createOrderFromCartFromPackage,
  updateOrder as updateOrderFromPackage,
  addPaymentToOrder as addPaymentToOrderFromPackage,
  changeOrderPaymentState as changeOrderPaymentStateFromPackage,
  changeOrderState as changeOrderStateFromPackage,
  Order,
  Cart,
  OrderUpdateAction,
  MyPayment,
  PaymentState,
  OrderState,
} from "@deptdash/commercetools";
import { requestBuilder } from "./clients/admin.server";
import { getRequestBuilder } from "./clients/web.server";

export const getOrderById = async (orderId: string) => {
  const response = await getOrderByIdFromPackage(requestBuilder, orderId);
  return response;
};

export const getMyOrdersHistory = async (request: Request) => {
  const requestBuilder = getRequestBuilder(request);
  const response = await getMyOrdersHistoryFromPackage(requestBuilder);
  return response;
};

export async function getMyOrderById(
  orderId: string,
  request: Request
): Promise<Order | null> {
  const requestBuilder = await getRequestBuilder(request);
  const response = await getMyOrderByIdFromPackage(requestBuilder, orderId);
  return response;
}

export async function getOrderByPaymentId(paymentId: string) {
  const response = await getOrderByPaymentIdFromPackage(
    requestBuilder,
    paymentId
  );
  return response;
}

export async function createOrderFromMyCart(cart: Cart, request: Request) {
  const webRequestBuilder = await getRequestBuilder(request);
  const response = await createOrderFromMyCartFromPackage(
    webRequestBuilder,
    requestBuilder,
    cart.id
  );
  return response;
}

export function createOrderFromCart({
  cartId,
  cartVersion,
}: {
  cartId: string;
  cartVersion: number;
}) {
  const response = createOrderFromCartFromPackage({
    requestBuilder,
    cartId,
    cartVersion,
  });
  return response;
}

export function updateOrder({
  ID,
  version,
  actions,
}: {
  ID: string;
  version: number;
  actions: OrderUpdateAction[];
}) {
  const response = updateOrderFromPackage({
    requestBuilder,
    ID,
    version,
    actions,
  });
  return response;
}

export async function addPaymentToOrder(
  orderId: string,
  payment: MyPayment,
  request: Request
) {
  const webRequestBuilder = await getRequestBuilder(request);
  const response = await addPaymentToOrderFromPackage(
    webRequestBuilder,
    requestBuilder,
    orderId,
    payment
  );
  return response;
}

export const changeOrderPaymentState = async (
  orderId: string,
  paymentState: PaymentState
) => {
  const response = await changeOrderPaymentStateFromPackage(
    requestBuilder,
    orderId,
    paymentState
  );
  return response;
};

export const changeOrderState = async (
  orderId: string,
  orderState: OrderState
) => {
  const response = await changeOrderStateFromPackage(
    requestBuilder,
    orderId,
    orderState
  );

  return response;
};
