import { pagesBySlugQuery } from "~/sanity/lib/queries";
import { Page, PageProps } from "../page";
import { useLiveQuery } from "next-sanity/preview";

export default function PagePreview({
  token,
  page,
}: {
  token: null | string;
} & PageProps) {
  const [pagePreview, pageLoading] = useLiveQuery({}, pagesBySlugQuery, {
    slug: page.slug,
  });

  return (
    <>
      <Page page={pagePreview} preview={true} />
    </>
  );
}
