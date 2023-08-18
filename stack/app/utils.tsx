import { ReactElement } from "react";
import { useMatches } from "@remix-run/react";
import { useMemo } from "react";
import ReactHtmlParser from "react-html-parser"; // @dash-remove contentstack
import { AnyNode } from "domhandler";
import { Link } from "~/components/interactive/Link";
import fetch from "node-fetch";
import type { User } from "~/models/user.server"; // @dash-remove db
/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

// @dash-remove-start db
function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}
// @dash-remove-end

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function assertUnreachable(x: never): never {
  throw new Error(`expected never to reach this case, but here we are: ${x}`);
}

export function getAlternateHref(
  publiclyAvailableOrigin: string,
  langCode?: string
): string {
  const urlSplitted = publiclyAvailableOrigin.split("://");
  if (urlSplitted.length !== 2) {
    throw new Error(
      `Invalid publiclyAvailableOrigin: ${publiclyAvailableOrigin}`
    );
  }
  const [protocol, domain] = urlSplitted;
  if (langCode) {
    // We are using a subdomain for the language, so we need to add the language only to the domain.
    // For example, if the publiclyAvailableOrigin is https://example.com, and the langCode is "fr-CA",
    // the result will be https://fr.example.com
    const lang = new Intl.Locale(langCode).language;
    return `${protocol}://${lang}.${domain}`;
  }
  return `${protocol}://${domain}`;
}

export async function api<T>(url: string, query: string): Promise<T> {
  const res: any = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      query: query,
    }),
    headers: {
      "content-type": "application/json",
    },
  });
  const res_1 = await res.json();
  const resJson = res_1.result;
  const res_2 = {
    ok: res.ok,
    status: res.status,
    body: resJson,
  };
  if (res_2.ok) {
    return res_2.body;
  }
  return Promise.reject({
    status: res_2.status,
    message: res_2.body,
  });
}

export const cssClassesUsedForRichText = {
  p: "mb-5",
  h1: "my-4 text-4xl font-bold tracking-tigh",
  h2: "my-4 text-3xl font-bold tracking-tight",
  h3: "my-4 text-2xl font-bold tracking-tight",
  h4: "my-4 text-xl font-bold tracking-tight",
  h5: "my-4 text-lg font-bold tracking-tight",
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
const transform = (node: AnyNode) => {
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

/**
 * This function takes a single argument, "html", which is expected to be of type "string".
 * It uses the "ReactHtmlParser" library to parse the HTML string and return an array of React elements.
 * The "transform" function is passed as an argument to the "ReactHtmlParser" library
 * and is used to modify the parsed HTML elements as they are being converted to React elements.
 *
 */
export function renderHTMLRTE(html: string): ReactElement[] {
  return ReactHtmlParser(html, { transform: transform });
}
// @dash-remove-end
