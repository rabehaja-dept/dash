module.exports.description = "Create content model for Post";

module.exports.up = (migration) => {
  const post = migration.createContentType('post')
    .name("Post")
    .displayField("title")
    .description("");
  
  post.createField("title")
    .name("Title")
    .type("Symbol")
    .localized(true)
    .required(true);

  post.createField("slug")
    .name("Slug")
    .type("Symbol")
    .required(true)
    .validations([{"unique":true}]);

  post.createField("image")
    .name("Image")
    .type("Link")
    .validations([{"linkMimetypeGroup":["image"]}])
    .linkType("Asset");

  post.createField("description")
    .name("Description")
    .type("Symbol")
    .localized(true);

  post.createField("body")
    .name("Body")
    .type("RichText")
    .localized(true)
    .validations([{"enabledMarks":["bold","italic","underline","code"],"message":"Only bold, italic, underline, and code marks are allowed"},{"enabledNodeTypes":["heading-1","heading-2","heading-3","heading-4","heading-5","heading-6","ordered-list","unordered-list","hr","blockquote","embedded-asset-block","hyperlink","entry-hyperlink","table"],"message":"Only heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, asset, link to Url, link to entry, and table nodes are allowed"},{"nodes":{}}]);

  post.changeFieldControl("title", "builtin", "singleLine");
  post.changeFieldControl("slug", "builtin", "slugEditor");
  post.changeFieldControl("image", "builtin", "assetLinkEditor", {"helpText":"Optionally provide an image to be used as the OpenGraph tag image which will generally appear when sharing this page on social media.","showLinkEntityAction":true,"showCreateEntityAction":true});
  post.changeFieldControl("description", "builtin", "singleLine", {"helpText":"This is used for SEO tags, and will not appear in the content of the page. If empty, the SEO tag will be auto-generated from the beginning of the body of the post."});
  post.changeFieldControl("body", "builtin", "richTextEditor");
};

module.exports.down = migration => migration.deleteContentType("post");
