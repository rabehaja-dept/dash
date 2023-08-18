import Link from "next/link";
import Head from "next/head";
import { getAllArticles } from "~/kontent.ai/api";
import { Article } from "~/@types/generated/kontent.ai/content-types/";
import { KontentImage } from "~/kontent.ai/components/KontentImage";

export default function KontentAiBlog({ articles }: { articles: Article[] }) {
  return (
    <section>
      <Head>
        <title>Kontent.ai Blog</title>
        <meta name="description" content="Our Kontent.ai blog" />
      </Head>
      <h1>Kontent.ai Blog</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gridGap: "1rem",
          padding: "3rem",
        }}
      >
        {articles?.length ? (
          articles.map((article) => (
            <Link
              key={article.system.id}
              href={`/kontent.ai/${article.elements.url.value}`}
              className="hover:opacity-70"
            >
              <KontentImage
                url={article.elements.thumbnail_image.value[0].url}
                alt={
                  article.elements.thumbnail_image.value[0].description || ""
                }
                width={500}
                height={500}
              />
              <h3>{article.elements.title.value}</h3>
            </Link>
          ))
        ) : (
          <>
            <p>No articles found!</p>
          </>
        )}
      </div>
    </section>
  );
}

export async function getStaticProps() {
  const articles = await getAllArticles();

  return {
    props: {
      articles,
    },
  };
}
