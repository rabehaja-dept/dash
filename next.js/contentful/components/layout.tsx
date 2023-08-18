import Footer from "~/components/footer";
import Meta from "~/components/meta";
import { useRouter } from "next/router";

export default function Layout({ preview, children }) {
  const router = useRouter();
  const currentUrl = router.asPath;

  return (
    <>
      <Meta />
      {preview && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.25rem",
            backgroundColor: "yellow",
          }}
        >
          <b>Preview Mode Enabled</b>
          <a href={`/api/contentful/exit-preview?redirect=${currentUrl}`}>
            Exit Preview Mode
          </a>
        </div>
      )}
      <main>{children}</main>
      <Footer />
    </>
  );
}
