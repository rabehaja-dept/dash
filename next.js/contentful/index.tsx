import type { Options } from "@contentful/rich-text-react-renderer";
import type { Document, TopLevelBlock } from "@contentful/rich-text-types";
import { INLINES, BLOCKS } from "@contentful/rich-text-types";
import type {
  CONTENT_TYPE,
  Asset,
  SpecificLocale,
} from "~/@types/generated/contentful";
import { assertUnreachable, cssClassesUsedForRichText } from "./utils";
import Link from "next/link";
import { getFeature, getGridSection, getHero } from "./content-renderer";
import ContentfulImage from "./components/contentful-image";
import SectionSeparator from "~/components/section-separator";

/**
 * This function returns components generated
 * from a Contentful Rich Text entry.
 * To change how a Contentful Rich Text entry is rendered,
 * you can change the components returned by this function.
 */
export const getComponentFromContentfulRichTextEntry: Options = {
  renderNode: {
    [INLINES.HYPERLINK]: (node, children) => {
      return (
        <Link rel="noreferrer" href={node.data.uri}>
          {children}
        </Link>
      );
    },
    [INLINES.ENTRY_HYPERLINK]: (node, children) => {
      return <Link href={node.data.target}>{children}</Link>;
    },
    [BLOCKS.HEADING_1]: (node, children) => (
      <h1 className={cssClassesUsedForRichText.h1}>{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node, children) => (
      <h2 className={cssClassesUsedForRichText.h2}>{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
      <h3 className={cssClassesUsedForRichText.h3}>{children}</h3>
    ),
    [BLOCKS.HEADING_4]: (node, children) => (
      <h4 className={cssClassesUsedForRichText.h4}>{children}</h4>
    ),
    [BLOCKS.HEADING_5]: (node, children) => (
      <h5 className={cssClassesUsedForRichText.h5}>{children}</h5>
    ),
    [BLOCKS.HEADING_6]: (node, children) => (
      <h6 className={cssClassesUsedForRichText.h6}>{children}</h6>
    ),
    [BLOCKS.HR]: (/* assume no children */) => <SectionSeparator />,
    [BLOCKS.UL_LIST]: (node, children) => (
      <ul className={cssClassesUsedForRichText.ul}>{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node, children) => (
      <ol className={cssClassesUsedForRichText.ol}>{children}</ol>
    ),
    [BLOCKS.PARAGRAPH]: (node, children) => (
      <div className={cssClassesUsedForRichText.p}>{children}</div>
    ),
    [BLOCKS.QUOTE]: (node, children) => (
      <blockquote className={cssClassesUsedForRichText.blockquote}>
        {children}
      </blockquote>
    ),
    [BLOCKS.TABLE]: (node, children) => (
      <table className={cssClassesUsedForRichText.table}>
        <tbody>{children}</tbody>
      </table>
    ),
    [BLOCKS.TABLE_HEADER_CELL]: (node, children) => (
      <th className={cssClassesUsedForRichText.th}>{children}</th>
    ),
    [BLOCKS.TABLE_CELL]: (node, children) => (
      <td className={cssClassesUsedForRichText.td}>{children}</td>
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node, children) => {
      const asset = node.data.target as SpecificLocale<Asset>;
      return <ContentfulImage asset={asset} />;
    },
    [BLOCKS.EMBEDDED_ENTRY]: (node, children) => {
      const contentType: CONTENT_TYPE = node.data.target.sys.contentType.sys.id;
      if (contentType === "hero") {
        return getHero(node);
      } else if (contentType === "feature") {
        return getFeature(node);
      } else if (contentType === "gridSection") {
        return getGridSection(node);
      } else if (
        /**
         * Add embedded content types here that exist in Contentful
         * but that we don't want to render. This is set up
         * to help us catch new rich text content types that we haven't
         * handled. If we add a new content type to Contentful
         * and it's not handled here, a type error will be thrown
         */
        contentType === "navContainer" ||
        contentType === "navItem" ||
        contentType === "accordionItem" ||
        contentType === "card" ||
        contentType === "migration" ||
        contentType === "page" ||
        contentType === "post" ||
        contentType === "alertBanner" ||
        contentType === "accordion"
      ) {
        /**
         * Throw an error if we encounter a content type that we
         * haven't handled yet.
         */
      } else {
        assertUnreachable(contentType);
      }
    },
  },
};

type SectionType = "full" | "inset";

export interface Section {
  type: SectionType;
  nodes: TopLevelBlock[];
}

// This is used to separate parts of a rich text field into sections so we can wrap them differently (inset on the page vs. full width, etc.)
export function getSections(document: Document): Section[] {
  const sectionTypes: { [key in BLOCKS]?: SectionType } = {
    [BLOCKS.EMBEDDED_ENTRY]: "full",
  };
  const defaultSectionType: SectionType = "inset";
  return document.content.reduce<Section[]>((sections, node) => {
    // Figure out what section type we're aiming for for this node
    const targetSectionType = sectionTypes[node.nodeType] || defaultSectionType;
    // Get the last element of our sections array for the current section
    const section = sections.at(-1);
    if (section && section.type === targetSectionType) {
      // We have a section and it matches our target type, so add our node
      section.nodes.push(node);
    } else {
      // We either don't have a section at all, or it doesn't match our target type, so create a new one with our node in it
      sections.push({
        type: targetSectionType,
        nodes: [node],
      });
    }
    return sections;
  }, []);
}

export function createDocumentFromSection(section: Section): Document {
  return { content: section.nodes, nodeType: BLOCKS.DOCUMENT, data: {} };
}
