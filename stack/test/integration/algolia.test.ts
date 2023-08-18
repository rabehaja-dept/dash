import algoliasearch from "algoliasearch/lite";
import { ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY, ALGOLIA_INDEX } from "~/config";

test("Algolia index returns hits", async () => {
  const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
  const indexName = ALGOLIA_INDEX;
  const index = client.initIndex(indexName);
  const results = await index.search("");
  expect(results.hits.length).toBeGreaterThan(1);
});
