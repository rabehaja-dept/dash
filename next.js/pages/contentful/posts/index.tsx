import { getRecentPosts } from "~/contentful/api";
import Link from "next/link";

export default function Posts({ recentPosts }) {
  return (
    <section>
      <h2>Recent Posts</h2>
      <ul>
        {recentPosts.map(({ fields }) => (
          <li key={fields.slug}>
            <Link href={`/contentful/posts/${fields.slug}`}>
              {fields.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export async function getStaticProps({ locale }) {
  const recentPosts = await getRecentPosts(locale);
  return {
    props: { recentPosts },
  };
}
