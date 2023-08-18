import { NotificationRequestItem } from "@adyen/api-library/lib/src/typings/notification/notificationRequestItem";
import { Payment } from "@commercetools/platform-sdk";
import { getEnv } from "~/config";

export async function reversePaymentRequest(
  payment: Payment,
  notification: NotificationRequestItem
) {
  const paymentKey = payment.key ?? "";
  const currencyCode = payment.amountPlanned.currencyCode;
  const amount = notification.amount.value ?? 0;
  const pspReference = notification.pspReference;
  const adyenMerchantAccount = getEnv("ADYEN_MERCHANT_ACCOUNT");

  console.log("Refunding Payment, PSP reference: ", pspReference);

  return makeAdyenRefundRequest(
    paymentKey,
    currencyCode,
    amount,
    pspReference,
    adyenMerchantAccount
  );
}

export async function makeAdyenRefundRequest(
  paymentKey: string,
  currencyCode: string,
  amount: number,
  pspReference: string,
  adyenMerchantAccount: string
) {
  console.log(
    "Adyen Refund Payload: payment key: ",
    paymentKey,
    currencyCode,
    amount,
    pspReference,
    adyenMerchantAccount
  );

  return fetch(
    `https://checkout-test.adyen.com/checkout/v70/payments/${pspReference}/refunds`,
    {
      method: "POST",
      body: JSON.stringify({
        merchantAccount: adyenMerchantAccount,
        reference: paymentKey,
        amount: {
          currency: currencyCode,
          value: amount,
        },
      }),
      headers: {
        "X-API-key": getEnv("ADYEN_API_KEY"),
        "Content-Type": "application/json",
      },
    }
  );
}
