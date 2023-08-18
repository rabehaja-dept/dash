module.exports.description = "Create content model for Feature";

module.exports.up = (migration) => {
  const feature = migration.createContentType('feature')
    .name("Feature")
    .displayField("title")
    .description("A feature block showcasing an image and some text.");
  
  feature.createField("title")
    .name("Title")
    .type("Symbol")
    .localized(true)
    .required(true);

  feature.createField("body")
    .name("Body")
    .type("Text")
    .localized(true)
    .required(true);

  feature.createField("contentPosition")
    .name("Content Position")
    .type("Symbol")
    .required(true)
    .validations([{"in":["left","right"]}])
    .defaultValue({"en-US":"left"});

  feature.createField("textAlign")
    .name("Text Align")
    .type("Symbol")
    .required(true)
    .validations([{"in":["left","center"]}])
    .defaultValue({"en-US":"left"});

  feature.createField("backgroundColor")
    .name("Background Color")
    .type("Symbol");

  feature.createField("image")
    .name("Image")
    .type("Link")
    .localized(true)
    .validations([{"linkMimetypeGroup":["image"]}])
    .linkType("Asset");

  feature.createField("buttonLabel")
    .name("Button Label")
    .type("Symbol")
    .localized(true);

  feature.createField("buttonUrl")
    .name("Button URL")
    .type("Symbol");

  feature.changeFieldControl("title", "builtin", "singleLine");
  feature.changeFieldControl("body", "builtin", "markdown");
  feature.changeFieldControl("contentPosition", "builtin", "dropdown");
  feature.changeFieldControl("textAlign", "builtin", "dropdown");
  feature.changeFieldControl("backgroundColor", "builtin", "singleLine");
  feature.changeFieldControl("image", "builtin", "assetLinkEditor");
  feature.changeFieldControl("buttonLabel", "builtin", "singleLine");
  feature.changeFieldControl("buttonUrl", "builtin", "singleLine");
};

module.exports.down = migration => migration.deleteContentType("feature");
