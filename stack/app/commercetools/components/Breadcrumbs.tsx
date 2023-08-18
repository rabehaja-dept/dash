import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useLocation } from "@remix-run/react";
import { Link } from "~/components/interactive";

interface Breadcrumb {
  label: string;
  path: string;
}
export type BreadcrumbsProps = {
  data: Breadcrumb[];
};

export const Breadcrumbs = ({ data }: BreadcrumbsProps) => {
  const location = useLocation();

  const activeLinkIndex = data.findIndex(
    (breadcrumb) => breadcrumb.path === location?.pathname
  );

  if (activeLinkIndex === -1) return null;

  return (
    <div className="mb-2 flex">
      {data.map((breadcrumb, index) => (
        <div className="flex" key={index}>
          {index < activeLinkIndex ? (
            <Link
              target="_self"
              href={breadcrumb.path}
              className="!text-xs text-primary"
            >
              {breadcrumb.label}
            </Link>
          ) : (
            <div
              className={`text-xs ${
                index > activeLinkIndex ? "text-text-weak" : "text-body"
              }`}
            >
              {breadcrumb.label}
            </div>
          )}
          {index !== data.length - 1 ? (
            <ChevronRightIcon className="ml-2 mr-1 h-4 w-3" />
          ) : null}
        </div>
      ))}
    </div>
  );
};
