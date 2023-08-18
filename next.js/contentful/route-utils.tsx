import Head from "next/head";

// Generally speaking, contentful Pages = "website", contentful Posts = "article", and shopify products = "product.item"
type OpenGraphType = "website" | "article" | "product.item";
const openGraphDefaultType = "website";

export interface MetaInfo {
  title: string;
  description: string;
  openGraphUrl: string;
  openGraphType: OpenGraphType;
  openGraphImageUrl: string;
}

export const meta = ({ data }: { data: { meta: MetaInfo } }) => {
  return {
    title: data?.meta?.title,
    description: data?.meta?.description,
    "og:title": data?.meta?.title,
    "og:description": data?.meta?.description,
    "og:url": data?.meta?.openGraphUrl,
    "og:type": data?.meta?.openGraphType,
    "og:image": data?.meta?.openGraphImageUrl,
  };
};

export function getMetaInfo({
  title,
  description,
  openGraphType,
  openGraphImageUrl,
}: {
  title: string;
  description: string;
  openGraphType?: OpenGraphType;
  openGraphImageUrl?: string;
}): JSX.Element {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} key="description" />
      <meta property="og:title" content={title} key="og:title" />
      <meta
        property="og:description"
        content={description}
        key="og:description"
      />
      <meta
        property="og:type"
        content={openGraphType || openGraphDefaultType}
        key="og:type"
      />
      {openGraphImageUrl && (
        <meta property="og:image" content={openGraphImageUrl} key="og:image" />
      )}
    </Head>
  );
}
