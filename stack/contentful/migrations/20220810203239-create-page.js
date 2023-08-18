module.exports.description = "Create content model for Page";

module.exports.up = (migration) => {
  const page = migration.createContentType('page')
    .name("Page")
    .displayField("title")
    .description("");
  
  page.createField("title")
    .name("Title")
    .type("Symbol")
    .localized(true)
    .required(true);

  page.createField("slug")
    .name("Slug")
    .type("Symbol")
    .required(true)
    .validations([{"unique":true}]);

  page.createField("openGraphImage")
    .name("OpenGraph Image")
    .type("Link")
    .validations([{"linkMimetypeGroup":["image"]}])
    .linkType("Asset");

  page.createField("description")
    .name("Description")
    .type("Symbol")
    .localized(true)
    .required(true);

  page.createField("body")
    .name("Body")
    .type("RichText")
    .localized(true)
    .validations([{"enabledMarks":["bold","italic","underline","code"],"message":"Only bold, italic, underline, and code marks are allowed"},{"enabledNodeTypes":["heading-1","heading-2","heading-3","heading-4","heading-5","heading-6","ordered-list","unordered-list","hr","blockquote","embedded-entry-block","embedded-asset-block","table","hyperlink","entry-hyperlink"],"message":"Only heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, block entry, asset, table, link to Url, and link to entry nodes are allowed"},{"nodes":{"embedded-entry-block":[{"linkContentType":["accordion","feature","gridSection","hero"]}],"entry-hyperlink":[{"linkContentType":["page","post"]}]}}]);

  page.changeFieldControl("title", "builtin", "singleLine", {"helpText":"This is used as the page title and for SEO tags, and will not appear in the content of the page."});
  page.changeFieldControl("slug", "builtin", "slugEditor");
  page.changeFieldControl("openGraphImage", "builtin", "assetLinkEditor", {"helpText":"Optionally provide an image to be used as the OpenGraph tag image which will generally appear when sharing this page on social media.","showLinkEntityAction":true,"showCreateEntityAction":true});
  page.changeFieldControl("description", "builtin", "singleLine", {"helpText":"This is used for SEO tags, and will not appear in the content of the page."});
  page.changeFieldControl("body", "builtin", "richTextEditor", {"helpText":"Use the Embed button to add components such as a Hero."});
};

module.exports.down = migration => migration.deleteContentType("page");
