import invariant from "tiny-invariant";
import { productQuery, allProducts } from "~/shopify";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import type {
  Shop,
  Product,
} from "@shopify/hydrogen/dist/esnext/storefront-api-types";
import type { Handle } from "~/@types";

import ProductDetails from "~/shopify/components/ProductDetails";
import { i18n } from "~/i18n.server";
import styles from "react-inner-image-zoom/lib/InnerImageZoom/styles.min.css";
import { SanityDocument } from "~/@types/sanity"; // @dash-remove sanity
import { getProductFromSlug } from "~/sanity/index.server"; // @dash-remove sanity
import PortableText from "~/sanity/components/PortableText"; // @dash-remove sanity

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const handle: Handle = {
  id: "shopify",
  i18n: ["common"],
  getSitemapEntries: async (request: Request) => {
    /**
     *  If you have a lot of products, this may take a while.
     * You may want to limit the number of entries we fetch.
     */
    const locale = await i18n.getLocale(request);
    const products = await allProducts(locale);
    return products.map((product: Product) => ({
      route: "/" + product.handle,
      changefreq: "weekly",
      lastmod: product.updatedAt,
      priority: 0.8,
    }));
  },
};

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
  sanityProduct: SanityDocument; // @dash-remove sanity
}

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<LoaderData> => {
  invariant(params.slug, "expected params.slug");
  const locale = await i18n.getLocale(request);
  const productQueryData = await productQuery(params.slug, locale);
  const sanityProduct = await getProductFromSlug(params.slug); // @dash-remove sanity
  return {
    ...productQueryData,
    sanityProduct, // @dash-remove sanity
  };
};

export default function Store() {
  const {
    product,
    sanityProduct, // @dash-remove sanity
  } = useLoaderData<LoaderData>();

  return (
    <div className="m-10">
      <ProductDetails product={product} />
      {/* @dash-remove-start sanity */}
      {sanityProduct?.body && <PortableText blocks={sanityProduct?.body} />}
      {/* @dash-remove-end */}
    </div>
  );
}
