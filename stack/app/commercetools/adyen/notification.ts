import {
  OrderChangeOrderStateAction,
  OrderChangePaymentStateAction,
  Payment,
} from "@commercetools/platform-sdk";
import { NotificationRequestItem } from "@adyen/api-library/lib/src/typings/notification/notificationRequestItem";
import adyenEventMapping from "./adyen-event-mapping";
import {
  addTransactionAction,
  changeTransactionStateAction,
  setInterfaceIdAction,
  setMethodInfoInterfaceAction,
  setMethodInfoMethodAction,
  setMethodInfoNameAction,
  setStatusInterfaceCodeAction,
  setStatusInterfaceTextAction,
} from "./update-actions";

export function collectPaymentUpdateActions(
  payment: Payment,
  notification: NotificationRequestItem
) {
  const updateActions = [];

  const { transactionType, transactionState } = mapAdyenEventToCt(notification);

  if (transactionType && transactionState) {
    const { pspReference } = notification;
    //Check for Old Transactions
    const oldTransaction = payment.transactions.find(
      (transaction) => transaction.interactionId === pspReference
    );
    const { value, currency } = notification.amount;

    //Add Transaction to Payment
    if (!oldTransaction && value !== undefined && currency) {
      updateActions.push(
        addTransactionAction(
          transactionType,
          transactionState,
          value,
          currency,
          pspReference
        )
      );
    } else if (
      oldTransaction?.state &&
      compareTransactionStates(oldTransaction.state, transactionState) > 0
    ) {
      updateActions.push(
        changeTransactionStateAction(oldTransaction.id, transactionState)
      );
    }
  }

  //Set Interface Id
  if (!payment.interfaceId) {
    updateActions.push(setInterfaceIdAction(notification.merchantReference));
  }

  //Set Method Interface
  if (!payment.paymentMethodInfo?.paymentInterface) {
    updateActions.push(setMethodInfoInterfaceAction());
  }

  //Set Status Interface Text
  if (notification.pspReference && !payment.paymentStatus.interfaceText) {
    updateActions.push(setStatusInterfaceTextAction(notification.pspReference));
  }

  //Set Interface Code
  if (notification.eventCode) {
    updateActions.push(
      setStatusInterfaceCodeAction(notification.eventCode.toString())
    );
  }

  const paymentMethodFromPayment = payment.paymentMethodInfo.method;
  const paymentMethodFromNotification = notification.paymentMethod;

  //Validate that payment method is not set in payment
  if (
    paymentMethodFromNotification &&
    paymentMethodFromPayment !== paymentMethodFromNotification
  ) {
    //Set Payment Method
    updateActions.push(
      setMethodInfoMethodAction(paymentMethodFromNotification)
    );
    //Check for Payment Method Info Name
    const action = setMethodInfoNameAction(paymentMethodFromNotification);

    if (action) {
      updateActions.push(action);
    }
  }

  return updateActions;
}

export function mapAdyenEventToCt(
  notificationRequestItem: NotificationRequestItem
) {
  const adyenEventCode = notificationRequestItem.eventCode;
  const adyenEventSuccess = notificationRequestItem.success;

  const adyenEvent = adyenEventMapping.find(
    (e) =>
      e.eventCode === adyenEventCode.toString() &&
      e.success === adyenEventSuccess.toString()
  );

  if (adyenEvent && adyenEventCode.toString() === "CANCEL_OR_REFUND") {
    const modificationAction =
      notificationRequestItem.additionalData?.["modification.action"] ?? null;
    if (modificationAction === "refund") {
      adyenEvent.transactionType = "Refund";
    } else if (modificationAction === "cancel") {
      adyenEvent.transactionType = "CancelAuthorization";
      adyenEvent.orderState = "Cancelled";
    }
  }
  return (
    adyenEvent || {
      eventCode: adyenEventCode,
      success: adyenEventSuccess,
      transactionType: null,
      transactionState: null,
      orderState: null,
      paymentState: null,
    }
  );
}

/**
 * 1 if transactionStateOnAdyen can appear after transactionStateOnCT
 * -1 if transactionStateOnAdyen cannot appear after transactionStateOnCT
 * 0 if transactionStateOnAdyen is the same as transactionStateOnCT
 * Error when transactionStateOnAdyen and/or transactionStateOnCT is a wrong transaction state
 * */
export const compareTransactionStates = (
  transactionStateOnCT: string,
  transactionStateOnAdyen: string
) => {
  const transactionStateFlow: { [key: string]: number } = {
    Initial: 0,
    Pending: 1,
    Success: 2,
    Failure: 2,
  };
  if (
    !(transactionStateOnCT in transactionStateFlow) ||
    !(transactionStateOnAdyen in transactionStateFlow)
  ) {
    const errorMessage = `Wrong transaction state passed. Transaction State on CT: ${transactionStateOnCT}, Transaction State on Adyen: ${transactionStateOnAdyen}`;
    throw new Error(errorMessage);
  }
  return (
    transactionStateFlow[transactionStateOnAdyen] -
    transactionStateFlow[transactionStateOnCT]
  );
};

export const collectOrderUpdateActions = (
  notification: NotificationRequestItem
) => {
  const { orderState, paymentState } = mapAdyenEventToCt(notification);
  const updateActions = [];

  if (orderState) {
    updateActions.push({
      action: "changeOrderState",
      orderState: orderState,
    } as OrderChangeOrderStateAction);
  }

  if (paymentState) {
    updateActions.push({
      action: "changePaymentState",
      paymentState: paymentState,
    } as OrderChangePaymentStateAction);
  }

  return updateActions;
};
