import { ProductProjectionPagedQueryResponse } from "@commercetools/platform-sdk";
import { errorLogger, infoLogger } from "./log-utils/LogUtils";
import { LogDictionary } from "./log-utils/log-dictionary";

export async function getProduct(
  requestBuilder: any,
  slug: string,
  localeString?: string
) {
  const response = await requestBuilder
    .productProjections()
    .get({
      queryArgs: {
        where: `slug(en-US="${slug}")`,
        localeProjection: localeString,
        expand: ["productType"],
      },
    })
    .execute()
    .then(({ body }) =>
      infoLogger({ body, code: "CTP006", message: LogDictionary.CTP006 })
    )
    .catch((error: any) =>
      errorLogger({
        reason: error,
        code: "CTP003",
        message: LogDictionary.CTP003,
        throwError: true,
      })
    );
  return response.results;
}

export async function getAllProducts(
  requestBuilder: any,
  localeString?: string
) {
  const response: ProductProjectionPagedQueryResponse = await requestBuilder
    .productProjections()
    .get({
      queryArgs: {
        localeProjection: localeString,
      },
    })
    .execute()
    .then(({ body }) =>
      infoLogger({ body, code: "CTP004", message: LogDictionary.CTP004 })
    )
    .catch((error: any) =>
      errorLogger({
        reason: error,
        code: "CTP001",
        message: LogDictionary.CTP001,
      })
    );
  return response.results;
}

export async function getSearchProducts(
  requestBuilder: any,
  localeString?: string,
  query?: string
) {
  const response = await requestBuilder
    .productProjections()
    .search()
    .get({
      queryArgs: {
        [`text.${localeString}`]: query,
      },
    })
    .execute()
    .then(({ body }) =>
      infoLogger({ body, code: "CTP005", message: LogDictionary.CTP005 })
    )
    .catch((error: any) =>
      errorLogger({
        reason: error,
        code: "CTP002",
        message: LogDictionary.CTP002,
        throwError: true,
      })
    );

  return response.results;
}
