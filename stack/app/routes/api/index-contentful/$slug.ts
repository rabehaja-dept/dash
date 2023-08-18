import type { ActionFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import algoliasearch from "algoliasearch";
import type { Entry } from "contentful";
import invariant from "tiny-invariant";
import { getEntryById } from "~/contentful/index.server";
import { getEnv } from "~/config";
import { ALGOLIA_APP_ID, ALGOLIA_INDEX } from "~/config";

async function indexEntryInAlgolia(entry: Entry<unknown>) {
  const client = algoliasearch(ALGOLIA_APP_ID, getEnv("ALGOLIA_ADMIN_KEY"));
  const indexName = ALGOLIA_INDEX;
  const index = client.initIndex(indexName);
  await index.partialUpdateObject(
    {
      objectID: entry.sys.id,
      ...entry,
    },
    {
      createIfNotExists: true,
    }
  );
}

export const action: ActionFunction = async ({ request, params }) => {
  const algoliaApiKey = request.headers.get("X-Algolia-API-Key");
  // If the passed Algolia admin API key doesn't match what we have in env, then we assume this is an invalid request
  if (algoliaApiKey === null || algoliaApiKey !== getEnv("ALGOLIA_ADMIN_KEY")) {
    throw new Error("API key header doesn't match");
  }
  const entryId = params.slug;
  invariant(entryId, "expected entryId in slug");
  if (request.method === "POST") {
    const entry = await getEntryById(entryId);
    await indexEntryInAlgolia(entry);
    return json({ success: true });
  }
  return json({ success: false });
};
