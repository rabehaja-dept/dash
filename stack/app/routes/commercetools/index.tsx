import { Form, useLoaderData, useSearchParams } from "@remix-run/react";
import ReactPaginate from "react-paginate";
import { i18n } from "~/i18n.server";
import {
  getAllProducts,
  getSearchProducts,
} from "~/commercetools/api/product.server";
import { getActiveCart } from "~/commercetools/api/cart.server";
import { useTranslation } from "react-i18next";
// Components
import { FilterDrawer } from "~/commercetools/components/FilterDrawer";
import { ProductCard } from "~/commercetools/components/ProductCard";
import { FormInput } from "~/components/forms";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

// Types & Constants
import type { Handle } from "~/@types";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Customer, ProductProjection } from "@commercetools/platform-sdk";
import { ITEMS_PER_PAGE } from "~/commercetools/const";
import { defaultCurrencyCode } from "~/i18n-config";
import { getLanguageFromLocaleString } from "~/commercetools/utils";
import { handleGetCurrentCustomer } from "~/commercetools/api/customer.server";

const i18nNamespaces = ["commercetools"];

export const handle: Handle = {
  i18n: i18nNamespaces,
};

export const meta: MetaFunction = () => {
  return {
    title: "DEPT DASH™ Commercetools Store",
    description: "Check out our products!",
  };
};

interface LoaderData {
  products: ProductProjection[];
  currencyCode: string;
  locale: string;
  customer: Customer | null;
}

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const cart = await getActiveCart(request);
  const customer = await handleGetCurrentCustomer(request);
  const locale = await i18n.getLocale(request);
  const url = new URL(request.url);
  const search = new URLSearchParams(url.search);

  let products: ProductProjection[] = [];

  if (search.get("query")) {
    products = await getSearchProducts(locale, search.get("query") || "");
  } else {
    products = await getAllProducts(locale);
  }
  return {
    products,
    currencyCode: cart?.totalPrice?.currencyCode || defaultCurrencyCode,
    locale,
    customer,
  };
};

export default function Store() {
  const { products, currencyCode, locale, customer } =
    useLoaderData<LoaderData>();
  const language = getLanguageFromLocaleString(locale);
  const { t } = useTranslation(i18nNamespaces);
  const [params] = useSearchParams();
  const filterTitle = t("SearchFilter");
  const productList = t("ProductsList");

  return (
    <section className="m-10">
      <div className="my-6">
        <h2>{productList}</h2>
      </div>
      <FilterDrawer title={filterTitle}>
        <Form>
          <FormInput
            inputProps={{
              type: "text",
              name: "query",
              defaultValue: params.get("query") || "",
            }}
            label=""
            name="query"
            placeholder={filterTitle || ""}
          />
        </Form>
      </FilterDrawer>
      <div className="mt-12 grid gap-4 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            customer={customer}
            product={product as ProductProjection}
            currencyCode={currencyCode}
            locale={locale}
            language={language}
          />
        ))}
      </div>
      <div className="mt-8">
        <ReactPaginate
          pageCount={Math.ceil(products.length / ITEMS_PER_PAGE)}
          className="mx-auto flex w-min items-center"
          pageClassName="px-4"
          nextLabel={<ChevronRightIcon className="w-3" />}
          previousLabel={<ChevronLeftIcon className="w-3" />}
          renderOnZeroPageCount={() => null}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    </section>
  );
}
