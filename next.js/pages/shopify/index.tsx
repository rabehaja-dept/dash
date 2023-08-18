import { allProducts } from "~/shopify";
import { ProductListingPage } from "~/shopify/components/ProductListingPage";
import { Layout } from "~/shopify/components/layout";

export default function Index({ products }) {
  return (
    <Layout>
      <ProductListingPage products={products} />
    </Layout>
  );
}
export async function getStaticProps({ locale }) {
  const products = await allProducts(locale);

  return {
    props: { products },
  };
}
