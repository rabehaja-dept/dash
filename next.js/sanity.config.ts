/**
 * This config is used to set up Sanity Studio.
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { previewDocumentNode } from "~/sanity/plugins/preview-pane";
import { structure } from "./sanity/structure";
import { productionUrl } from "~/sanity/plugins/production-url";
// see https://www.sanity.io/docs/api-versioning for how versioning works
import { apiVersion, dataset, projectId, previewSecretId } from "./sanity/env";
import { schema, PREVIEWABLE_DOCUMENT_TYPES } from "./sanity/schema";

const title =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_TITLE || "DEPT DASH™ - Sanity";

export default defineConfig({
  basePath: "/sanity/studio",
  projectId,
  dataset,
  // edit schemas in './sanity/schema'
  schema,
  title,
  plugins: [
    deskTool({
      // `defaultDocumentNode` is responsible for adding a “Preview” tab to the document pane
      defaultDocumentNode: previewDocumentNode({ apiVersion, previewSecretId }),
      structure,
    }),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    productionUrl({
      apiVersion,
      previewSecretId,
      types: PREVIEWABLE_DOCUMENT_TYPES,
    }),
  ],
});
