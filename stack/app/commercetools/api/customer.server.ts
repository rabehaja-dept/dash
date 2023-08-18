import { Customer, MyCustomerDraft } from "@commercetools/platform-sdk";
import { getRequestBuilder } from "./clients/web.server";
import { requestBuilder } from "./clients/admin.server";
import {
  getCustomerById,
  getCurrentCustomer,
  createCustomer,
} from "@deptdash/commercetools";

export const handleGetCustomerById = async (id: string): Promise<Customer> => {
  const result = await getCustomerById(requestBuilder, id);
  return result;
};

export const handleGetCurrentCustomer = async (
  request: Request
): Promise<Customer | null> => {
  const requestBuilder = await getRequestBuilder(request);
  const result = await getCurrentCustomer(requestBuilder);
  return result;
};

export const handleCreateCustomer = async (
  userRequest: MyCustomerDraft,
  request: Request
) => {
  const requestBuilder = await getRequestBuilder(request);
  const response = await createCustomer(userRequest, requestBuilder);
  return response;
};
