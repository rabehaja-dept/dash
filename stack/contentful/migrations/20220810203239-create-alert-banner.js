module.exports.description = "Create content model for Alert Banner";

module.exports.up = (migration) => {
  const alertBanner = migration.createContentType('alertBanner')
    .name("Alert Banner")
    .displayField("content")
    .description("An alert banner to show at the top of the website.");
  
  alertBanner.createField("content")
    .name("Content")
    .type("Text")
    .required(true);

  alertBanner.changeFieldControl("content", "builtin", "multipleLine");
};

module.exports.down = migration => migration.deleteContentType("alertBanner");
