import { getEnv } from "../../app/config";
import { requestBuilder } from "../client";

const EXTENSION_KEY = "customer-create";
const PUBLICLY_AVAILABLE_ORIGIN = getEnv("PUBLICLY_AVAILABLE_ORIGIN");
const COMMERCETOOLS_HTTP_EXTENSION_SECRET = getEnv(
  "COMMERCETOOLS_HTTP_EXTENSION_SECRET"
);
const OVERWRITE = true;

export async function setupCustomerApiExtension() {
  const result = await requestBuilder
    .extensions()
    .withKey({ key: EXTENSION_KEY })
    .get()
    .execute()
    .then((res) => res.body)
    .catch((err) => {
      if (err.code !== 404) {
        console.log(err);
      } else {
        return null;
      }
    });

  if (result) {
    console.log("Customer API extension already exists");

    if (OVERWRITE) {
      await requestBuilder
        .extensions()
        .withKey({ key: EXTENSION_KEY })
        .delete({
          queryArgs: {
            version: result.version,
          },
        })
        .execute();

      console.log("Customer API extension deleted");
    } else {
      return;
    }
  }

  await requestBuilder
    .extensions()
    .post({
      body: {
        key: EXTENSION_KEY,
        destination: {
          type: "HTTP",
          url: `${PUBLICLY_AVAILABLE_ORIGIN}/api/commercetools/customer`,
          authentication: {
            type: "AuthorizationHeader",
            headerValue: COMMERCETOOLS_HTTP_EXTENSION_SECRET,
          },
        },
        triggers: [
          {
            resourceTypeId: "customer",
            actions: ["Create"],
          },
        ],
      },
    })
    .execute();

  console.log("Customer API extension created");

  return;
}
