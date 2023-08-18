import {
  getPaymentByKey as getPaymentByKeyFromPackage,
  getPaymentById as getPaymentByIdFromPackage,
  createPayment as createPaymentFromPackage,
  addStripeTransactionToPayment as addStripeTransactionToPaymentFromPackage,
  createStripePaymentInCommercetools as createStripePaymentInCommercetoolsFromPackage,
  updatePayment as updatePaymentFromPackage,
  Cart,
  MyPayment,
  Payment,
  PaymentUpdateAction,
  Stripe,
} from "@deptdash/commercetools";
import { requestBuilder } from "./clients/admin.server";
import { getRequestBuilder } from "./clients/web.server";
import { NextApiRequest, NextApiResponse } from "next";

export async function getPaymentByKey(key: string): Promise<Payment> {
  const response = await getPaymentByKeyFromPackage(requestBuilder, key);
  return response;
}

export async function getPaymentById(paymentId: string) {
  const response = await getPaymentByIdFromPackage(requestBuilder, paymentId);
  return response;
}

export async function createPayment(
  cart: Cart,
  reference: string
): Promise<Payment> {
  const response = await createPaymentFromPackage(
    requestBuilder,
    cart,
    reference
  );
  return response;
}

// @dash-remove-start stripe
export async function addStripeTransactionToPayment(
  paymentType: string,
  paymentId: string,
  paymentIntent: Stripe.PaymentIntent
) {
  const response = await addStripeTransactionToPaymentFromPackage(
    requestBuilder,
    paymentType,
    paymentId,
    paymentIntent
  );
  return response;
}

export async function createStripePaymentInCommercetools({
  req,
  res,
  currencyCode,
  centAmount,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
  currencyCode: string;
  centAmount: number;
}): Promise<MyPayment> {
  const requestBuilder = await getRequestBuilder(req, res);
  const response = createStripePaymentInCommercetoolsFromPackage({
    requestBuilder,
    currencyCode,
    centAmount,
  });
  return response;
}
// @dash-remove-end

export async function updatePayment(
  paymentId: string,
  version: number,
  actions: PaymentUpdateAction[]
) {
  const response = await updatePaymentFromPackage(
    requestBuilder,
    paymentId,
    version,
    actions
  );
  return response;
}
