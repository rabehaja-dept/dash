import { allProducts } from "~/shopify";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { i18n } from "~/i18n.server";
import type { Collection } from "@shopify/hydrogen/dist/esnext/storefront-api-types";

import { ProductCard } from "~/shopify/components/ProductCard";

export const meta: MetaFunction = () => {
  return {
    title: "Shopify",
    description: "Check out our products!",
  };
};

interface LoaderData {
  products: Collection[];
}

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const locale = await i18n.getLocale(request);
  const products = await allProducts(locale);
  return { products };
};

export default function Store() {
  const { products } = useLoaderData<LoaderData>();

  return (
    <section className="m-10">
      <div className="my-6">
        <h2>Product Page Title</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu nisl
          quis nisl
        </p>
      </div>
      <div className="mt-12 grid gap-4 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product: Collection) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
