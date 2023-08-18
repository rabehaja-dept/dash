import { useEffect, useState } from "react";
import AccountInformation from "~/commercetools/components/account/AccountInformation";
import AddressBook from "~/commercetools/components/account/AddressBook";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "~/pages/api/commercetools/auth/[...nextauth]";
import { getCurrentCustomerHandler } from "~/pages/api/commercetools/customer";
import Layout from "~/layouts/commercetools/base-layout";

interface Props {
  customer: any;
}

export default function Account({ customer }: Props) {
  const [accountInformation, setAccountInformation] = useState(null);
  const [addressesBook, setAddressesBook] = useState(null);

  useEffect(() => {
    const loadCustomerData = async () => {
      if (customer) {
        const {
          firstName,
          lastName,
          email,
          addresses,
          defaultBillingAddressId,
          defaultShippingAddressId,
        } = customer;

        setAccountInformation({
          firstName: firstName || "",
          lastName: lastName || "",
          email: email,
        });

        setAddressesBook({
          defaultBillingAddress: {
            address: getAddressByAddressId(addresses, defaultBillingAddressId),
          },
          defaultShippingAddress: {
            address: getAddressByAddressId(addresses, defaultShippingAddressId),
          },
        });
      }
    };

    loadCustomerData();
  }, []);

  return (
    <Layout>
      <div>
        {accountInformation && <AccountInformation {...accountInformation} />}
        {addressesBook && <AddressBook {...addressesBook} />}
      </div>
    </Layout>
  );
}

function getAddressByAddressId(addresses: any[], id: any) {
  return addresses.find((address) => address.id === id);
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session.anonymous_id) {
    return {
      redirect: {
        destination: "/commercetools/login",
        permanent: false,
      },
    };
  }

  const customer = await getCurrentCustomerHandler(
    context.req as NextApiRequest,
    context.res as NextApiResponse
  );
  return {
    props: {
      customer,
    },
  };
};
