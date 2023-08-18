import type { MetaFunction } from "@remix-run/node";
import { getActiveCart, updateCartById } from "~/commercetools/api/cart.server";
import Cart from "~/commercetools/components/Cart";
import { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { useActionData, useLoaderData } from "@remix-run/react";
import { i18n } from "~/i18n.server";
import { Cart as CartType } from "@commercetools/platform-sdk";

export const meta: MetaFunction = () => ({
  title: "Your Cart",
  description: "Purchase your products.",
});

interface LoaderData {
  cart: CartType;
  locale: string;
}

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const locale = await i18n.getLocale(request);
  const cart = await getActiveCart(request);

  if (!cart) {
    throw new Error("Something went wrong loading Commercetools.");
  }

  return {
    cart,
    locale,
  };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  // delete lineItem in cart
  if (form.get("remove")) {
    const remove = form.get("remove");
    const { lineId, cartId, cartVersion } = JSON.parse(remove as string);

    return await updateCartById(
      cartId,
      cartVersion,
      [
        {
          action: "removeLineItem",
          lineItemId: lineId,
        },
      ],
      request
    );
  }

  // change quantity of lineItem in cart
  if (form.get("quantity")) {
    const quantityChange = form.get("quantity");
    const { lineId, cartId, cartVersion, quantity } = JSON.parse(
      quantityChange as string
    );

    return await updateCartById(
      cartId,
      cartVersion,
      [
        {
          action: "changeLineItemQuantity",
          lineItemId: lineId,
          quantity: quantity,
        },
      ],
      request
    );
  }

  return null;
};

export default function CartRoute() {
  const { cart, locale } = useLoaderData();
  const actionData = useActionData();

  return (
    <section className="mx-10 my-10">
      <Cart data={actionData || cart} locale={locale} />
    </section>
  );
}
