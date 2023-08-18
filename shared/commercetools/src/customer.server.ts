import { Customer, MyCustomerDraft } from "@commercetools/platform-sdk";
import { LogDictionary } from "./log-utils/log-dictionary";
import { errorLogger, infoLogger } from "./log-utils/LogUtils";

export const getCustomerById = async (requestBuilder: any, id: string): Promise<Customer> => {
  const result = await requestBuilder
    .customers()
    .withId({ ID: id })
    .get()
    .execute()
    .then(({ body }) =>
      infoLogger({ body, code: "CTC001", message: LogDictionary.CTC001 })
    )
    .catch((error) =>
      errorLogger({
        reason: error,
        code: "CTC002",
        message: LogDictionary.CTC002,
      })
    );

  return result;
};

export const getCurrentCustomer = async (
  requestBuilder: any
): Promise<Customer | null> => {
  return (requestBuilder)
    .me()
    .get()
    .execute()
    .then(({ body }) => body)
    .catch((error) => {
      if (error.statusCode !== 403) {
        errorLogger({
          reason: error,
          code: "CTC002",
          message: LogDictionary.CTC002,
        });
      }
      return null;
    });
};

export const createCustomer = async (
  userRequest: MyCustomerDraft,
  requestBuilder: any
) => {
  const { email, password, firstName, lastName } = userRequest;
  let response = null;

  try {
    response = await requestBuilder
      .me()
      .signup()
      .post({
        body: {
          email,
          password,
          firstName,
          lastName,
        },
      })
      .execute();
  } catch (error: any) {
    return error.message;
  }
  return response?.body.customer;
};
