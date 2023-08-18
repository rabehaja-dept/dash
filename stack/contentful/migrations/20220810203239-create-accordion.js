module.exports.description = "Create content model for Accordion";

module.exports.up = (migration) => {
  const accordion = migration.createContentType('accordion')
    .name("Accordion")
    .displayField("title")
    .description("An accordion with multiple expandable/collapsible accordion items.");
  
  accordion.createField("title")
    .name("Title")
    .type("Symbol")
    .localized(true);

  accordion.createField("pretext")
    .name("Pretext")
    .type("Symbol")
    .localized(true);

  accordion.createField("accordionItems")
    .name("Accordion Items")
    .type("Array")
    .required(true)
    .items({"type":"Link","validations":[{"linkContentType":["accordionItem"]}],"linkType":"Entry"});

  accordion.createField("isFAQ")
    .name("Is this a FAQ Section?")
    .type("Boolean")
    .defaultValue({"en-US":false});

  accordion.changeFieldControl("title", "builtin", "singleLine");
  accordion.changeFieldControl("pretext", "builtin", "singleLine");
  accordion.changeFieldControl("accordionItems", "builtin", "entryLinksEditor");
  accordion.changeFieldControl("isFAQ", "builtin", "boolean", {"helpText":"If this field is a FAQ section, we attempt to add metadata to improve SEO","trueLabel":"Yes","falseLabel":"No"});
};

module.exports.down = migration => migration.deleteContentType("accordion");
