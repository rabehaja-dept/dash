module.exports = ({ env }) => ({
  "users-permissions": {
    config: {
      jwtSecret: env("STRAPI_JWT_SECRET"),
    },
  },
});
