import { NextApiRequest, NextApiResponse } from "next";
import { addAddressesAndEmailToCart } from "~/commercetools/cart.server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { cartId, version, email, shippingAddress, billingAddress } = req.body;

  try {
    const response = await addAddressesAndEmailToCart(
      cartId,
      version,
      email,
      shippingAddress,
      billingAddress,
      req,
      res
    );
    res.status(200).json({ response });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "An error happened",
    });
  }
}
