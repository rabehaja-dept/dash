import invariant from "tiny-invariant";
import { productQuery } from "~/shopify";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import type {
  Shop,
  Product,
} from "@shopify/hydrogen/dist/esnext/storefront-api-types";

import ProductWizard from "~/shopify/components/wizard/ProductWizard";
import { i18n } from "~/i18n.server";

import styles from "react-inner-image-zoom/lib/InnerImageZoom/styles.min.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = ({
  data,
}: {
  data: LoaderData | undefined;
}) => {
  if (!data) {
    return {
      title: "No product found",
      description: "No product found",
    };
  }

  const imageUrl = data.product.variants?.nodes[0]?.image?.url;
  const description = data.product.description;
  const title = data.product.title;

  return {
    title,
    description,
    "twitter:title": title,
    "twitter:card": "summary_large_image",
    "twitter:image": imageUrl,
    "twitter:description": description,
    "og:title": title,
    "og:image": imageUrl,
    "og:type": "product.item",
    "og:description": description,
  };
};

interface LoaderData {
  product: Product;
  shop: Shop;
}

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<LoaderData> => {
  invariant(params.slug, "expected params.slug");
  const locale = await i18n.getLocale(request);
  const productQueryData = await productQuery(params.slug, locale);
  return productQueryData;
};

export default function Store() {
  const { product } = useLoaderData<LoaderData>();

  return (
    <div className="m-10">
      <ProductWizard product={product} />
    </div>
  );
}
