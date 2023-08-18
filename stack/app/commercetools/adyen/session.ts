import { getEnv } from "~/config";
import { AccountInfo } from "@adyen/api-library/lib/src/typings/checkout/accountInfo";
import { getAccountAgeAndChangeIndicator } from "./utils";
import { Cart, Customer } from "@commercetools/platform-sdk";
import { CreateCheckoutSessionRequest } from "@adyen/api-library/lib/src/typings/checkout/createCheckoutSessionRequest";
import { LogDictionary } from "~/utils/log-dictionary";
import { errorLogger, infoLogger } from "~/utils/LogUtils";
import fetch from "node-fetch";

export async function createAdyenSession(
  cart: Cart,
  customer: Customer,
  uniqueRef: string
) {
  const { taxedPrice, totalPrice, billingAddress } = cart;

  const amountParam = {
    currency: taxedPrice?.totalGross.currencyCode || totalPrice.currencyCode,
    value: taxedPrice?.totalGross.centAmount || totalPrice.centAmount,
  };

  const accountInfoParam: AccountInfo = {
    accountAgeIndicator: getAccountAgeAndChangeIndicator(
      Date.parse(customer.createdAt)
    ) as unknown as AccountInfo.AccountAgeIndicatorEnum,
    accountChangeDate: new Date(customer.lastModifiedAt),
    accountChangeIndicator: getAccountAgeAndChangeIndicator(
      Date.parse(customer.lastModifiedAt)
    ) as unknown as AccountInfo.AccountChangeIndicatorEnum,
    accountCreationDate: new Date(customer.createdAt),
  };

  const billingAddressParam = {
    city: billingAddress?.city || "",
    country: billingAddress?.country || "",
    houseNumberOrName: billingAddress?.streetNumber || "",
    postalCode: billingAddress?.postalCode || "",
    stateOrProvince: billingAddress?.state || "",
    street: billingAddress?.streetName || "",
  };

  const params: CreateCheckoutSessionRequest = {
    merchantAccount: getEnv("ADYEN_MERCHANT_ACCOUNT"),
    amount: amountParam,
    returnUrl: `${getEnv(
      "PUBLICLY_AVAILABLE_ORIGIN"
    )}/commercetools/orders/adyen/${uniqueRef}`,
    reference: uniqueRef,
    shopperReference: customer.id,
    shopperLocale: "",
    shopperEmail: cart.billingAddress?.email,
    shopperIP: "",
    countryCode: cart.billingAddress?.country || "",
    accountInfo: accountInfoParam,
    billingAddress: billingAddressParam,
  };

  try {
    const response = await fetch(
      `${getEnv("ADYEN_BASE_URL")}/checkout/v70/sessions`,
      {
        method: "POST",
        body: JSON.stringify(params),
        headers: {
          "content-type": "application/json",
          "X-API-Key": getEnv("ADYEN_API_KEY"),
        },
      }
    );
    const session = await response.json();
    return infoLogger({
      body: session,
      code: "CTAY001",
      message: LogDictionary.CTAY001,
    });
  } catch (e: any) {
    errorLogger({ reason: e, code: "CTAY002", message: LogDictionary.CTAY002 });
  }
}
