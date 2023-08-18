import Link from "next/link";
import { getAllPages } from "~/sanity/lib/client";

interface PageProps {
  pages: { title: string; slug: string }[];
}

export default function SanityPage(props: PageProps) {
  const { pages } = props;

  return (
    <section>
      <h1>All Published Sanity pages</h1>
      <ul
        style={{
          margin: "24px",
        }}
      >
        {pages.map((page) => (
          <li key={page.slug}>
            <Link href={`/sanity/${page.slug}`}>{page.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export const getStaticProps = async () => {
  const pages = await getAllPages();

  return {
    props: { pages },
  };
};
