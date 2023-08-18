import {
  PaymentAddTransactionAction,
  PaymentChangeTransactionStateAction,
  PaymentSetInterfaceIdAction,
  PaymentSetMethodInfoInterfaceAction,
  PaymentSetMethodInfoMethodAction,
  PaymentSetMethodInfoNameAction,
  PaymentSetStatusInterfaceCodeAction,
  PaymentSetStatusInterfaceTextAction,
  TransactionState,
  TransactionType,
} from "@commercetools/platform-sdk";
import { getEnv } from "~/config";

export const addTransactionAction = (
  type: TransactionType,
  state: TransactionState | undefined,
  centAmount: number,
  currency: string,
  interactionId?: string
): PaymentAddTransactionAction => {
  return {
    action: "addTransaction",
    transaction: {
      timestamp: new Date().toISOString(),
      type,
      amount: {
        currencyCode: currency,
        centAmount,
      },
      state,
      interactionId,
    },
  };
};

export const changeTransactionStateAction = (
  transactionId: string,
  newTransactionState: TransactionState
): PaymentChangeTransactionStateAction => {
  return {
    action: "changeTransactionState",
    transactionId,
    state: newTransactionState,
  };
};

export const setInterfaceIdAction = (
  interfaceId: string
): PaymentSetInterfaceIdAction => {
  return {
    action: "setInterfaceId",
    interfaceId,
  };
};

export const setMethodInfoInterfaceAction =
  (): PaymentSetMethodInfoInterfaceAction => {
    return {
      action: "setMethodInfoInterface",
      interface: "Adyen",
    };
  };

export const setStatusInterfaceTextAction = (
  pspReference: string
): PaymentSetStatusInterfaceTextAction => {
  const adyenEnv =
    `${getEnv("ADYEN_ENVIRONMENT")}` === "LIVE" ? "ca-live" : "ca-test";
  return {
    action: "setStatusInterfaceText",
    interfaceText: `https://${adyenEnv}.adyen.com/ca/ca/accounts/showTx.shtml?pspReference=${pspReference}&txType=Payment`,
  };
};

export const setStatusInterfaceCodeAction = (
  interfaceCode: string
): PaymentSetStatusInterfaceCodeAction => {
  return {
    action: "setStatusInterfaceCode",
    interfaceCode,
  };
};

export const setMethodInfoMethodAction = (
  paymentMethod: string
): PaymentSetMethodInfoMethodAction => {
  return {
    action: "setMethodInfoMethod",
    method: paymentMethod,
  };
};

export const setMethodInfoNameAction = (
  paymentMethod: string
): PaymentSetMethodInfoNameAction | undefined => {
  // https://docs.adyen.com/payment-methods#credit-and-debit-cards => check "paymentMethod.type" column
  const localizedPaymentMethods: {
    [key: string]: { [key: string]: string };
  } = {
    scheme: { en: "Credit Card" },
    visa: { en: "Credit Card" },
    mc: { en: "Credit Card" },
    amex: { en: "Credit Card" },
    paypal: { en: "PayPal" },
    dotpay: { en: "Polish online banking" },
  };
  const paymentMethodLocalizedNames = localizedPaymentMethods[paymentMethod];
  if (paymentMethodLocalizedNames) {
    return {
      action: "setMethodInfoName",
      name: paymentMethodLocalizedNames,
    };
  }
};
