import { Cart } from "@commercetools/platform-sdk";
import { LoaderFunction, ActionFunction, json } from "@remix-run/node";
import { Outlet, useActionData, useLoaderData } from "@remix-run/react";
import {
  getActiveCart,
  updateCartById,
} from "../commercetools/api/cart.server";
import { CommercetoolsMiniCart } from "~/commercetools/components/MiniCart";
import { MiniCartActivator } from "~/commercetools/components/MiniCartActivator";
import { Nav } from "~/components/layout";
import { i18n } from "~/i18n.server";
import {
  SESSION_TOKEN_KEY,
  createCTSession,
  getSessionToken,
} from "~/commercetools/api/session.server";
import { handleGetAnonymouseToken } from "~/commercetools/api/auth.server";

type LoaderData = {
  locale: string;
  cart: Cart;
};

export const loader: LoaderFunction = async ({ request }) => {
  const locale = await i18n.getLocale(request);
  const cart = await getActiveCart(request);

  if (!cart) {
    throw new Error("Something went wrong loading Commercetools.");
  }

  if (!(await getSessionToken(request))) {
    const anonymousToken = await handleGetAnonymouseToken();

    const cookie = (await createCTSession({
      request,
      key: SESSION_TOKEN_KEY,
      value: JSON.stringify(anonymousToken),
      expiresAt: anonymousToken?.expires_at,
    })) as string;

    return json<LoaderData>(
      {
        locale,
        cart,
      },
      {
        headers: {
          "Set-Cookie": cookie,
        },
      }
    );
  } else {
    return {
      locale,
      cart,
    };
  }
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
export default function Commercetools() {
  const { cart, locale } = useLoaderData<LoaderData>();
  const actionData = useActionData();

  return (
    <>
      <Nav
        sticky={true}
        slot={<MiniCartActivator className="ml-4" cart={actionData || cart} />}
        children={
          <CommercetoolsMiniCart cart={actionData || cart} locale={locale} />
        }
      />
      <Outlet />
    </>
  );
}
