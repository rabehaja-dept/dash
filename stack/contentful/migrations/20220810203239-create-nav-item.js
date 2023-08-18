module.exports.description = "Create content model for Nav Item";

module.exports.up = (migration) => {
  const navItem = migration.createContentType('navItem')
    .name("Nav Item")
    .displayField("label")
    .description("A single navigation item (usually rendered as a link or button).");
  
  navItem.createField("label")
    .name("Label")
    .type("Symbol")
    .localized(true)
    .required(true);

  navItem.createField("url")
    .name("URL")
    .type("Symbol")
    .required(true);

  navItem.createField("externalUrl")
    .name("External URL?")
    .type("Boolean")
    .required(true)
    .defaultValue({"en-US":false});

  navItem.changeFieldControl("label", "builtin", "singleLine");
  navItem.changeFieldControl("url", "builtin", "singleLine", {"helpText":"An internal path in the format of \"/home\", or an external URL like \"https://www.google.com/\". If it's external, make sure to select \"Yes\" for \"External URL\" below."});
  navItem.changeFieldControl("externalUrl", "builtin", "boolean");
};

module.exports.down = migration => migration.deleteContentType("navItem");
