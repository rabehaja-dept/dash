import { NextApiRequest, NextApiResponse } from "next";
import { getActiveCart } from "~/commercetools/cart.server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  try {
    const result = await getActiveCart(req, res);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({
      error: "An error happened",
    });
  }
}
