import { NextApiRequest, NextApiResponse } from "next";
import { updateCartById } from "~/commercetools/cart.server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { cartId, version, actions } = req.body;
  try {
    const response = await updateCartById(cartId, version, actions, req, res);
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({
      error: "An error happened",
    });
  }
}
