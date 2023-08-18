module.exports.description = "Create content model for Hero";

module.exports.up = (migration) => {
  const hero = migration.createContentType('hero')
    .name("Hero")
    .displayField("title")
    .description("");
  
  hero.createField("title")
    .name("Title")
    .type("Symbol")
    .localized(true)
    .required(true);

  hero.createField("size")
    .name("Size")
    .type("Symbol")
    .required(true)
    .validations([{"in":["small","medium","large","responsive"]}]);

  hero.createField("pretext")
    .name("Pretext")
    .type("Symbol")
    .localized(true);

  hero.createField("subtext")
    .name("Subtext")
    .type("Symbol")
    .localized(true);

  hero.createField("backgroundColor")
    .name("Background Color")
    .type("Symbol");

  hero.createField("backgroundImage")
    .name("Background Image")
    .type("Link")
    .validations([{"linkMimetypeGroup":["image","video"]}])
    .linkType("Asset");

  hero.createField("buttonLabel")
    .name("Button Label")
    .type("Symbol")
    .localized(true);

  hero.createField("buttonUrl")
    .name("Button URL")
    .type("Symbol")
    .localized(true);

  hero.createField("topMask")
    .name("Top Mask")
    .type("Boolean")
    .defaultValue({"en-US":false});

  hero.createField("bottomMask")
    .name("Bottom Mask")
    .type("Boolean")
    .defaultValue({"en-US":true});

  hero.createField("rounded")
    .name("Rounded")
    .type("Boolean")
    .defaultValue({"en-US":false});

  hero.changeFieldControl("title", "builtin", "singleLine");
  hero.changeFieldControl("size", "builtin", "dropdown");
  hero.changeFieldControl("pretext", "builtin", "singleLine");
  hero.changeFieldControl("subtext", "builtin", "singleLine");
  hero.changeFieldControl("backgroundColor", "builtin", "singleLine", {"helpText":"Any value that can be applied to the `background` CSS property "});
  hero.changeFieldControl("backgroundImage", "builtin", "assetLinkEditor", {"helpText":"This will override background color if present.","showLinkEntityAction":true,"showCreateEntityAction":true});
  hero.changeFieldControl("buttonLabel", "builtin", "singleLine");
  hero.changeFieldControl("buttonUrl", "builtin", "singleLine");
  hero.changeFieldControl("topMask", "builtin", "boolean", {"helpText":"Curved white mask over the top part of the hero.","trueLabel":"Yes","falseLabel":"No"});
  hero.changeFieldControl("bottomMask", "builtin", "boolean", {"helpText":"Curved white mask over the bottom part of the hero.","trueLabel":"Yes","falseLabel":"No"});
  hero.changeFieldControl("rounded", "builtin", "boolean", {"helpText":"Round the edges of the hero.","trueLabel":"Yes","falseLabel":"No"});
};

module.exports.down = migration => migration.deleteContentType("hero");
