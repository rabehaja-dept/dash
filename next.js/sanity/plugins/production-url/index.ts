/**
 * This plugin sets up the "Open preview (CTRL + ALT + O)" in the dropdown menu that hosts
 * other actions like "Review changes" and "Inspect"
 * @TODO the code in this plugin is a candidate for moving into `@sanity/preview-kit/studio`
 */

import { type Slug, definePlugin } from "sanity";
import type { SanityClient } from "next-sanity";

export const productionUrl = definePlugin<{
  previewSecretId: `${string}.${string}`;
  types: string[];
  apiVersion?: string;
}>(({ previewSecretId, types: _types, apiVersion = "2022-11-17" }) => {
  if (!previewSecretId) {
    throw new TypeError("`previewSecretId` is required");
  }
  if (!previewSecretId.includes(".")) {
    throw new TypeError(
      "`previewSecretId` must contain a `.` to ensure it can only be queried by authenticated users"
    );
  }
  if (!_types || _types.length === 0) {
    throw new TypeError("`types` is required");
  }
  const types = new Set(_types);
  return {
    name: "productionUrl",
    document: {
      productionUrl: async (prev, { document, getClient }) => {
        const url = new URL("/api/sanity/preview", location.origin);

        const client = getClient({ apiVersion });
        const secret = await getSecret(client, previewSecretId, true);
        if (secret) {
          url.searchParams.set("secret", secret);
        }
        const slug = (document.slug as Slug)?.current;
        if (slug) {
          url.searchParams.set("slug", slug);
        }

        if (types.has(document._type)) {
          url.searchParams.set("documentType", document._type);
          return url.toString();
        }

        return prev;
      },
    },
  };
});

// updated within the hour, if it's older it'll create a new secret or return null
const query = (ttl: number) =>
  /* groq */ `*[_id == $id && dateTime(_updatedAt) > dateTime(now()) - ${ttl}][0].secret`;

const tag = "preview.secret";

export async function getSecret(
  client: SanityClient,
  id: `${string}.${string}`,
  createIfNotExists?: true | (() => string)
): Promise<string | null> {
  const secret = await client.fetch<string | null>(
    // Use a TTL of 1 hour when reading the secret, while using a 30min expiry if `createIfNotExists` is defined to avoid a race condition where
    // a preview pane could get a Secret and use it just as it expires. Twice the TTL gives a wide margin to ensure that when the secret is read
    // it's recent enough to be valid no matter if it's used in an iframe URL, or a "Open Preview" URL.
    query(createIfNotExists ? 60 * 30 : 60 * 60),
    { id }
  );
  if (!secret && createIfNotExists) {
    const newSecret =
      createIfNotExists === true
        ? Math.random().toString(36).slice(2)
        : createIfNotExists();
    try {
      const patch = client.patch(id).set({ secret: newSecret });
      await client
        .transaction()
        .createIfNotExists({ _id: id, _type: id })
        .patch(patch)
        .commit({ tag });
      return newSecret;
    } catch (err) {
      console.error(
        "Failed to create a new preview secret. Ensure the `client` has a `token` specified that has `write` permissions.",
        err
      );
    }
  }

  return secret;
}
