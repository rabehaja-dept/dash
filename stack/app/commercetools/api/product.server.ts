import {
  getProduct as getProductFromPackage,
  getAllProducts as getAllProductsFromPackage,
  getSearchProducts as getSearchProductsFromPackage,
} from "@deptdash/commercetools";
import { requestBuilder } from "./clients/admin.server";

export async function getProduct(slug: string, localeString?: string) {
  const products = await getProductFromPackage(
    requestBuilder,
    slug,
    localeString
  );
  return products;
}

export async function getAllProducts(localeString?: string) {
  const products = await getAllProductsFromPackage(
    requestBuilder,
    localeString
  );
  return products;
}

export async function getSearchProducts(localeString?: string, query?: string) {
  const products = await getSearchProductsFromPackage(
    requestBuilder,
    localeString,
    query
  );
  return products;
}
