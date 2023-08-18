import type { Product } from "@shopify/hydrogen-react/storefront-api-types";
import { allProducts, productQuery } from "~/shopify";
import ProductDetails from "~/shopify/components/ProductDetails";
import { Layout } from "~/shopify/components/layout";

export default function Page({ product }) {
  return (
    <Layout>
      <ProductDetails product={product} />
    </Layout>
  );
}

export async function getStaticProps({ params, locale }) {
  let { slug } = params;
  const { product } = await productQuery(slug, locale);
  return {
    props: {
      product,
    },
  };
}

export async function getStaticPaths() {
  const locale = "en-US";
  const products = await allProducts(locale);

  const paths =
    products.map((product: Product) => ({
      params: {
        slug: product.handle,
      },
    })) ?? [];
  return {
    paths,
    fallback: true,
  };
}
