import { Suspense } from "react";
import { Page } from "~/sanity/components/page";
import { PreviewWrapper } from "~/sanity/components/preview/preview-wrapper";
import { getPageBySlug, getPagePaths } from "~/sanity/lib/client";
import { resolveHref } from "~/sanity/lib/links";
import { GetStaticProps } from "next";
import { lazy } from "react";
import { PagePayload } from "~/sanity/types";
import PreviewProvider from "~/sanity/preview-provider";

const PagePreview = lazy(
  () => import("~/sanity/components/preview/page-preview")
);

interface PageProps {
  page?: PagePayload;
  preview: boolean;
  token: string | null;
}

interface Query {
  [key: string]: string;
}

interface PreviewData {
  token?: string;
}

export default function SanityPage(props: PageProps) {
  const { page, preview, token } = props;

  if (preview) {
    return (
      <PreviewProvider token={token}>
        <Suspense
          fallback={
            <PreviewWrapper>
              <Page page={page} preview={preview} />
            </PreviewWrapper>
          }
        >
          <PagePreview token={token} page={page} />
        </Suspense>
      </PreviewProvider>
    );
  }

  return <Page page={page} preview={preview} />;
}

export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {}, params = {} } = ctx;

  const token = previewData.token;

  const page = await getPageBySlug({ token, slug: params.slug });

  if (!page) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      page,
      preview,
      token: previewData.token ?? null,
    },
  };
};

export const getStaticPaths = async () => {
  const paths = await getPagePaths();

  return {
    paths: paths?.map((slug) => resolveHref("page", slug)) || [],
    fallback: false,
  };
};
