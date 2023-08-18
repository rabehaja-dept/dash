import { NextApiRequest, NextApiResponse } from "next";
import { getProduct } from "@deptdash/commercetools";
import { getRequestBuilder } from "../../../../commercetools/clients/web.server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const requestBuilder = await getRequestBuilder(req, res);
  const response = await getProduct(
    requestBuilder,
    req.query.slug as string,
    req.query.locale as string
  );
  res.status(200).json({ result: response });
}
