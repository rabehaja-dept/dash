/**
 * This API route is used for previewing unpublished content.
 * It sets a cookie on the response that enables preview mode and
 * redirects to the path for the unpublished content.
 * @see https://nextjs.org/docs/advanced-features/preview-mode
 *
 * To disable preview mode, simply make a GET request to the
 * `api/contentful/exit-preview` route.
 */

export default async function preview(req, res) {
  const {
    secret,
    slug,
    contentType,
  }: { secret: string; slug: string; contentType: "post" | "page" } = req.query;

  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (!slug || !contentType) {
    return res.status(400).json({
      message:
        "Invalid request: `slug` and `contentType` query parameters are required",
    });
  }

  // Enable Draft Mode
  res.setDraftMode({ enable: true });

  // Set your custom url structure based on content type here:
  const url =
    contentType === "page"
      ? `/contentful/${slug}`
      : `/contentful/posts/${slug}`;

  res.setHeader("Content-Type", "text/html");
  res.write(
    `<!DOCTYPE html><html><head><meta http-equiv="Refresh" content="0; url=${url}" />
    <script>window.location.href = '${url}'</script>
    </head>
    </html>`
  );
  res.end();
}
