import { NextApiRequest, NextApiResponse } from "next";
import { createCustomer, getCurrentCustomer } from "@deptdash/commercetools";
import { getRequestBuilder } from "../../../../commercetools/clients/web.server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let response: any;
    switch (req.method) {
      case "POST":
        response = await createCustomerHandler(req, res);
        break;
      case "GET":
        response = await getCurrentCustomerHandler(req, res);
        break;
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    res.status(200).json({ result: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

interface UserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

async function createCustomerHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userRequest: UserRequest = req.body;

  const { email, password, firstName, lastName } = userRequest;
  if (!email || !password || !firstName || !lastName) {
    throw new Error("Missing parameter");
  }

  const requestBuilder = await getRequestBuilder(req, res);
  const response = await createCustomer(userRequest, requestBuilder);
  return response;
}

export async function getCurrentCustomerHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const requestBuilder = await getRequestBuilder(req, res);
  const response = await getCurrentCustomer(requestBuilder);
  return response;
}
