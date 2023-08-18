import { LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { getActiveCart } from "~/commercetools/api/cart.server";
import { Cart } from "@commercetools/platform-sdk";
import { i18n } from "~/i18n.server";
import CheckoutProducts from "~/commercetools/components/CheckoutProducts";
import { Link } from "~/components/interactive/Link";
import { Breadcrumbs } from "~/commercetools/components/Breadcrumbs";
import { CHECKOUT_BREADCRUMBS } from "~/commercetools/const";
import { CartTotalPrice } from "~/commercetools/components/CartTotalPrice";

interface LoaderData {
  cart: Cart;
  locale: string;
}

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const locale = await i18n.getLocale(request);
  const cart = await getActiveCart(request);

  if (!cart) {
    throw new Error("Something went wrong loading Commercetools.");
  }

  return {
    cart,
    locale,
  };
};

export default function Checkout() {
  const { cart, locale } = useLoaderData();
  const { pathname } = useLocation();
  const isOrder = pathname?.includes("order");

  // on the order review page, we don't want to show the empty cart message
  if (!cart?.lineItems?.length && !isOrder) {
    return (
      <div className="mb-6 flex h-[50vh] items-center justify-center">
        <div className="text-center text-lg">
          <p className="mb-5 text-xl">Your cart is empty</p>
          <div>
            Go to{" "}
            <Link to="/commercetools">
              <h3 className="text-lg hover:underline">list of products</h3>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-12/12 flex flex-col md:flex-row">
      <div className="border-r-1 w-12/12 order-last grow border border-y-0 border-l-0 border-border-base p-6 pb-16 md:order-first md:w-6/12 md:pl-0 md:pr-14 md:pt-14">
        <section className="ml-auto md:w-3/4">
          <div className="mb-4 flex flex-row items-center lg:mb-8">
            <Logo /> <div className="ml-1 text-2xl uppercase">dash</div>
          </div>
          <Breadcrumbs data={CHECKOUT_BREADCRUMBS} />
          <Outlet />
        </section>
      </div>
      <div className="w-12/12 border-b-1 grow bg-background-accent-base p-6 md:w-6/12 md:border-0 md:pb-0 md:pl-10 md:pr-0 md:pt-14">
        <div className="lg:sticky lg:top-36">
          <div className="md:w-3/4">
            <CheckoutProducts data={cart?.lineItems} locale={locale} />
          </div>
          <div className="mt-4 md:w-3/4">
            <CartTotalPrice cart={cart} locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}

const Logo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="73px"
      height="20px"
      viewBox="0 0 71 20"
      fill="none"
    >
      <g fill="currentColor">
        <path d="M 18.460938 9.789062 C 18.460938 4.824219 15.785156 1 8.976562 1 L 1.699219 1 L 1.699219 18.574219 L 8.976562 18.574219 C 15.785156 18.574219 18.460938 14.75 18.460938 9.789062 Z M 13.507812 9.789062 C 13.507812 13.257812 11.578125 14.546875 8.902344 14.546875 L 6.425781 14.546875 L 6.425781 5.027344 L 8.902344 5.027344 C 11.578125 5.027344 13.507812 6.320312 13.507812 9.789062 Z M 13.507812 9.789062 "></path>
        <path d="M 19.589844 18.574219 L 33.351562 18.574219 L 33.351562 14.574219 L 24.320312 14.574219 L 24.320312 11.558594 L 32.25 11.558594 L 32.25 7.761719 L 24.320312 7.761719 L 24.320312 5.003906 L 33.125 5.003906 L 33.125 1 L 19.589844 1 Z M 19.589844 18.574219 "></path>
        <path d="M 49.363281 7.105469 C 49.363281 2.671875 46.5625 1 42.210938 1 L 34.683594 1 L 34.683594 18.574219 L 39.410156 18.574219 L 39.410156 13.207031 L 42.210938 13.207031 C 46.5625 13.207031 49.363281 11.535156 49.363281 7.105469 Z M 44.464844 7.105469 C 44.464844 8.824219 43.664062 9.535156 41.738281 9.535156 L 39.410156 9.535156 L 39.410156 4.671875 L 41.738281 4.671875 C 43.664062 4.671875 44.464844 5.382812 44.464844 7.105469 Z M 44.464844 7.105469 "></path>
        <path d="M 49.882812 5.101562 L 55.359375 5.101562 L 55.359375 18.574219 L 60.085938 18.574219 L 60.085938 5.101562 L 65.566406 5.101562 L 65.566406 1 L 49.882812 1 Z M 49.882812 5.101562 "></path>
        <path d="M 63.601562 16.113281 C 63.601562 17.703125 64.875 18.992188 66.441406 18.992188 C 68.015625 18.992188 69.300781 17.703125 69.300781 16.113281 C 69.300781 14.523438 68.015625 13.222656 66.441406 13.222656 C 64.875 13.222656 63.601562 14.523438 63.601562 16.113281 Z M 64.148438 16.113281 C 64.148438 14.800781 65.171875 13.726562 66.441406 13.726562 C 67.714844 13.726562 68.75 14.800781 68.75 16.113281 C 68.75 17.425781 67.714844 18.488281 66.441406 18.488281 C 65.171875 18.488281 64.148438 17.425781 64.148438 16.113281 Z M 65.109375 17.539062 L 66.007812 17.539062 L 66.007812 16.558594 L 66.519531 16.558594 L 67.054688 17.539062 L 68.027344 17.539062 L 67.378906 16.378906 C 67.675781 16.253906 67.902344 15.914062 67.902344 15.53125 C 67.902344 14.867188 67.476562 14.546875 66.757812 14.546875 L 65.109375 14.546875 Z M 66.992188 15.546875 C 66.992188 15.785156 66.84375 15.886719 66.558594 15.886719 L 66.007812 15.886719 L 66.007812 15.257812 L 66.558594 15.257812 C 66.84375 15.257812 66.992188 15.332031 66.992188 15.546875 Z M 66.992188 15.546875 "></path>
      </g>
    </svg>
  );
};
