import {
  Cart,
  MyPayment,
  Payment,
  PaymentDraft,
  PaymentUpdateAction,
} from "@commercetools/platform-sdk";
import Stripe from "stripe";
import { LogDictionary } from "./log-utils/log-dictionary";

export async function getPaymentByKey(
  requestBuilder: any,
  key: string
): Promise<Payment> {
  const response = await requestBuilder
    .payments()
    .withKey({ key: key })
    .get()
    .execute()
    .then(({ body }) =>
      infoLogger({ body, code: "CTPY005", message: LogDictionary.CTPY005 })
    )
    .catch((error) =>
      errorLogger({
        reason: error,
        code: "CTPY006",
        message: LogDictionary.CTPY006,
      })
    );

  return response;
}

export async function getPaymentById(requestBuilder: any, paymentId: string) {
  const response = await requestBuilder
    .payments()
    .withId({ ID: paymentId })
    .get()
    .execute()
    .then(({ body }) => body);
  return response;
}

export async function createPayment(
  requestBuilder: any,
  cart: Cart,
  reference: string
): Promise<Payment> {
  const paymentDraft: PaymentDraft = {
    key: reference,
    amountPlanned: {
      currencyCode:
        cart.taxedPrice?.totalGross.currencyCode ||
        cart.totalPrice.currencyCode,
      centAmount:
        cart.taxedPrice?.totalGross.centAmount || cart.totalPrice.centAmount,
    },
  };

  const response = await requestBuilder
    .payments()
    .post({ body: paymentDraft })
    .execute()
    .then(({ body }) =>
      infoLogger({ body, code: "CTPY001", message: LogDictionary.CTPY001 })
    )
    .catch((error) =>
      errorLogger({
        reason: error,
        code: "CTPY002",
        message: LogDictionary.CTPY002,
      })
    );

  return response;
}

// @dash-remove-start stripe
export async function addStripeTransactionToPayment(
  requestBuilder: any,
  paymentType: string,
  paymentId: string,
  paymentIntent: Stripe.PaymentIntent
) {
  let paymentState = "Pending";

  if (paymentType == "Charge" || paymentType == "Refund") {
    paymentState = "Success";
  }

  if (paymentType == "CancelAuthorization") {
    paymentState = "Failure";
  }

  const existingPayment = await getPaymentById(requestBuilder, paymentId);

  const response = await requestBuilder
    .payments()
    .withId({ ID: existingPayment.id })
    .post({
      body: {
        version: existingPayment.version,
        actions: [
          {
            action: "addTransaction",
            transaction: {
              type: paymentType, // Authorization, CancelAuthorization, Charge, Refund, Chargeback
              state: paymentState, // Initial, Pending, Success, Failure
              amount: {
                currencyCode: paymentIntent.currency.toUpperCase(),
                centAmount: paymentIntent.amount,
              },
            },
          },
        ],
      },
    })
    .execute()
    .then(({ body }) => body);
  return response;
}

export async function createStripePaymentInCommercetools({
  requestBuilder,
  currencyCode,
  centAmount,
}: {
  requestBuilder: any;
  currencyCode: string;
  centAmount: number;
}): Promise<MyPayment> {
  const response = requestBuilder
    .me()
    .payments()
    .post({
      body: {
        paymentMethodInfo: {
          paymentInterface: "stripe",
          method: "card", // Assumes that the payment method is a card
        },
        amountPlanned: {
          type: "centPrecision",
          currencyCode,
          centAmount,
        },
      },
    })
    .execute()
    .then(({ body }) => body);
  return response;
}
// @dash-remove-end stripe

export async function updatePayment(
  requestBuilder: any,
  paymentId: string,
  version: number,
  actions: PaymentUpdateAction[]
) {
  const response = await requestBuilder
    .payments()
    .withId({ ID: paymentId })
    .post({ body: { version, actions } })
    .execute()
    .then(({ body }) =>
      infoLogger({ body, code: "CTPY003", message: LogDictionary.CTPY003 })
    )
    .catch((error) =>
      errorLogger({
        reason: error,
        code: "CTPY004",
        message: LogDictionary.CTPY004,
      })
    );

  return response;
}
function infoLogger(arg0: { body: any; code: string; message: any }) {
  throw new Error("Function not implemented.");
}

function errorLogger(arg0: { reason: any; code: string; message: any }) {
  throw new Error("Function not implemented.");
}
