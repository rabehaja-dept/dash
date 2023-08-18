import { NextApiRequest, NextApiResponse } from "next";
import { addToCart } from "~/commercetools/cart.server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { cartId, version, sku } = req.body;
  try {
    const result = await addToCart(cartId, version, sku, req, res);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({
      error: "An error happened",
    });
  }
}
