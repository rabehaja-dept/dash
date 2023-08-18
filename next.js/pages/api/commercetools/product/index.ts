import { NextApiRequest, NextApiResponse } from "next";
import { getAllProducts } from "@deptdash/commercetools";
import { getRequestBuilder } from "../../../../commercetools/clients/web.server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const requestBuilder = await getRequestBuilder(req, res);
  const response = await getAllProducts(
    requestBuilder,
    req.query.locale as string
  );
  res.status(200).json({ result: response });
}
