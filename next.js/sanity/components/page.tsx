import { CustomPortableText } from "./portable-text";
import type { PagePayload } from "~/sanity/types";

export interface PageProps {
  page: PagePayload | undefined;
  preview?: boolean;
}

export function Page({ page }: PageProps) {
  // Default to an empty object to allow previews on non-existent documents
  const { body } = page || {};

  return (
    <>
      <div>{body && <CustomPortableText value={body} />}</div>
    </>
  );
}
