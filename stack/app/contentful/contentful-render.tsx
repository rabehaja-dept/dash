import type { Block, Inline, Text } from "@contentful/rich-text-types";
import type {
  Asset,
  CONTENT_TYPE,
  IAccordionFields,
  ICardFields,
  IFeatureFields,
  IGridSectionFields,
  IHeroFields,
  IPage,
  IPost,
  SpecificLocale,
  SpecificLocaleFields,
} from "~/@types/generated/contentful";
import {
  Feature,
  Section as SectionComponent,
  Grid,
  Inset,
  Accordion,
  Hero,
  HeroBackground,
} from "~/components/layout";
import { Card } from "~/components/interactive";
import { faqMetadata } from "~/seo/faq-metadata";
import { ImgHTMLAttributes } from "react";
import { SupportedLang } from "~/i18n-config";

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

export function getImageProps(
  asset: SpecificLocale<Asset>
): ImgHTMLAttributes<HTMLImageElement>;
export function getImageProps(
  asset: Asset,
  options: { locale: SupportedLang["code"] }
): ImgHTMLAttributes<HTMLImageElement>;
export function getImageProps(
  asset: Asset | SpecificLocale<Asset>,
  options?: { locale: SupportedLang["code"] }
): unknown {
  /**
   * If you're looking to add translations, make sure to add the locale to
   * Contentful before you try to use it (see the README).
   * If you add a "supportedLang" before setting up contentful (and then regenerating types),
   * you'll see type errors in this file.
   */
  const locale = options?.locale;

  const file = locale
    ? (asset as Asset).fields.file[locale]
    : (asset as SpecificLocale<Asset>).fields.file;
  if (file && !file.details.image) {
    throw new Error(
      "tried to get image props from an asset that's not an image"
    );
  }

  return {
    src: file?.url,
    srcSet:
      file &&
      getSrcSet({
        width: file.details.image!.width,
        url: file.url,
      }),
    alt: locale
      ? (asset as Asset).fields.description[locale]
      : (asset as SpecificLocale<Asset>).fields.description,
  };
}

export function getAccordion(node: Block | Inline) {
  const fields = node.data.target
    .fields as SpecificLocaleFields<IAccordionFields>;

  const isFAQAccordion = fields.isFAQ;
  const containsFAQs = fields?.accordionItems?.length;

  return (
    <Inset>
      <Accordion
        title={fields.title}
        pretext={fields.pretext}
        items={fields.accordionItems.map((item) => ({
          title: item.fields.title,
          body: item.fields.body,
        }))}
        ariaIdPrefix={node.data.target.sys.id}
      />
      {/**
       * json-ld can be placed anywhere, so we just do it here
       * See: https://stackoverflow.com/a/30956615/8383318
       */}
      {isFAQAccordion && containsFAQs && getJsonLdForFAQAccordion(fields)}
    </Inset>
  );
}

function getJsonLdForFAQAccordion(
  fields: SpecificLocaleFields<IAccordionFields>
) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
                    <script type="application/ld+json">${JSON.stringify(
                      faqMetadata(
                        fields.accordionItems.map((item) => ({
                          question: item.fields.title,
                          answer: item.fields.body,
                        }))
                      )
                    )}</script>
                  `,
      }}
    />
  );
}

export function getGridSection(node: Block | Inline) {
  const fields = node.data.target
    .fields as SpecificLocaleFields<IGridSectionFields>;
  return (
    <Inset>
      <SectionComponent title={fields.title} subtext={fields.subtext}>
        <Grid carousel cols={fields.maxColumns}>
          {fields.cards.map((card, index) => {
            return (
              <Card
                key={index}
                title={card.fields.title}
                description={card.fields.body}
                imageProps={
                  card.fields.image && getImageProps(card.fields.image)
                }
                button={getButtonProps(card.fields)}
              />
            );
          })}
        </Grid>
      </SectionComponent>
    </Inset>
  );
}

export function getFeature(node: Block | Inline) {
  const fields = node.data.target
    .fields as SpecificLocaleFields<IFeatureFields>;
  return (
    <Feature
      title={fields.title}
      description={fields.body}
      imageProps={fields.image && getImageProps(fields.image)}
      contentPosition={fields.contentPosition}
      textAlign={fields.textAlign}
      backgroundColor={fields.backgroundColor}
      button={getButtonProps(fields)}
    />
  );
}

export function getHero(node: Block | Inline) {
  const fields = node.data.target.fields as SpecificLocaleFields<IHeroFields>;
  return (
    <Hero
      title={fields.title}
      size={fields.size}
      pretext={fields.pretext}
      subtext={fields.subtext}
      background={getHeroBackground(fields)}
      button={getButtonProps(fields)}
    />
  );
}

function getButtonProps(
  fields: SpecificLocaleFields<IHeroFields | IFeatureFields | ICardFields>
):
  | {
      label: string;
      to: string;
    }
  | undefined {
  if (fields.buttonLabel && fields.buttonUrl) {
    return {
      label: fields.buttonLabel,
      to: fields.buttonUrl,
    };
  }
}

function getHeroBackground(
  fields: SpecificLocaleFields<IHeroFields>
): HeroBackground | undefined {
  if (fields.backgroundImage) {
    return {
      imageProps: getImageProps(fields.backgroundImage),
    };
  } else if (fields.backgroundColor) {
    return {
      color: fields.backgroundColor,
    };
  }
}

export function getEntryPath(entry: IPage | IPost): string {
  const contentType: CONTENT_TYPE = entry.sys.contentType.sys.id;
  if (contentType === "page") {
    return getPagePath(entry as IPage);
  } else if (contentType === "post") {
    return getPostPath(entry as IPost);
  } else {
    throw new Error("tried to get path to an unhandled entry type");
  }
}

function getPagePath(page: IPage): string {
  return `/contentful/${page.fields.slug}`;
}

function getPostPath(post: IPost): string {
  return `/contentful/blog/${post.fields.slug}`;
}
