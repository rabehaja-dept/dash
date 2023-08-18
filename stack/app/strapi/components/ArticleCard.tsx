import { Link } from "@remix-run/react";
import { ApiArticleArticle } from "~/@types/generated/strapi";
import { getImageUriFromStrapiArticle, getImageUrl } from "../utils";

export type CardProps = {
  STRAPI_URL: string;
  article: ApiArticleArticle;
};

export const ArticleCard = ({ STRAPI_URL, article }: CardProps) => {
  const imageURI = getImageUriFromStrapiArticle(article);
  const alternativeText = article.attributes.image.data
    ? article.attributes.image.data.attributes.alternativeText
    : null;

  return (
    <Link to={`/strapi-blog/${article.attributes.slug}`}>
      <div className="hover:opacity-60">
        {imageURI && alternativeText && (
          <div>
            <img
              src={getImageUrl(imageURI, STRAPI_URL)}
              alt={alternativeText}
              className="max-h-72 w-full object-cover"
            />
          </div>
        )}
        <div className="mt-3">
          <h2>{article.attributes.title}</h2>
        </div>
      </div>
    </Link>
  );
};
