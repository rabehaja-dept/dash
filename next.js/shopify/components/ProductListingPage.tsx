import { Suspense } from "react";
import LoadingScreen from "~/components/loading-screen";
import Store from "./Store";

export function ProductListingPage({ products }) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <div>
        <h2>Product Listing Page</h2>
      </div>
      <Store products={products} />
    </Suspense>
  );
}
