import DefaultHomePage from "~/default-home-page";
// @dash-remove-next-line contentful
import { getAllPages } from "~/contentful/api";

// @dash-replace-next-line contentful: export default function IndexPage() {
export default function IndexPage({ contentfulPages }) {
  return (
    <>
      {/* Change me to something new! */}
      <DefaultHomePage
        // @dash-remove-next-line contentful
        contentfulPages={contentfulPages}
        key="this-is-a-key-to-force-another-line"
      />
    </>
  );
}

export async function getStaticProps({ req, res }): Promise<{ props }> {
  // @dash-remove-start contentful
  const contentfulPages = (await getAllPages("en-US")).map(
    ({ fields }) => fields.slug
  );
  // @dash-remove-end
  return {
    props: {
      // @dash-remove-start contentful
      contentfulPages,
      // @dash-remove-end
    },
  };
}
