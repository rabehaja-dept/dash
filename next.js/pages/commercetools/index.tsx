import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { getCurrentCustomerHandler } from "~/pages/api/commercetools/customer";
import { authOptions } from "../api/commercetools/auth/[...nextauth]";
import Layout from "~/layouts/commercetools/base-layout";
import { getAllProducts } from "~/commercetools/product.server";
import { ProductProjection } from "@deptdash/commercetools";
import { ProductCard } from "~/commercetools/components/product/ProductCard";
import { signIn } from "next-auth/react";
import { useEffect } from "react";

export default function CommerceToolsPage({ products, session, customer }) {
  useEffect(() => {
    if (!session) {
      const signInAnonymously = async () => {
        const result = await signIn("credentials", {
          redirect: false,
        });
      };
      signInAnonymously();
    }
  }, []);

  return (
    <Layout>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridAutoRows: "1fr",
          gridTemplateColumns: "repeat(auto-fill, minmax(600px, 1fr))",
        }}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            customer={customer}
            product={product as ProductProjection}
            currencyCode={"USD"}
            locale={"en-US"}
            language={"EN"}
          />
        ))}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const customer = await getCurrentCustomerHandler(
    context.req as NextApiRequest,
    context.res as NextApiResponse
  );

  return {
    props: {
      products: await getAllProducts(),
      session: await getServerSession(context.req, context.res, authOptions),
      customer,
    },
  };
};
