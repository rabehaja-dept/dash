import { LoaderFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { i18n } from "~/i18n.server";
import { json as superjson } from "superjson-remix";
import { useLoaderData as useSuperjsonLoaderData } from "superjson-remix";
// Types
import { Handle } from "~/@types";
import { INavContainer, SpecificLocale } from "~/@types/generated/contentful";
// Components
import { Nav } from "~/contentful/components/Nav";
import { NavProvider } from "~/contentful/components/NavProvider";
import { getNavContainer } from "~/contentful/index.server";
import { MiniCart } from "~/shopify/components/MiniCart"; // @dash-remove shopify
import { MiniCartActivator } from "~/shopify/components/MiniCartActivator"; // @dash-remove shopify

export const handle: Handle = {
  breadcrumb: () => ({
    label: "Contentful",
    path: "/contentful",
  }),
};

type LoaderData = {
  primaryNav: SpecificLocale<INavContainer>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const locale = await i18n.getLocale(request);
  const primaryNav = await getNavContainer("primary", {
    locale,
    preview: new URL(request.url).searchParams.get("preview") === "1",
  });
  return superjson<LoaderData>({
    primaryNav,
  });
};

export default function Contentful() {
  let { primaryNav } = useSuperjsonLoaderData<LoaderData>();

  return (
    <>
      {/**
       * for Contentful routes, we're using a
       * dynamic Contentful-based navigation bar.
       */}
      <NavProvider navContainers={{ primaryNav }}>
        <Nav
          sticky={true}
          slot={<MiniCartActivator className="ml-4" />} // @dash-remove shopify
          children={<MiniCart />} // @dash-remove shopify
          // TODO: pull this from contentful
          banner={
            <div className="text-center text-xs">
              Here is a ticket banner for important messages
            </div>
          }
        />
        <Outlet />
      </NavProvider>
    </>
  );
}
