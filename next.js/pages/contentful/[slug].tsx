import Layout from "../../contentful/components/layout";
import { getAllPages, getPageBySlug } from "~/contentful/api";
import { ContentfulPageComponent } from "~/contentful/components/contentful-page";
import { HOME_PAGE_SLUG } from "~/contentful/utils/constants";
export default function Page({ preview, page }) {
  return (
    <>
      <Layout preview={preview}>
        <ContentfulPageComponent page={page} />
      </Layout>
    </>
  );
}

export async function getStaticProps({ params, draftMode = false, locale }) {
  let { slug } = params;
  // Content preview is dictated by Next's draft mode
  const preview = draftMode;

  const { page } = await getContentfulPage({
    slug,
    preview,
    locale,
  });

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

export async function getStaticPaths({ locales }) {
  const allPages = await getAllPages("*");

  const allSlugs = allPages
    .map(({ fields }) =>
      Object.keys(fields["slug"]).map((key) => fields["slug"][key])
    )
    .flat();

  const paths = locales.flatMap((locale) =>
    allSlugs
      .filter((slug) => slug !== HOME_PAGE_SLUG)
      .map((slug) => ({ params: { slug }, locale }))
  );

  return {
    paths,
    fallback: true,
  };
}
