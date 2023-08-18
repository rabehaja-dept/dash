import { requestBuilder } from "./clients/admin.server";
import {
  ShippingMethod,
  getShippingMethods as getShippingMethodsFromPackage,
} from "@deptdash/commercetools";
import { getLanguageFromLocaleString } from "./utils/utils";

export async function getShippingMethods(
  localeString?: string
): Promise<ShippingMethod[]> {
  const shippingMethods = await getShippingMethodsFromPackage(
    requestBuilder,
    getLanguageFromLocaleString(localeString)
  );
  return shippingMethods;
}
