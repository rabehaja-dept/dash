import Layout from "../../contentful/components/layout";
import { getPageBySlug } from "~/contentful/api";
import { ContentfulPageComponent } from "~/contentful/components/contentful-page";

export default function Index({ preview, page }) {
  return (
    <>
      <Layout preview={preview}>
        <ContentfulPageComponent page={page} />
      </Layout>
    </>
  );
}

export async function getStaticProps({ draftMode = false, locale }) {
  // Content preview is dictated by Next's draft mode
  const preview = draftMode;
  /**
   * Our home page is hard-coded to have the slug "home"
   */
  const { page } = await getContentfulPage({
    slug: "home",
    preview,
    locale,
  });

  // Content preview is triggered when Next's draft mode is enabled
  return {
    props: { preview, page },
  };
}

export async function getContentfulPage({
  slug,
  preview,
  locale,
}: {
  slug: string;
  preview: boolean;
  locale: string;
}) {
  const page = await getPageBySlug(slug, {
    locale,
    preview,
  });
  return {
    page,
  };
}
