import type { SpecificLocale, Asset } from "~/@types/generated/contentful";
import { ContentfulAsset } from "~/contentful/components/ContentfulAsset";
import { Button } from "~/components/interactive/Button";
import { Link } from "@remix-run/react";

export type ArticleCardProps = {
  asset?: SpecificLocale<Asset>;
  category?: {
    label: string;
    to: string;
  };
  date: string;
  title: string;
  buttonTo: string;
};

export const ArticleCard = ({
  asset,
  category,
  date,
  title,
  buttonTo,
}: ArticleCardProps) => {
  // sizing based on how many thumbnails show per breakpoint.
  const imageSizes = [
    "(min-width: 500px) 500px",
    "(min-width: 1000px) 500px",
    "33.33vw 250px",
  ];

  return (
    <div className="relative flex-shrink-0 basis-full overflow-hidden">
      {asset && <ContentfulAsset asset={asset} imageSizes={imageSizes} />}
      <div className="p-4 lg:p-8">
        <div className="mb-5">
          {category && (
            <Link
              to={category.to}
              className="mr-4 rounded-full bg-black px-4 py-1 text-sm text-white"
            >
              {category.label}
            </Link>
          )}
          <span className="text-sm">{date}</span>
        </div>
        <div className="mb-6 text-2xl">{title}</div>
        <Button to={buttonTo}>Continue Reading</Button>
      </div>
    </div>
  );
};
