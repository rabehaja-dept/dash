module.exports.description = "Create content model for Nav Container";

module.exports.up = (migration) => {
  const navContainer = migration.createContentType('navContainer')
    .name("Nav Container")
    .displayField("id")
    .description("A navigation container that holds navigation items or additional nested navigation containers.");
  
  navContainer.createField("id")
    .name("ID")
    .type("Symbol")
    .required(true);

  navContainer.createField("label")
    .name("Label")
    .type("Symbol")
    .localized(true)
    .required(true);

  navContainer.createField("items")
    .name("Items")
    .type("Array")
    .required(true)
    .items({"type":"Link","validations":[{"linkContentType":["navContainer","navItem"]}],"linkType":"Entry"});

  navContainer.changeFieldControl("id", "builtin", "singleLine", {"helpText":"The ID of this navigation container to associate it with an area on the site. Likely values: \"primary\", \"secondary\", \"header\", \"footer\", etc."});
  navContainer.changeFieldControl("label", "builtin", "singleLine", {"helpText":"This is only used when the navigation container is embedded inside another container (a subnav)."});
  navContainer.changeFieldControl("items", "builtin", "entryLinksEditor", {"helpText":"Items in this navigation container, either individual links or additional nested containers for a hierarchical nav.","bulkEditing":false,"showLinkEntityAction":true,"showCreateEntityAction":true});
};

module.exports.down = migration => migration.deleteContentType("navContainer");
