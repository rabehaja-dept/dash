import { ApiArticleArticle } from "~/@types/generated/strapi";

export function getImageUriFromStrapiArticle(
  article: ApiArticleArticle
): string {
  if (article?.attributes?.image?.data?.attributes?.formats?.medium) {
    return article.attributes.image.data.attributes.formats.medium.url;
  } else if (article?.attributes?.image?.data?.attributes) {
    // gif, video, etc
    return article.attributes.image.data.attributes.url;
  }
  return "";
}

export function getImageUrl(
  imageUrl: string,
  STRAPI_URL: string
): string | undefined {
  // if image.url matches *.s3.*.amazonaws.com, then we can use the image.url directly, otherwise we need to use the STRAPI_URL
  if (imageUrl.match(/.*.s3\..*\.amazonaws\.com.*/)) {
    return imageUrl; // use the image.url directly
  }
  return `${STRAPI_URL}${imageUrl}`; // use the STRAPI_URL as a prefix
}
