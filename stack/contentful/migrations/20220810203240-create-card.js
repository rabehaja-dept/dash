module.exports.description = "Create content model for Card";

module.exports.up = (migration) => {
  const card = migration.createContentType('card')
    .name("Card")
    .displayField("title")
    .description("A card that appears inside a grid section.");
  
  card.createField("title")
    .name("Title")
    .type("Symbol")
    .localized(true)
    .required(true);

  card.createField("body")
    .name("Body")
    .type("Text")
    .localized(true)
    .required(true);

  card.createField("image")
    .name("Image")
    .type("Link")
    .localized(true)
    .validations([{"linkMimetypeGroup":["image"]}])
    .linkType("Asset");

  card.createField("buttonLabel")
    .name("Button Label")
    .type("Symbol")
    .localized(true);

  card.createField("buttonUrl")
    .name("Button URL")
    .type("Symbol");

  card.changeFieldControl("title", "builtin", "singleLine");
  card.changeFieldControl("body", "builtin", "markdown");
  card.changeFieldControl("image", "builtin", "assetLinkEditor");
  card.changeFieldControl("buttonLabel", "builtin", "singleLine");
  card.changeFieldControl("buttonUrl", "builtin", "singleLine");
};

module.exports.down = migration => migration.deleteContentType("card");
