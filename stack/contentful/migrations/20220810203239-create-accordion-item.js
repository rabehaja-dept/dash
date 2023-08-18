module.exports.description = "Create content model for Accordion Item";

module.exports.up = (migration) => {
  const accordionItem = migration.createContentType('accordionItem')
    .name("Accordion Item")
    .displayField("title")
    .description("A single expandable/collapsible accordion item.");
  
  accordionItem.createField("title")
    .name("Title")
    .type("Symbol")
    .localized(true)
    .required(true);

  accordionItem.createField("body")
    .name("Body")
    .type("Text")
    .localized(true)
    .required(true);

  accordionItem.changeFieldControl("title", "builtin", "singleLine");
  accordionItem.changeFieldControl("body", "builtin", "markdown");
};

module.exports.down = migration => migration.deleteContentType("accordionItem");
