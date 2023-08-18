import { SanityDocument } from "~/@types/sanity";
import { getEnv } from "~/config";
import { api } from "~/utils";

const SANITY_PROJECT_ID = getEnv("SANITY_STUDIO_PROJECT_ID");
const SANITY_DATASET = getEnv("SANITY_STUDIO_DATASET");

export function getProductFromSlug(slug: string): Promise<SanityDocument> {
  const query = `*[_type == 'product' && store.slug.current == '${slug}'][0]`;
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/${SANITY_DATASET}`;
  const response = api<SanityDocument>(url, query);
  return response;
}
