import Layout from "~/contentful/components/layout";
import { getAllPosts, getPostBySlug } from "~/contentful/api";
import { ContentfulPageComponent } from "~/contentful/components/contentful-page";

export default function Post({ preview, locale, page }) {
  return (
    <>
      <Layout preview={preview}>
        <ContentfulPageComponent page={page} />
      </Layout>
    </>
  );
}

export async function getStaticProps({ params, draftMode = false, locale }) {
  // Content preview is dictated by Next's draft mode
  const preview = draftMode;
  let { slug } = params;
  const { page } = await getContentfulPage({ slug, preview, locale });

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
  const page = await getPostBySlug(slug, {
    locale,
    preview,
  });

  return {
    page,
    locale,
  };
}

export async function getStaticPaths({ locales }) {
  const allPosts = await getAllPosts("*");

  const allSlugs = allPosts
    .map(({ fields }) =>
      Object.keys(fields["slug"]).map((key) => fields["slug"][key])
    )
    .flat();

  const paths = locales.flatMap((locale) =>
    allSlugs.map((slug) => ({ params: { slug }, locale }))
  );

  return {
    paths,
    fallback: true,
  };
}
