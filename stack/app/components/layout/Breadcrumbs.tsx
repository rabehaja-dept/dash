import { RouteMatch } from "@remix-run/react";
import { Link } from "../interactive/Link";

export type BreadcrumbsProps = {
  matches: RouteMatch[];
};

/**
 * @param matches - The matches from the Remix router's `useMatches` hook
 * @returns A component that renders the breadcrumbs for the current route
 * @description This component takes an array of `matches` and generates a list of links to the parent routes.
 */
export const Breadcrumbs = ({ matches }: BreadcrumbsProps) => {
  const breadcrumbs = matches
    .filter((match) => match.handle && match.handle.breadcrumb)
    .map((match) => {
      return {
        label: match.handle?.breadcrumb().label,
        path: match.handle?.breadcrumb().path,
      };
    });

  return (
    <div className="mb-8 flex flex-wrap items-center text-title-sm">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={`breadcrumb-${index}`}>
          <Link target="_self" href={breadcrumb.path} className="text-title-sm">
            {breadcrumb.label}
          </Link>
          {index < breadcrumbs.length - 1 && (
            <span className="mx-2 text-text-weak">/</span>
          )}
        </div>
      ))}
    </div>
  );
};
