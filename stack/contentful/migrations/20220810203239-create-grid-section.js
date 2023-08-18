module.exports.description = "Create content model for Grid Section";

module.exports.up = (migration) => {
  const gridSection = migration.createContentType('gridSection')
    .name("Grid Section")
    .displayField("title")
    .description("A grid section containing a title and cards.");
  
  gridSection.createField("title")
    .name("Title")
    .type("Symbol")
    .localized(true);

  gridSection.createField("subtext")
    .name("Subtext")
    .type("Symbol")
    .localized(true);

  gridSection.createField("maxColumns")
    .name("Max Columns")
    .type("Integer")
    .required(true);

  gridSection.createField("cards")
    .name("Cards")
    .type("Array")
    .required(true)
    .items({"type":"Link","validations":[{"linkContentType":["card"]}],"linkType":"Entry"});

  gridSection.changeFieldControl("title", "builtin", "singleLine");
  gridSection.changeFieldControl("subtext", "builtin", "singleLine");
  gridSection.changeFieldControl("maxColumns", "builtin", "numberEditor", {"helpText":"The maximum number of columns at a large breakpoint. This will likely be reduced to fewer columns for smaller breakpoints, like tablet and mobile."});
  gridSection.changeFieldControl("cards", "builtin", "entryLinksEditor");
};

module.exports.down = migration => migration.deleteContentType("gridSection");
