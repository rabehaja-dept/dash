import type { Options } from "@contentful/rich-text-react-renderer";
import type { Document, TopLevelBlock } from "@contentful/rich-text-types";
import { INLINES } from "@contentful/rich-text-types";
import { BLOCKS } from "@contentful/rich-text-types";
import type {
  CONTENT_TYPE,
  Asset,
  SpecificLocale,
} from "~/@types/generated/contentful";
import { Link } from "~/components/interactive/Link";
import { assertUnreachable, cssClassesUsedForRichText } from "~/utils";
import { ContentfulAsset } from "./components/ContentfulAsset";
import {
  getAccordion,
  getEntryPath,
  getFeature,
  getGridSection,
  getHero,
} from "./contentful-render";

/**
 * This function returns components generated from a Contentful Rich Text entry.
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
      return <Link to={getEntryPath(node.data.target)}>{children}</Link>;
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
    [BLOCKS.HR]: (/* assume no children */) => (
      <hr className={cssClassesUsedForRichText.hr} />
    ),
    [BLOCKS.UL_LIST]: (node, children) => (
      <ul className={cssClassesUsedForRichText.ul}>{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node, children) => (
      <ol className={cssClassesUsedForRichText.ol}>{children}</ol>
    ),
    [BLOCKS.PARAGRAPH]: (node, children) => (
      <p className={cssClassesUsedForRichText.p}>{children}</p>
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
      return <ContentfulAsset asset={asset} />;
    },
    [BLOCKS.EMBEDDED_ENTRY]: (node, children) => {
      const contentType: CONTENT_TYPE = node.data.target.sys.contentType.sys.id;
      if (contentType === "hero") {
        return getHero(node);
      } else if (contentType === "feature") {
        return getFeature(node);
      } else if (contentType === "gridSection") {
        return getGridSection(node);
      } else if (contentType === "accordion") {
        return getAccordion(node);
      } else if (
        contentType === "navContainer" ||
        contentType === "navItem" ||
        contentType === "accordionItem" ||
        contentType === "card" ||
        contentType === "migration" ||
        contentType === "page" ||
        contentType === "post" ||
        contentType === "alertBanner"
      ) {
        // This is intentionally empty to capture content types that we know exist and are confident will never be embedded in a rich text document
        // It's here to make the assertUnreachable(contentType) below help us catch new content types and either add to this list, or handle appropriately above
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
