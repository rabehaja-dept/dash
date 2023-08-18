import type { NextApiRequest, NextApiResponse } from "next";
import type { Entry } from "contentful";

import algoliasearch from "algoliasearch";
import invariant from "tiny-invariant";
import { getEntryById } from "~/contentful/api";

async function indexEntryInAlgolia(entry: Entry<any>) {
  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.ALGOLIA_ADMIN_KEY
  );
  // The name of the index in Algolia set up for this kind of content
  const INDEX_NAME = "next_contentful_entries";
  const index = client.initIndex(INDEX_NAME);
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Header with the Algolia admin API key (set up in Contentful webhook)
  const algoliaApiKey =
    req.headers["X-Algolia-API-Key"] || req.headers["x-algolia-api-key"];
  // If the passed Algolia admin API key doesn't match what we have in env,
  // then we assume this is an invalid request
  if (
    algoliaApiKey === null ||
    algoliaApiKey !== process.env.ALGOLIA_ADMIN_KEY
  ) {
    console.log("Unauthorized request received for Contentful indexing");
    return res.status(401).send({ success: false, message: "Unauthorized" });
  }
  const ENTRY_ID = (req.query.slug as string) || (req.body.slug as string);

  invariant(ENTRY_ID, "Expected a valid slug");

  if (req.method === "POST") {
    try {
      // Get the full entry based on the id
      const entry = await getEntryById(ENTRY_ID);
      await indexEntryInAlgolia(entry);
      return res
        .status(200)
        .json({ success: true, message: "Successfully indexed entry" });
    } catch (e) {
      console.log("Error indexing entry in Algolia", e);
      return res
        .status(500)
        .send({ success: false, message: "Error indexing entry in Algolia" });
    }
  }

  return res.status(404).send({ success: false, message: "Not found" });
}
