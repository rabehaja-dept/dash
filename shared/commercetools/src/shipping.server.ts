import {
  ShippingMethodPagedQueryResponse,
  ShippingMethod,
} from "@commercetools/platform-sdk";

export async function getShippingMethods(
  requestBuilder: any,
  localeProjection: string
): Promise<ShippingMethod[]> {
  const response: ShippingMethodPagedQueryResponse = await requestBuilder
    .shippingMethods()
    .get({
      queryArgs: {
        localeProjection: localeProjection,
      },
    })
    .execute()
    .then(({ body }) => body);

  return response.results;
}
