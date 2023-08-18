module.exports = ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env("PGHOST", "localhost"),
      port: env.int("PGPORT", 5432),
      database: "strapi",
      user: env("PGUSER", "postgres"),
      password: env("PGPASSWORD", "postgres"),
      ssl: false,
    },
  },
});
