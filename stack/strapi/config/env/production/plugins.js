module.exports = ({ env }) => ({
  "users-permissions": {
    config: {
      jwtSecret: env("STRAPI_JWT_SECRET"),
    },
  },
  upload: {
    config: {
      provider: "aws-s3",
      providerOptions: {
        accessKeyId: env("STRAPI_AWS_ACCESS_KEY_ID"),
        secretAccessKey: env("STRAPI_AWS_SECRET_ACCESS_KEY"),
        region: env("STRAPI_AWS_REGION"),
        params: {
          Bucket: env("STRAPI_AWS_BUCKET_NAME"),
        },
      },
    },
  },
});
