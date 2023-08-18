import Link from "next/link";

export function assertUnreachable(x: never): never {
  throw new Error(`expected never to reach this case, but here we are: ${x}`);
}

export const cssClassesUsedForRichText = {
  p: "",
  h1: "",
  h2: "",
  h3: "",
  h4: "",
  h5: "",
  h6: "my-4 text-base font-bold tracking-tight",
  ul: "list-disc pl-7",
  ol: "list-decimal pl-7",
  li: "mb-2",
  a: "text-blue-600 underline",
  img: "rounded",
  blockquote: "border-l-8 pl-3",
  code: "bg-gray-100 p-1",
  pre: "bg-gray-100 p-4",
  table: "mb-5 w-full table-auto border text-sm",
  tr: "border-b px-4 pt-4 text-left font-medium",
  td: "border-b px-4 pt-4",
  em: "italic",
  strong: "font-bold",
  hr: "my-6",
  th: "border-b px-4 pt-4 text-left font-medium",
};

// @dash-remove-start contentstack
const transform = (node) => {
  if (node.type === "tag" && node.name === "p") {
    node.attribs.class = cssClassesUsedForRichText.p;
  } else if (node.type === "tag" && node.name === "h1") {
    node.attribs.class = cssClassesUsedForRichText.h1;
  } else if (node.type === "tag" && node.name === "h2") {
    node.attribs.class = cssClassesUsedForRichText.h2;
  } else if (node.type === "tag" && node.name === "h3") {
    node.attribs.class = cssClassesUsedForRichText.h3;
  } else if (node.type === "tag" && node.name === "h4") {
    node.attribs.class = cssClassesUsedForRichText.h4;
  } else if (node.type === "tag" && node.name === "h5") {
    node.attribs.class = cssClassesUsedForRichText.h5;
  } else if (node.type === "tag" && node.name === "h6") {
    node.attribs.class = cssClassesUsedForRichText.h6;
  } else if (node.type === "tag" && node.name === "ul") {
    node.attribs.class = cssClassesUsedForRichText.ul;
  } else if (node.type === "tag" && node.name === "ol") {
    node.attribs.class = cssClassesUsedForRichText.ol;
  } else if (node.type === "tag" && node.name === "li") {
    node.attribs.class = cssClassesUsedForRichText.li;
  } else if (node.type === "tag" && node.name === "blockquote") {
    node.attribs.class = cssClassesUsedForRichText.blockquote;
  } else if (node.type === "tag" && node.name === "pre") {
    node.attribs.class = cssClassesUsedForRichText.pre;
  } else if (node.type === "tag" && node.name === "code") {
    node.attribs.class = cssClassesUsedForRichText.code;
  } else if (node.type === "tag" && node.name === "em") {
    node.attribs.class = cssClassesUsedForRichText.em;
  } else if (node.type === "tag" && node.name === "strong") {
    node.attribs.class = cssClassesUsedForRichText.strong;
  } else if (node.type === "tag" && node.name === "a") {
    if (node.children) {
      const child = node.children[0];
      if (child.type === "text" && child.data) {
        return <Link href={node.attribs.href}>{child.data}</Link>;
      }
    }
  } else if (node.type === "tag" && node.name === "table") {
    node.attribs.class = cssClassesUsedForRichText.table;
  } else if (node.type === "tag" && node.name === "tr") {
    node.attribs.class = cssClassesUsedForRichText.tr;
  } else if (node.type === "tag" && node.name === "td") {
    node.attribs.class = cssClassesUsedForRichText.td;
  }
};
