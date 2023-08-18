import {
  getAllProducts as getAllProductsFromPackage,
  getProduct as getProductFromPackage,
} from "@deptdash/commercetools";
import { requestBuilder } from "./clients/admin.server";

export async function getAllProducts() {
  const response = await getAllProductsFromPackage(requestBuilder);
  return response;
}

export async function getProduct(slug: string, localeString?: string) {
  const response = await getProductFromPackage(
    requestBuilder,
    slug,
    localeString
  );
  return response;
}
