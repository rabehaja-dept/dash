import Footer from "~/components/footer";
import Meta from "~/components/meta";
import Navbar from "./Navbar";
import { useCart } from "@shopify/hydrogen-react";

export function Layout({ children }) {
  const cart = useCart();

  return (
    <>
      <Meta />
      <Navbar cart={cart} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
