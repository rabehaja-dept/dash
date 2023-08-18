import { Outlet } from "@remix-run/react";
import { Handle } from "~/@types";

export const handle: Handle = {
  breadcrumb: () => ({
    label: "Blog",
    path: "/contentful/blog",
  }),
};

export default function Blog() {
  return (
    <>
      <Outlet />
    </>
  );
}
