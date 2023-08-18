import LoadingScreen from "~/components/loading-screen";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import {
  createDocumentFromSection,
  getSections,
  getComponentFromContentfulRichTextEntry,
} from "~/contentful";
import { Suspense } from "react";

export function ContentfulPageComponent({ page }) {
  return (
    <section>
      <Suspense fallback={<LoadingScreen />}>
        {page?.fields?.body &&
          getSections(page.fields.body).map((section) =>
            documentToReactComponents(
              createDocumentFromSection(section),
              getComponentFromContentfulRichTextEntry
            )
          )}
      </Suspense>
    </section>
  );
}
