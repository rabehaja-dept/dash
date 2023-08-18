import { NextApiRequest, NextApiResponse } from "next";
import { setShippingMethod } from "~/commercetools/cart.server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  try {
    const { cartId, shippingMethodId } = req.body;
    const result = await setShippingMethod(cartId, shippingMethodId);
    res.status(200).json({ result });
  } catch (error) {
    console.log("Error on setShippingMethod");
    console.log(error);
    res.status(500).json({
      error: "An error happened",
    });
  }
}
