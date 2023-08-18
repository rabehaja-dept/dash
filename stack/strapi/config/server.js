module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("STRAPI_APP_KEYS"),
  },
  // For local dev, STRAPI_URL is set by direnv to http://localhost:1337
  // For all deployed instances, we let it fall back to a default value of `strapi` which ends up being `/strapi/whatever` when loading assets and such, which is what we want
  url: env("STRAPI_URL", "strapi"),
});
