import Meta from "~/components/meta";
import Footer from "~/components/footer";
import Navbar from "~/commercetools/components/navbar/Navbar";

export default function Layout({ children }) {
  return (
    <>
      <Meta />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
