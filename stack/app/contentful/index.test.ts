import type { Asset, Link, Sys } from "contentful";
import type { Document, TopLevelBlock } from "@contentful/rich-text-types";
import { BLOCKS } from "@contentful/rich-text-types";
import { getSections } from "./index";
import { getSrcSet, getDescriptionFromNode } from "./contentful-render";

function mockLink(): Link<"ContentType"> {
  return {
    id: "linkid",
    type: "Link",
    linkType: "ContentType",
  };
}

function mockSys(): Sys {
  return {
    type: "Type",
    id: "id",
    createdAt: "createdatdate",
    updatedAt: "updatedatdate",
    revision: 1,
    locale: "locale",
    contentType: {
      sys: mockLink(),
    },
  };
}

function mockAsset(): Asset {
  return {
    sys: mockSys(),
    fields: {
      title: "title",
      description: "description",
      file: {
        url: "//images.ctfassets.net/jcdjo56lmw8q/64oLTXDwMWgAWJiThh3riH/bc22b79982445b223c827d05d93ae94a/heroBackground.png",
        details: {
          size: 2117886,
          image: {
            width: 1920,
            height: 933,
          },
        },
        fileName: "heroBackground.png",
        contentType: "image/png",
      },
    },
    metadata: {
      tags: [],
    },
    toPlainObject: () => ({}),
  };
}

function mockEmbeddedEntryBlock(): TopLevelBlock {
  return {
    nodeType: BLOCKS.EMBEDDED_ENTRY,
    data: {
      target: {
        metadata: {
          tags: [],
        },
        sys: mockSys(),
        fields: {
          title: "Welcome to New York",
          subtext: "It's been waiting for you",
          // The Math.random() is to make each mocked entry unique to make sure we're checking for the right one
          description: `${Math.random()}`,
        },
      },
    },
    content: [],
  };
}

function mockEmbeddedParagraph(
  value: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus semper eget duis at tellus at urna. Diam sollicitudin tempor id eu. Enim blandit volutpat maecenas volutpat blandit. Varius morbi enim nunc faucibus a. Diam in arcu cursus euismod quis viverra. Eget magna fermentum iaculis eu non diam. Felis imperdiet proin fermentum leo vel orci porta non pulvinar. Volutpat commodo sed egestas egestas fringilla phasellus faucibus scelerisque eleifend. Elementum sagittis vitae et leo duis.",
  random: boolean = true
): TopLevelBlock {
  return {
    nodeType: BLOCKS.PARAGRAPH,
    data: {},
    content: [
      {
        nodeType: "text",
        // The Math.random() is to make each mocked entry unique to make sure we're checking for the right one
        value: `${value}${random ? Math.random() : ""}\r`,
        marks: [],
        data: {},
      },
    ],
  };
}

function mockDocument(content: TopLevelBlock[]): Document {
  return {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content,
  };
}

test("getSrcSetFromAsset calculates srcset from a contentful asset", () => {
  const testWithIncrement = (asset: Asset, increment: number) => {
    const srcSetParts = getSrcSet({
      width: asset.fields.file.details.image!.width,
      url: asset.fields.file.url,
      increment,
    }).split(",");
    expect(srcSetParts.length).toBe(
      Math.floor(asset.fields.file.details.image!.width / increment)
    );
    srcSetParts.forEach((part, index) => {
      expect(part).toMatch(new RegExp(`.*${(index + 1) * increment}w$`));
      expect(part).toContain("fm=webp");
    });
  };
  const asset = mockAsset();
  testWithIncrement(asset, 100);
  testWithIncrement(asset, 250);
  testWithIncrement(asset, 500);
  testWithIncrement(asset, 1000);
  testWithIncrement(asset, 500);
});

test("getSections splits a contentful document into sections", () => {
  const document = mockDocument([
    mockEmbeddedEntryBlock(),
    mockEmbeddedParagraph(),
    mockEmbeddedParagraph(),
    mockEmbeddedParagraph(),
    mockEmbeddedEntryBlock(),
    mockEmbeddedParagraph(),
    mockEmbeddedParagraph(),
    mockEmbeddedEntryBlock(),
    mockEmbeddedParagraph(),
  ]);
  const sections = getSections(document);
  expect(sections.length).toBe(6);
  expect(sections[0].type).toBe("full");
  expect(sections[0].nodes).toEqual([document.content[0]]);
  expect(sections[1].type).toBe("inset");
  expect(sections[1].nodes).toEqual([
    document.content[1],
    document.content[2],
    document.content[3],
  ]);
  expect(sections[2].type).toBe("full");
  expect(sections[2].nodes).toEqual([document.content[4]]);
  expect(sections[3].type).toBe("inset");
  expect(sections[3].nodes).toEqual([document.content[5], document.content[6]]);
  expect(sections[4].type).toBe("full");
  expect(sections[4].nodes).toEqual([document.content[7]]);
  expect(sections[5].type).toBe("inset");
  expect(sections[5].nodes).toEqual([document.content[8]]);
});

test("getDescriptionFromNode generates an appropriate meta description", () => {
  // Test the basics
  const description1 = getDescriptionFromNode(
    mockDocument([
      mockEmbeddedEntryBlock(),
      mockEmbeddedParagraph(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus semper eget duis at tellus at urna. Diam sollicitudin tempor id eu.",
        false
      ),
      mockEmbeddedEntryBlock(),
      mockEmbeddedParagraph(
        "Eget magna fermentum iaculis eu non diam. Felis imperdiet proin fermentum leo vel orci porta non pulvinar.",
        false
      ),
      mockEmbeddedParagraph(
        "Volutpat commodo sed egestas egestas fringilla phasellus faucibus scelerisque eleifend. Elementum sagittis vitae et leo duis.",
        false
      ),
    ])
  );
  expect(description1.length).toBeLessThanOrEqual(155);
  expect(description1).toBe(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus semper eget duis at ..."
  );
  // Test concatenation of several nodes
  const description2 = getDescriptionFromNode(
    mockDocument([
      mockEmbeddedParagraph("Lorem ipsum dolor sit amet.", false),
      mockEmbeddedEntryBlock(),
      mockEmbeddedParagraph("Eget magna fermentum iaculis eu non diam.", false),
      mockEmbeddedParagraph(
        "Felis imperdiet proin fermentum leo vel orci porta non pulvinar. Volutpat commodo sed egestas egestas fringilla phasellus faucibus scelerisque eleifend. Elementum sagittis vitae et leo duis.",
        false
      ),
    ])
  );
  expect(description2.length).toBeLessThanOrEqual(155);
  expect(description2).toBe(
    "Lorem ipsum dolor sit amet. Eget magna fermentum iaculis eu non diam. Felis imperdiet proin fermentum leo vel orci porta non pulvinar. Volutpat commodo ..."
  );
  // Test no ellipsis on the end if it's a shorter bit of text
  const description3 = getDescriptionFromNode(
    mockDocument([
      mockEmbeddedParagraph("Lorem ipsum dolor sit amet.", false),
      mockEmbeddedParagraph("Eget magna fermentum iaculis eu non diam.", false),
    ])
  );
  expect(description3.length).toBeLessThanOrEqual(155);
  expect(description3).toBe(
    "Lorem ipsum dolor sit amet. Eget magna fermentum iaculis eu non diam."
  );
  // Test exact lengths to make sure we create the correct length of meta description
  const description4 = getDescriptionFromNode(
    mockDocument([
      mockEmbeddedParagraph(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus semper eget duis at a other words after",
        false
      ),
    ])
  );
  expect(description4.length).toBe(155);
  expect(description4).toBe(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus semper eget duis at a ..."
  );
  const description5 = getDescriptionFromNode(
    mockDocument([
      mockEmbeddedParagraph(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus semper eget duis at be other words after",
        false
      ),
    ])
  );
  expect(description5.length).toBe(153);
  expect(description5).toBe(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus semper eget duis at ..."
  );
});
