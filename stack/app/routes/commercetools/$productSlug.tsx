import { getAllProducts, getProduct } from "~/commercetools/api/product.server";
import type { Handle } from "~/@types";

import { i18n } from "~/i18n.server";
import styles from "react-inner-image-zoom/lib/InnerImageZoom/styles.min.css";
import {
  Cart,
  Customer,
  ProductProjection,
  ProductVariant,
} from "@commercetools/platform-sdk";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/server-runtime";
import { ProductDetails } from "./components/ProductDetails";
import { addToCart, getActiveCart } from "~/commercetools/api/cart.server";
import { ActionFunction } from "@remix-run/node";
import { handleGetCurrentCustomer } from "~/commercetools/api/customer.server";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const handle: Handle = {
  id: "commercetools",
  i18n: ["common"],
  getSitemapEntries: async (request: Request) => {
    /**
     *  If you have a lot of products, this may take a while.
     * You may want to limit the number of entries we fetch.
     */
    const locale = await i18n.getLocale(request);
    const products = await getAllProducts(locale);

    return products.map((product: ProductProjection) => ({
      route: "/" + product.slug,
      changefreq: "weekly",
      lastmod: product.lastModifiedAt,
      priority: 0.8,
    }));
  },
};
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const addToCartAction = form.get("addToCartAction");
  const { activeVariant, id, version } = JSON.parse(addToCartAction as string);
  const variant = activeVariant as ProductVariant;
  return await addToCart(id, version, variant?.sku ? variant.sku : "", request);
};

interface LoaderData {
  product?: ProductProjection;
  locale: string;
  cart: Cart;
  customer: Customer | null;
}

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<LoaderData> => {
  const locale = await i18n.getLocale(request);
  const product = await getProduct(params.productSlug!, locale);
  const cart = await getActiveCart(request);
  const customer = await handleGetCurrentCustomer(request);

  if (!cart) {
    throw new Error("Something went wrong loading Commercetools.");
  }

  return {
    product: product.length ? product[0] : undefined,
    locale,
    cart,
    customer,
  };
};

export default function Store() {
  const { product, locale, cart, customer } = useLoaderData() as LoaderData;

  if (!product) {
    return (
      <div className="my-16">
        <h2 className="text-title-md">This product doesn't exist</h2>
      </div>
    );
  }

  return (
    <ProductDetails
      product={product}
      locale={locale}
      cart={cart}
      customer={customer}
    />
  );
}
