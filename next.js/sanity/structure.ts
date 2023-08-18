// ./sanity/structure.ts
import { DefaultDocumentNodeResolver, StructureResolver } from "sanity/desk";
import { IFramePreviewView } from "~/sanity/components/preview/iframe-preview-view";

// Example on how to add views for a schemaType
// https://www.sanity.io/docs/create-custom-document-views-with-structure-builder
export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, ctx) => {
  const schemaType = ctx.schema.get(ctx.schemaType);

  // add preview based on schema tname
  if (schemaType.name === "testDoc") {
    return S.document().views([
      S.view.form().title("Content"),
      S.view.component(IFramePreviewView).title("Preview"),
    ]);
  }

  // or add preview based on some custom property
  if (schemaType.options?.preview) {
    return S.document().views([
      S.view.form().title("Content"),
      S.view.component(IFramePreviewView).title("Preview"),
    ]);
  }

  return S.document();
};

export const structure: StructureResolver = (S, context) => {
  return S.list()
    .title("Content")
    .items([...S.documentTypeListItems()]);
};
