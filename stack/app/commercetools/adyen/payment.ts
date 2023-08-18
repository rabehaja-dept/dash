import { Customer } from "@commercetools/platform-sdk";
import {
  addPaymentToCart,
  getCartById,
  recalculateCart,
} from "../api/cart.server";
import { handleGetCustomerById } from "../api/customer.server";
import { getEnv } from "~/config";
import { createAdyenSession } from "./session";
import { createPayment } from "../api/payment.server";
import { v4 as uuidv4 } from "uuid";

export async function createPaymentSession(cartId: string) {
  const cart = await getCartById(cartId);

  if (cart.cartState === "Ordered") {
    throw new Error(
      `The cart with id ${cartId} is already in an ordered state. Therefore, the payment session will not be created.`
    );
  }

  const updatedCart = await recalculateCart(cartId, cart.version);

  let customer: Customer;

  if (cart.anonymousId) {
    customer = {
      id: cart.anonymousId,
      authenticationMode: "anonymous",
      email: cart.customerEmail || "",
      isEmailVerified: false,
      addresses: [],
      version: 0,
      createdAt: new Date().toISOString(),
      lastModifiedAt: new Date().toISOString(),
    };
  } else {
    customer = await handleGetCustomerById(updatedCart.customerId ?? "");
  }

  if (!getEnv("ADYEN_MERCHANT_ACCOUNT")) {
    throw new Error(`The Adyen Merchant Account Variable is not set.`);
  }

  // generate reference to be shared by Adyen and CT payment records
  const reference = uuidv4();

  const session = await createAdyenSession(cart, customer, reference);

  const payment = await createPayment(updatedCart, reference);

  const cartWithPayment = await addPaymentToCart(updatedCart, payment);

  return {
    id: session.id,
    session_data: session.sessionData,
    cart_id: cartWithPayment.id,
    cart_version: cartWithPayment.version,
  };
}
