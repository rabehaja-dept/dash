import algoliasearch from "algoliasearch";
import { createClient, type SanityDocumentStub } from "@sanity/client";
import indexer from "sanity-algolia";
import { NextApiRequest, NextApiResponse } from "next";
import { apiVersion, dataset, projectId, useCdn } from "~/sanity/env";
import { SANITY_ALGOLIA_INDEX } from "~/lib/consts";

const algolia = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_KEY
);

const sanity = createClient({
  projectId,
  dataset,
  token: process.env.SANITY_API_READ_TOKEN,
  apiVersion,
  useCdn,
});

/**
 *  This function receives webhook POSTs from Sanity and updates, creates or
 *  deletes records in the corresponding Algolia indices.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.headers["content-type"] !== "application/json") {
    console.log("Bad request received for Sanity indexing");
    return res.status(400).json({ success: false, message: "Bad request" });
  }

  // Add webhook secrets to verify that the request is coming from Sanity.
  // See more at: https://www.sanity.io/docs/webhooks#bfa1758643b3
  const sanityToken =
    req.headers["x-sanity-api-token"] || req.headers["X-Sanity-Api-Token"];

  if (
    sanityToken === null ||
    sanityToken !== process.env.SANITY_API_READ_TOKEN
  ) {
    console.log("Unauthorized request received for Sanity indexing");
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized request" });
  }

  // Configure this to match an existing Algolia index name
  const algoliaIndex = algolia.initIndex(SANITY_ALGOLIA_INDEX);

  const sanityAlgolia = indexer(
    /**
     * The first parameter maps a Sanity document type to its respective Algolia search index.
     * You can also customize how the  document is fetched from Sanity by specifying a GROQ projection.
     * In this example, we fetch the plain text from Portable Text rich text
     * content via the pt::text function.
     * _id and other system fields are handled automatically.
     */

    {
      page: {
        index: algoliaIndex,
        projection: `{
          title,
          "slug": slug.current,
          "body": pt::text(body)
        }`,
      },
    },

    // The second parameter is a function that maps from a fetched Sanity document
    // to an Algolia Record. Here you can do further mutations to the data before
    // it is sent to Algolia.
    (document: SanityDocumentStub) => {
      switch (document._type) {
        case "page":
          return Object.assign({}, document, {
            // custom: "An additional custom field for pages, perhaps?",
          });
        default:
          return document;
      }
    },
    // Visibility function (optional).
    //
    // The third parameter is an optional visibility function. Returning `true`
    // for a given document here specifies that it should be indexed for search
    // in Algolia. This is handy if for instance a field value on the document
    // decides if it should be indexed or not. This would also be the place to
    // implement any `publishedAt` datetime visibility rules or other custom
    // visibility scheme you may be using.
    (document: SanityDocumentStub) => {
      if (document.hasOwnProperty("isHidden")) {
        return !document.isHidden;
      }
      return true;
    }
  );

  // Finally connect the Sanity webhook payload to Algolia indices via the
  // configured serializers and optional visibility function. `webhookSync` will
  // inspect the webhook payload, make queries back to Sanity with the `sanity`
  // client and make sure the algolia indices are synced to match.
  try {
    await sanityAlgolia.webhookSync(sanity, req.body);
    console.log("Successfully synced Sanity to Algolia");
    return res.status(200).json({ success: true, message: "Success" });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
}
