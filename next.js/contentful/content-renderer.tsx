import type { Block, Inline, Text } from "@contentful/rich-text-types";
import type {
  IFeatureFields,
  IGridSectionFields,
  IHeroFields,
  SpecificLocaleFields,
} from "~/@types/generated/contentful";

const SEPARATOR_LENGTH = 5; // 1 space + 3 dots + 1 space
const MAX_DESCRIPTION_LENGTH = 155;
const TOTAL_CONTENTFUL_META_DESCRIPTION_LENGTH =
  MAX_DESCRIPTION_LENGTH - SEPARATOR_LENGTH;
const WHITE_SPACES_REGEX = /\s+/;

/**
 * This function creates a srcSet in the format url?w={withForIteration}&q=80&fm=webp {widthForIteration}w for the given url and width.
 * The withForIteration it's calculated by multiplying the iteration number by the increment. For example, if the increment is 100, the first iteration will be 100, the second 200, etc.
 * @param url The url of the image
 * @param width The width of the image. This is used to calculate the number of iterations.
 * @param increment The increment to use for the srcSet. By default this is 500. This means that the srcSet will have 500w, 1000w, 1500w, etc.
 * @returns a string that can be used as a srcset attribute
 */
export function getSrcSet({
  width,
  url,
  increment = 500,
}: {
  width: number;
  url: string;
  increment?: number;
}) {
  let srcSetItems = [];
  for (let i = 1; i < width / increment; i++) {
    const width = i * increment;
    srcSetItems.push(`${url}?w=${width}&q=80&fm=webp ${width}w`);
  }
  return srcSetItems.join(",");
}

/**
 *  Generates the description for a contentful meta tag
 * @param node The node to generate a description from.
 * @param description The current description
 * @returns a string that is no longer than 155 characters
 */
export function getDescriptionFromNode(
  node: Block | Inline,
  description: string = ""
): string {
  for (const childNode of node.content) {
    if (description.length >= TOTAL_CONTENTFUL_META_DESCRIPTION_LENGTH) {
      break;
    }
    if (childNode.nodeType === "text") {
      for (const word of getWordsFromTextNode(childNode)) {
        if (word.length <= getMaxWordLength(description)) {
          description = appendWordToDescription(description, word);
        } else {
          description = appendWordToDescription(description, "...");
          break;
        }
      }
    } else {
      // Keep going deeper in the tree to find some text to add to the description
      description = getDescriptionFromNode(childNode, description);
    }
  }
  return description;
}

/**
 * We're tracking towards a total description length of 155.
 * We need 5 characters (SEPARATOR_LENGTH) for ` ${word} ...` (two surrounding spaces and three periods for the ellipsis)
 * @param description
 * @returns the difference between 150 and our current description length
 */
export function getMaxWordLength(description: string) {
  return TOTAL_CONTENTFUL_META_DESCRIPTION_LENGTH - description.length;
}

export function getWordsFromTextNode(childNode: Text) {
  const textWithoutCarriageReturns = childNode.value.trim(); // to remove carriage returns and other whitespace characters
  return textWithoutCarriageReturns.split(WHITE_SPACES_REGEX);
}

export function appendWordToDescription(description: string, word: string) {
  if (description !== "") {
    // If there's something in the description already, then prepend a space (there's a word before this word)
    description += " ";
  }
  description += word;
  return description;
}
export function getGridSection(node: Block | Inline) {
  const fields = node.data.target
    .fields as SpecificLocaleFields<IGridSectionFields>;
  return <div>Grid Section</div>;
}

export function getFeature(node: Block | Inline) {
  const fields = node.data.target
    .fields as SpecificLocaleFields<IFeatureFields>;
  return <div>Feature</div>;
}

export function getHero(node: Block | Inline) {
  const fields = node.data.target.fields as SpecificLocaleFields<IHeroFields>;
  return <div>Hero</div>;
}
