import type { MetaFunction } from "@remix-run/server-runtime";
import type { Handle } from "~/@types";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return {
    title: "Kontent.ai Blog",
    description: "Our Kontent.ai blog",
  };
};

export const handle: Handle = {
  breadcrumb: () => {
    return {
      label: "Kontent.ai",
      path: "/kontent.ai",
    };
  },
};

export default function KontentAiBlog() {
  return (
    <>
      <Outlet />
    </>
  );
}
