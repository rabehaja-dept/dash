import { requestBuilder } from "./clients/admin.server";
import { getLanguageFromLocaleString } from "../utils";
import {
  ShippingMethod,
  getShippingMethods as getShippingMethodsFromPackage,
} from "@deptdash/commercetools";
export async function getShippingMethods(
  localeString?: string
): Promise<ShippingMethod[]> {
  const response = await getShippingMethodsFromPackage(
    requestBuilder,
    getLanguageFromLocaleString(localeString)
  );

  return response;
}
