import { getAllArticles, getArticleBySlug } from "~/kontent.ai/api";
import { Article } from "~/@types/generated/kontent.ai/content-types";
import { RichText } from "~/kontent.ai/components/RichText";

const slugArticleMetadata = (article: Article) => {
  return {
    "@type": "BlogPosting",
    headline: article.elements.title.value,
    image: [article.elements.thumbnail_image.value[0].url],
    dateModified: article.system.lastModified,
  };
};

export async function getStaticProps({ params }) {
  const article = await getArticleBySlug(params.slug);

  return {
    props: {
      article,
      metaData: slugArticleMetadata(article),
    },
  };
}

export async function getStaticPaths() {
  const articles = await getAllArticles();

  return {
    paths: articles.map((article) => ({
      params: {
        slug: article.elements.url.value,
      },
    })),
    fallback: false,
  };
}

export default function KontentAi({ article, metadata, matches }) {
  const toDate = (date: string): string => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <>
      {
        <div>
          <h1>{article && article.elements.title.value}</h1>
          <div>
            {article ? (
              <>
                <p className="mb-4">{toDate(article.system.lastModified)}</p>
                <RichText element={article.elements.body} />
              </>
            ) : (
              <div>No article found with that name!</div>
            )}
          </div>
        </div>
      }
    </>
  );
}
