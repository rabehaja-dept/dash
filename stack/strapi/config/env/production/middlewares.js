module.exports = ({ env }) => {
  [
    "strapi::errors",
    "strapi::cors",
    "strapi::poweredBy",
    "strapi::logger",
    "strapi::query",
    "strapi::body",
    "strapi::session",
    "strapi::favicon",
    "strapi::public",
    {
      name: "strapi::security",
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            "connect-src": ["'self'", "https:"],
            "img-src": [
              "'self'",
              "data:",
              "blob:",
              "https://dl.airtable.com/",
              "https://dl.airtable.com",
              "s3.amazonaws.com",
              "dl.airtable.com", // strapi marketplace
              "https://s3.*",
              "https://s3.amazonaws.com",
              `${env("STRAPI_AWS_BUCKET_NAME")}.s3.${env(
                "STRAPI_AWS_REGION"
              )}.amazonaws.com`,
              `https://${env("STRAPI_AWS_BUCKET_NAME")}.s3.${env(
                "STRAPI_AWS_REGION"
              )}.amazonaws.com`,
              `${env("STRAPI_AWS_BUCKET_NAME")}.s3.amazonaws.com`,
              `https://s3.${env("STRAPI_AWS_REGION")}.amazonaws.com`,
              `https://s3.${env("STRAPI_AWS_REGION")}.amazonaws.com/${env(
                "STRAPI_AWS_BUCKET_NAME"
              )}`,
            ],
            "media-src": [
              "'self'",
              "data:",
              "blob:",
              "https://dl.airtable.com/",
              "https://dl.airtable.com",
              "s3.amazonaws.com",
              "dl.airtable.com", // strapi marketplace
              "https://s3.*",
              "https://s3.amazonaws.com",
              `${env("STRAPI_AWS_BUCKET_NAME")}.s3.${env(
                "STRAPI_AWS_REGION"
              )}.amazonaws.com`,
              `https://${env("STRAPI_AWS_BUCKET_NAME")}.s3.${env(
                "STRAPI_AWS_REGION"
              )}.amazonaws.com`,
              `${env("STRAPI_AWS_BUCKET_NAME")}.s3.amazonaws.com`,
              `https://s3.${env("STRAPI_AWS_REGION")}.amazonaws.com`,
              `https://s3.${env("STRAPI_AWS_REGION")}.amazonaws.com/${env(
                "STRAPI_AWS_BUCKET_NAME"
              )}`,
            ],
            upgradeInsecureRequests: null,
          },
        },
      },
    },
  ];
};
